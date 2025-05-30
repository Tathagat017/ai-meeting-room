import { useState } from "react";
import {
  Textarea,
  Button,
  Paper,
  Text,
  Group,
  Stack,
  Alert,
  FileButton,
  ActionIcon,
  Tooltip,
  Box,
} from "@mantine/core";
import { useStore } from "../hooks/use-store";
import { observer } from "mobx-react-lite";
import { ParsedTaskData } from "../types/tasks";
import { notifications } from "@mantine/notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faUpload,
  faCircleInfo,
  faArrowRight,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useAudioRecorder } from "../hooks/use-audio-recorder";
import { AudioService } from "../services/audio-service";
import "../styles/glass.css";
import "../styles/responsive.css";

export const TranscriptParser = observer(() => {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { taskStore } = useStore();
  const {
    isRecording,
    audioBlob,
    error: recordingError,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const handleParse = async () => {
    if (!transcript.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await taskStore.parseTranscript(transcript);
    } catch (error) {
      console.error("Error parsing transcript:", error);
      setError(
        "Failed to parse transcript. Please check your input and try again."
      );
      notifications.show({
        title: "Error",
        message: "Failed to parse transcript",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAll = async () => {
    if (taskStore.parsedTranscriptTasks.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      await taskStore.createMultipleTasks(taskStore.parsedTranscriptTasks);
      setTranscript("");
      notifications.show({
        title: "Success",
        message: "All tasks created successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error creating tasks:", error);
      setError("Failed to create tasks. Please try again.");
      notifications.show({
        title: "Error",
        message: "Failed to create tasks",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectAll = () => {
    taskStore.rejectAllTranscriptTasks();
    setTranscript("");
    notifications.show({
      title: "Success",
      message: "All tasks rejected successfully",
      color: "indigo",
    });
  };

  const handleAcceptTask = async (task: ParsedTaskData) => {
    setLoading(true);
    setError(null);
    try {
      await taskStore.acceptTranscriptTask(task);
      notifications.show({
        title: "Success",
        message: "Task accepted successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error accepting task:", error);
      setError("Failed to accept task. Please try again.");
      notifications.show({
        title: "Error",
        message: "Failed to accept task",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectTask = (task: ParsedTaskData) => {
    taskStore.rejectTranscriptTask(task);
    notifications.show({
      title: "Success",
      message: "Task rejected",
      color: "green",
    });
  };

  const handleRecordingComplete = async () => {
    if (!audioBlob) return;

    setLoading(true);
    try {
      const transcriptText = await AudioService.transcribeAudio(audioBlob);
      setTranscript(transcriptText);
      resetRecording();
      notifications.show({
        title: "Success",
        message: "Audio transcribed successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error transcribing audio:", error);
      notifications.show({
        title: "Error",
        message: "Failed to transcribe audio",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      await AudioService.validateAudioFile(file);
      setLoading(true);
      const transcriptText = await AudioService.transcribeAudio(file);
      setTranscript(transcriptText);
      notifications.show({
        title: "Success",
        message: "Audio file transcribed successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error processing audio file:", error);
      notifications.show({
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to process audio file",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
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
        <Group position="apart" className="transcript-header">
          <Text size="lg" fw={500}>
            Add tasks from text transcript / record live audio / upload audio
          </Text>
          <Group spacing="xs" className="transcript-actions">
            <Tooltip
              label="Supported audio formats: WAV, MP3, MPEG, WebM. Max file size: 10MB"
              position="bottom"
              multiline
              width={220}
            >
              <ActionIcon variant="subtle" color="gray">
                <FontAwesomeIcon icon={faCircleInfo} />
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label={
                isRecording
                  ? "Stop Recording"
                  : "Start Recording (Max 5 minutes)"
              }
              position="bottom"
            >
              <ActionIcon
                variant="filled"
                color={isRecording ? "red" : "blue"}
                onClick={isRecording ? stopRecording : startRecording}
                loading={loading}
              >
                <FontAwesomeIcon
                  icon={isRecording ? faMicrophoneSlash : faMicrophone}
                  size="sm"
                />
              </ActionIcon>
            </Tooltip>
            <FileButton
              onChange={handleFileUpload}
              accept="audio/wav,audio/mp3,audio/mpeg,audio/webm"
            >
              {(props) => (
                <Tooltip label="Upload Audio File" position="bottom">
                  <ActionIcon variant="filled" color="blue" {...props}>
                    <FontAwesomeIcon icon={faUpload} size="sm" />
                  </ActionIcon>
                </Tooltip>
              )}
            </FileButton>
          </Group>
        </Group>

        {recordingError && (
          <Alert title="Recording Error" color="red">
            {recordingError}
          </Alert>
        )}

        <div>
          <Group spacing="xs" align="center" mb="xs">
            <Text size="sm" fw={500}>
              Enter meeting transcript or use audio input
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
          <Textarea
            className="form-input transcript-textarea"
            placeholder="e.g., Aman you take the landing page by 15/06/2025 10pm. Rajeev you take care of client follow-up by Wednesday."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            minRows={4}
            size="md"
          />
        </div>

        <Group className="task-form-buttons">
          <Button
            onClick={handleParse}
            loading={loading}
            disabled={
              taskStore.parsedTranscriptTasks.length > 0 || !transcript.trim()
            }
            rightIcon={<FontAwesomeIcon icon={faArrowRight} />}
          >
            Generate tasks from transcript
          </Button>
          {taskStore.parsedTranscriptTasks.length > 0 && (
            <>
              <Button onClick={handleAcceptAll} loading={loading} color="green">
                Accept All Tasks
              </Button>
              <Button onClick={handleRejectAll} variant="light" color="red">
                Reject All Tasks
              </Button>
            </>
          )}
        </Group>

        {error && (
          <Alert title="Error" color="red">
            {error}
          </Alert>
        )}

        {audioBlob && (
          <Group className="task-form-buttons">
            <Button
              onClick={handleRecordingComplete}
              loading={loading}
              color="blue"
            >
              Transcribe Recording
            </Button>
            <Button onClick={resetRecording} variant="light">
              Discard Recording
            </Button>
          </Group>
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
        {taskStore.parsedTranscriptTasks.length > 0 && (
          <Paper p="md" withBorder style={{ backgroundColor: "#f8f9fa" }}>
            <Stack spacing="md">
              <Text size="sm" fw={500}>
                Generated Tasks ({taskStore.parsedTranscriptTasks.length}):
              </Text>
              {taskStore.parsedTranscriptTasks.map((task, index) => (
                <Paper key={index} p="xs" withBorder className="task-item">
                  <Stack className="task-item-content">
                    <Text size="sm">Description: {task.description}</Text>
                    <Text size="sm">Assignee: {task.assignee}</Text>
                    <Text size="sm">Due Date: {formatDate(task.dueDate)}</Text>
                    <Text size="sm">Priority: {task.priority || "P3"}</Text>
                    <Group className="task-form-buttons">
                      <Button
                        onClick={() => handleAcceptTask(task)}
                        loading={loading}
                        size="xs"
                        color="green"
                      >
                        Accept Task
                      </Button>
                      <Button
                        onClick={() => handleRejectTask(task)}
                        variant="light"
                        size="xs"
                        color="red"
                      >
                        Reject Task
                      </Button>
                    </Group>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        )}
      </Box>
    </Paper>
  );
});
