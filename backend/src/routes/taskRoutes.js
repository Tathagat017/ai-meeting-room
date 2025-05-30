const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/taskController");

// Get all tasks
router.get("/", TaskController.getAllTasks);

// Create a new task from natural language
router.post("/", TaskController.createTask);

// Create multiple tasks from transcript
router.post("/multi", TaskController.createMultipleTasks);

// Update a task
router.post("/update/:taskId", TaskController.updateTask);

// Delete a task
router.delete("/:taskId", TaskController.deleteTask);

// Parse a single task (without saving)
router.post("/parse", TaskController.parseTask);

// Parse a transcript (without saving)
router.post("/parse/transcript", TaskController.parseTranscript);

// Reorder tasks
router.post("/reorder", TaskController.reorderTasks);

module.exports = { taskRouter: router };
