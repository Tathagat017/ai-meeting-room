import { Box, Container, Flex, Tabs, Text } from "@mantine/core";
import "../styles/glass.css";
import "../styles/responsive.css";
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
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Navbar />

      <Container
        size="lg"
        className="container"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: "1rem",
        }}
      >
        <Tabs
          defaultValue="add-task"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          keepMounted={false}
        >
          <Tabs.List className="tabs-container">
            <Tabs.Tab value="add-task">
              <Flex gap="xs" align="center">
                <FontAwesomeIcon icon={faPlus} />
                <Text size="sm" className="tab-text">
                  Add Task
                </Text>
              </Flex>
            </Tabs.Tab>
            <Tabs.Tab value="task-list">
              <Flex gap="xs" align="center">
                <FontAwesomeIcon icon={faList} />
                <Text size="sm" className="tab-text">
                  Task List
                </Text>
              </Flex>
            </Tabs.Tab>
            <Tabs.Tab value="transcript">
              <Flex gap="xs" align="center">
                <FontAwesomeIcon icon={faMicrophone} />
                <Text size="sm" className="tab-text">
                  Transcript
                </Text>
              </Flex>
            </Tabs.Tab>
          </Tabs.List>

          <Box
            style={{
              flex: 1,
              overflow: "hidden",
              marginTop: "0.5rem",
            }}
          >
            <Tabs.Panel
              value="add-task"
              style={{
                height: "100%",
                overflow: "hidden",
              }}
            >
              <TaskForm />
            </Tabs.Panel>

            <Tabs.Panel
              value="task-list"
              style={{
                height: "100%",
                overflow: "hidden",
              }}
            >
              <TaskList />
            </Tabs.Panel>

            <Tabs.Panel
              value="transcript"
              style={{
                height: "100%",
                overflow: "hidden",
              }}
            >
              <TranscriptParser />
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Container>
    </Box>
  );
}
