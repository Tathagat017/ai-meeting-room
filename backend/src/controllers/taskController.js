const Task = require("../models/task");
const FileService = require("../utility/fileService");
const OpenAIService = require("../utility/openAiService");
const fs = require("fs").promises;
const path = require("path");

class TaskController {
  static async getAllTasks(req, res) {
    try {
      const tasks = await FileService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createTask(req, res) {
    try {
      const { text } = req.body;
      const parsedTask = await OpenAIService.parseTask(text);
      const task = new Task(
        parsedTask.description,
        parsedTask.assignee,
        new Date(parsedTask.dueDate),
        parsedTask.priority
      );
      const savedTask = await FileService.addTask(task.toJSON());
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createMultipleTasks(req, res) {
    try {
      const { parsedTasks } = req.body;
      const tasks = parsedTasks.map(
        (task) =>
          new Task(
            task.description,
            task.assignee,
            new Date(task.dueDate),
            task.priority
          )
      );
      const savedTasks = await FileService.addMultipleTasks(
        tasks.map((task) => task.toJSON())
      );
      res.status(201).json(savedTasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateTask(req, res) {
    try {
      const { taskId } = req.params;
      const updates = req.body;
      const updatedTask = await FileService.updateTask(taskId, updates);
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteTask(req, res) {
    try {
      const { taskId } = req.params;
      const deletedTask = await FileService.deleteTask(taskId);
      res.json(deletedTask);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async parseTask(req, res) {
    try {
      const { text } = req.body;
      const parsedTask = await OpenAIService.parseTask(text);
      res.json(parsedTask);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async parseTranscript(req, res) {
    try {
      const { transcript } = req.body;
      const parsedTasks = await OpenAIService.parseTranscript(transcript);
      res.json(parsedTasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async reorderTasks(req, res) {
    try {
      const tasks = req.body;
      if (!Array.isArray(tasks)) {
        return res
          .status(400)
          .json({ error: "Invalid request body. Expected an array of tasks." });
      }

      // Save the reordered tasks directly to the database
      await fs.writeFile(
        path.join(__dirname, "../database.json"),
        JSON.stringify({ tasks }, null, 2)
      );

      res.json({ message: "Tasks reordered successfully", tasks });
    } catch (error) {
      console.error("Error reordering tasks:", error);
      res.status(500).json({ error: "Failed to reorder tasks" });
    }
  }
}

module.exports = TaskController;
