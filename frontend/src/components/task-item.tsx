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
import "../styles/responsive.css";

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
        <Paper
          p="md"
          withBorder
          ref={setNodeRef}
          style={style}
          className="task-item"
        >
          <Group className="task-item-content">
            <div className="task-item-header">
              <div
                {...attributes}
                {...listeners}
                style={{ cursor: "grab" }}
                className="task-item-drag"
              >
                <FontAwesomeIcon icon={faGripVertical} size="sm" />
              </div>

              <div className="task-item-checkbox">
                {isLoading ? (
                  <Loader size="xs" />
                ) : (
                  <Checkbox
                    size="xs"
                    checked={task.isCompleted}
                    onChange={(event) => {
                      handleStatusChange(event.currentTarget.checked);
                    }}
                  />
                )}
              </div>

              <div className="task-item-main">
                <Highlight
                  highlight={searchQuery}
                  size="sm"
                  highlightStyles={{ backgroundColor: "#ffe066" }}
                >
                  {task.description}
                </Highlight>
              </div>
            </div>

            <div className="task-item-details">
              <Group spacing="xs" className="task-item-assignee">
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

              <div className="task-item-meta">
                <Group spacing="xs">
                  {task.isCompleted && (
                    <Badge size="xs" color="green">
                      Completed
                    </Badge>
                  )}
                  <Text size="xs" c="dimmed">
                    Due: {formatDate(task.dueDate)}
                  </Text>
                  <Group spacing="xs" noWrap>
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
                </Group>
              </div>

              <div className="task-item-actions">
                <Button
                  size="xs"
                  variant="subtle"
                  color="red"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Group>
        </Paper>

        <Modal
          opened={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Delete"
          size="sm"
          centered
        >
          <Stack>
            <Text size="sm">Are you sure you want to delete this task?</Text>
            <Group position="right" className="task-form-buttons">
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
