import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Badge,
  Button,
  Checkbox,
  Group,
  Loader,
  Modal,
  Paper,
  Stack,
  Text,
  Highlight,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Task, UpdateTaskRequest } from "../types/tasks";

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updates: Partial<UpdateTaskRequest>) => Promise<void>;
  searchQuery?: string;
}

const priorityColors = {
  P1: "red",
  P2: "yellow",
  P3: "blue",
  P4: "gray",
} as const;

export const TaskItem = observer(
  ({ task, onDelete, onUpdate, searchQuery = "" }: TaskItemProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: task.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    const handleStatusChange = async (checked: boolean) => {
      setIsLoading(true);
      try {
        await onUpdate(task.id, { isCompleted: checked });
        notifications.show({
          title: "Success",
          message: "Task status updated successfully",
          color: "green",
        });
      } catch (error) {
        console.error("Error updating task status:", error);
        notifications.show({
          title: "Error",
          message: "Failed to update task status",
          color: "red",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const handleConfirmDelete = async () => {
      try {
        await onDelete(task.id);
        notifications.show({
          title: "Success",
          message: "Task deleted successfully",
          color: "green",
        });
      } catch (error) {
        console.error("Error deleting task:", error);
        notifications.show({
          title: "Error",
          message: "Failed to delete task",
          color: "red",
        });
      }
      setDeleteModalOpen(false);
    };

    const formatDate = (date: Date) => {
      try {
        const d = new Date(date);
        // Use proper timezone conversion to IST
        const istDateString = d.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        // Convert from DD/MM/YYYY, HH:mm format to DD/MM/YYYY HH:mm IST
        const [datePart, timePart] = istDateString.split(", ");
        return `${datePart} ${timePart} IST`;
      } catch {
        return date.toString();
      }
    };

    return (
      <>
        <Paper p="md" withBorder ref={setNodeRef} style={style}>
          <Stack>
            <Group style={{ justifyContent: "space-between" }}>
              <Group>
                <div {...attributes} {...listeners} style={{ cursor: "grab" }}>
                  <FontAwesomeIcon icon={faGripVertical} />
                </div>
                {isLoading ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Loader size="xs" />
                  </div>
                ) : (
                  <Checkbox
                    size="xs"
                    checked={task.isCompleted}
                    onChange={(event) => {
                      handleStatusChange(event.currentTarget.checked);
                    }}
                  />
                )}
                <div>
                  <Highlight
                    highlight={searchQuery}
                    size="sm"
                    highlightStyles={{ backgroundColor: "#ffe066" }}
                  >
                    {task.description}
                  </Highlight>
                  <Group spacing="xs">
                    <Text size="xs" c="dimmed">
                      Assigned to:
                    </Text>
                    <Highlight
                      size="xs"
                      c="indigo.6"
                      highlight={searchQuery}
                      highlightStyles={{ backgroundColor: "#ffe066" }}
                    >
                      {task.assignee}
                    </Highlight>
                  </Group>
                </div>
              </Group>
              <Group spacing="md">
                <Group spacing="xs">
                  {task.isCompleted && (
                    <Badge size="xs" color="green">
                      Completed
                    </Badge>
                  )}
                  <Text size="xs" c="dimmed">
                    Due: {formatDate(task.dueDate)}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Priority:
                  </Text>
                  <Highlight
                    component={Badge}
                    size="xs"
                    color={
                      priorityColors[
                        task.priority as keyof typeof priorityColors
                      ]
                    }
                    highlight={searchQuery}
                    highlightStyles={{ backgroundColor: "#ffe066" }}
                  >
                    {task.priority}
                  </Highlight>
                </Group>
                <Button
                  size="xs"
                  variant="subtle"
                  color="red"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  Delete
                </Button>
              </Group>
            </Group>
          </Stack>
        </Paper>

        <Modal
          opened={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Delete"
          size="sm"
        >
          <Stack>
            <Text size="sm">Are you sure you want to delete this task?</Text>
            <Group position="right">
              <Button
                size="xs"
                variant="subtle"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button size="xs" color="red" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </Group>
          </Stack>
        </Modal>
      </>
    );
  }
);
