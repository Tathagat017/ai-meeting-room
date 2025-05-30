const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");

const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

const { taskRouter } = require("./src/routes/taskRoutes");
const { transcribeRouter } = require("./src/routes/transcribeRoutes");

const FileService = require("./src/utility/fileService");

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
FileService.initializeDatabase().catch(console.error);

app.get("/", (req, res) => {
  res.send("Api server is running");
});

app.use("/api/tasks", taskRouter);
app.use("/api/transcribe", transcribeRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

//error handling
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.SERVER_PORT || 8080;
server.listen(PORT, console.log(`Server running on PORT ${PORT}...`));
