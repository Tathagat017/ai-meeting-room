import { Box, Container, Flex, Tabs, Text } from "@mantine/core";
import "../styles/glass.css";
import { Navbar } from "./navbar";
import { TaskForm } from "./task-form";
import { TaskList } from "./task-list";
import { TranscriptParser } from "./transcript-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faList,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";

export function Dashboard() {
  return (
    <Box
      className="dashboard-bg"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <Navbar />

      <Container size="lg" py="md" style={{ height: "calc(100vh - 60px)" }}>
        <Tabs defaultValue="add-task" style={{ height: "100%" }}>
          <Tabs.List>
            <Tabs.Tab value="add-task">
              <Flex gap="xs" align="center">
                <FontAwesomeIcon icon={faPlus} />
                <Text size="sm">Add Task</Text>
              </Flex>
            </Tabs.Tab>
            <Tabs.Tab value="task-list">
              <Flex gap="xs" align="center">
                <FontAwesomeIcon icon={faList} />
                <Text size="sm">Task List</Text>
              </Flex>
            </Tabs.Tab>
            <Tabs.Tab value="transcript">
              <Flex gap="xs" align="center">
                <FontAwesomeIcon icon={faMicrophone} />
                <Text size="sm">Transcript</Text>
              </Flex>
            </Tabs.Tab>
          </Tabs.List>

          <Box style={{ height: "calc(100% - 36px)" }}>
            <Tabs.Panel value="add-task" pt="md" style={{ height: "100%" }}>
              <TaskForm />
            </Tabs.Panel>

            <Tabs.Panel value="task-list" pt="md" style={{ height: "100%" }}>
              <TaskList />
            </Tabs.Panel>

            <Tabs.Panel value="transcript" pt="md" style={{ height: "100%" }}>
              <TranscriptParser />
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Container>
    </Box>
  );
}
