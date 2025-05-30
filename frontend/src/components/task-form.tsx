import { useState } from "react";
import {
  TextInput,
  Button,
  Paper,
  Text,
  Group,
  Stack,
  Alert,
  Box,
  Tooltip,
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { useStore } from "../hooks/use-store";
import { observer } from "mobx-react-lite";
import { ParsedTaskData } from "../types/tasks";
import "../styles/glass.css";
import "../styles/responsive.css";
import { notifications } from "@mantine/notifications";

export const TaskForm = observer(() => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { taskStore } = useStore();

  const handleParse = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await taskStore.parseTask(input);
    } catch (error) {
      console.error("Error parsing task:", error);
      setError("Failed to parse task. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (task: ParsedTaskData) => {
    setLoading(true);
    setError(null);
    try {
      await taskStore.acceptParsedTask(task);
      setInput("");
      await taskStore.getTasks();
      notifications.show({
        title: "Task accepted",
        message: "Task accepted successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task. Please try again.");
      notifications.show({
        title: "Error",
        message: "Failed to create task. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    await taskStore.rejectParsedTask();
    setInput("");
    notifications.show({
      title: "Task rejected",
      message: "Task rejected successfully",
      color: "indigo",
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Use proper timezone conversion to IST
      const istDateString = date.toLocaleString("en-IN", {
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
      return dateString;
    }
  };

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
        <div>
          <Group spacing="xs" align="center" mb="xs">
            <Text size="sm" fw={500}>
              Enter task in natural language
            </Text>
            <Tooltip
              label="Date format: DD/MM/YYYY (e.g., 15/06/2025 for 15th June 2025). Time format: 12-hour (4 am, 2 pm) or 24-hour (16:00). All times are in IST."
              multiline
              width={300}
              withArrow
            >
              <FontAwesomeIcon
                icon={faQuestionCircle}
                style={{ color: "#868e96", cursor: "help", fontSize: "14px" }}
              />
            </Tooltip>
          </Group>
          <TextInput
            className="form-input"
            placeholder="e.g., Finish landing page Aman by 15/06/2025 11pm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            size="md"
          />
        </div>

        <Group className="task-form-buttons">
          <Button
            onClick={handleParse}
            loading={loading}
            disabled={taskStore.ParsedIndividualTasks.length > 0}
          >
            Generate Task
          </Button>
        </Group>

        {error && (
          <Alert title="Error" color="red">
            {error}
          </Alert>
        )}
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
        {taskStore.ParsedIndividualTasks.map((task, index) => (
          <Paper key={index} withBorder style={{ backgroundColor: "#f8f9fa" }}>
            <div className="generated-task-details">
              <div className="generated-task-info">
                <div className="generated-task-field description">
                  <Text size="sm" c="dimmed">
                    Description
                  </Text>
                  <Text size="sm" fw={500}>
                    {task.description}
                  </Text>
                </div>
                <div className="generated-task-field">
                  <Text size="sm" c="dimmed">
                    Assignee
                  </Text>
                  <Text size="sm" fw={500}>
                    {task.assignee}
                  </Text>
                </div>
                <div className="generated-task-field">
                  <Text size="sm" c="dimmed">
                    Due Date
                  </Text>
                  <Text size="sm" fw={500}>
                    {formatDate(task.dueDate)}
                  </Text>
                </div>
                <div className="generated-task-field">
                  <Text size="sm" c="dimmed">
                    Priority
                  </Text>
                  <Text size="sm" fw={500}>
                    {task.priority || "P3"}
                  </Text>
                </div>
              </div>
              <div className="generated-task-actions">
                <Button
                  onClick={() => handleAccept(task)}
                  loading={loading}
                  color="green"
                  size="sm"
                >
                  Add Task
                </Button>
                <Button
                  onClick={handleReject}
                  variant="light"
                  color="red"
                  size="sm"
                >
                  Reject task
                </Button>
              </div>
            </div>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
});
