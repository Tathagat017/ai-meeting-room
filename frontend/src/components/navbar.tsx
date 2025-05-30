import { Group, Title, Paper } from "@mantine/core";
import Logo from "../assets/logo.jpg";
import "../styles/responsive.css";

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
            className="navbar-logo"
            style={{ borderRadius: "50%", width: "40px", height: "40px" }}
          />
          <Title order={3} className="navbar-title">
            AI Task Manager
          </Title>
        </Group>
      </Group>
    </Paper>
  );
}
