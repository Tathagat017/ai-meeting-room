import { Group, Title, Paper } from "@mantine/core";
import Logo from "../assets/logo.jpg";

export function Navbar() {
  return (
    <Paper
      style={{
        height: "60px",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
      shadow="sm"
      className="navbar"
    >
      <Group style={{ width: "100%", justifyContent: "space-between" }}>
        <Group>
          <img
            src={Logo}
            alt="Logo"
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
          />
          <Title order={3}> AI Task Manager</Title>
        </Group>
      </Group>
    </Paper>
  );
}
