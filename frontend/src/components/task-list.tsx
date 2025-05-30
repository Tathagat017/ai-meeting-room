import { useMemo, useState, useEffect } from "react";
import {
  Paper,
  Text,
  Stack,
  Select,
  Group,
  Loader,
  TextInput,
  Box,
} from "@mantine/core";
import { TaskItem } from "./task-item";
import { useStore } from "../hooks/use-store";
import { UpdateTaskRequest } from "../types/tasks";
import { observer } from "mobx-react-lite";
import "../styles/glass.css";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/date-picker.css";
import "../styles/responsive.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import { notifications } from "@mantine/notifications";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export const TaskList = observer(() => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { taskStore } = useStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Load tasks when component mounts
    taskStore.getTasks();
  }, [taskStore]);

  const handleDelete = async (taskId: string) => {
    try {
      await taskStore.deleteTask(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdate = async (
    taskId: string,
    updates: Partial<UpdateTaskRequest>
  ) => {
    try {
      await taskStore.updateTask({ id: taskId, ...updates });
      // Force a re-render of the filtered tasks
      taskStore.setTasks([...taskStore.Tasks]);
    } catch (error) {
      console.error("Error updating task:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update task",
        color: "red",
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = taskStore.Tasks.findIndex(
        (task) => task.id === active.id
      );
      const newIndex = taskStore.Tasks.findIndex((task) => task.id === over.id);

      const newTasks = arrayMove(taskStore.Tasks, oldIndex, newIndex);
      taskStore.setTasks(newTasks);

      // Call API to update task order
      try {
        await taskStore.reorderTasks(newTasks);
        notifications.show({
          title: "Success",
          message: "Tasks reordered successfully",
          color: "green",
        });
      } catch (error) {
        console.error("Error reordering tasks:", error);
        notifications.show({
          title: "Error",
          message: "Failed to reorder tasks",
          color: "red",
        });
        // Revert to original order if API call fails
        await taskStore.getTasks();
      }
    }
  };

  const filteredTasks = useMemo(() => {
    console.log("Recalculating filtered tasks"); // Debug log
    let tasks = [...taskStore.Tasks];

    // Apply status filter
    if (statusFilter === "completed") {
      tasks = tasks.filter((task) => task.isCompleted);
    } else if (statusFilter === "pending") {
      tasks = tasks.filter((task) => !task.isCompleted);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      tasks = tasks.filter((task) => task.priority === priorityFilter);
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0);
      tasks = tasks.filter((task) => {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === filterDate.getTime();
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tasks = tasks.filter(
        (task) =>
          task.description.toLowerCase().includes(query) ||
          task.assignee.toLowerCase().includes(query) ||
          task.priority.toLowerCase().includes(query)
      );
    }

    return tasks;
  }, [taskStore.Tasks, statusFilter, priorityFilter, dateFilter, searchQuery]);

  if (taskStore.Loading) {
    return (
      <Paper p="md" withBorder className="glass" style={{ height: "100%" }}>
        <Stack align="center" py="xl">
          <Loader size="xs" />
          <Text>Loading tasks...</Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      p="md"
      withBorder
      className="glass"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Stack spacing="md" style={{ flex: "0 0 auto" }}>
        <Group align="flex-end" className="task-filters" noWrap>
          <Select
            className="form-input"
            size="xs"
            label="Status Filter"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || "all")}
            data={[
              { value: "all", label: "All Tasks" },
              { value: "completed", label: "Completed" },
              { value: "pending", label: "Pending" },
            ]}
          />
          <Select
            className="form-input"
            size="xs"
            label="Priority Filter"
            value={priorityFilter}
            onChange={(value) => setPriorityFilter(value || "all")}
            data={[
              { value: "all", label: "All Priorities" },
              { value: "P1", label: "P1 - High" },
              { value: "P2", label: "P2 - Medium High" },
              { value: "P3", label: "P3 - Medium" },
              { value: "P4", label: "P4 - Low" },
            ]}
          />
          <div className="form-input">
            <Text size="xs" style={{ marginBottom: "0.5rem" }}>
              Date Filter
            </Text>
            <DatePicker
              selected={dateFilter}
              onChange={(date) => setDateFilter(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Filter by date (DD/MM/YYYY)"
              isClearable
              className="date-picker-input"
              wrapperClassName="date-picker-wrapper"
            />
          </div>
          <TextInput
            className="form-input"
            size="xs"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<FontAwesomeIcon icon={faSearch} />}
          />
        </Group>
      </Stack>

      <Box
        style={{
          flex: 1,
          overflowY: "auto",
          marginTop: "1rem",
          paddingRight: "8px",
        }}
        className="custom-scroll"
      >
        {!filteredTasks || filteredTasks.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No tasks found
          </Text>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <Stack spacing="md">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    searchQuery={searchQuery}
                  />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        )}
      </Box>
    </Paper>
  );
});
