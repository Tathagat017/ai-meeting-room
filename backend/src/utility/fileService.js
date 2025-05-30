const fs = require("fs").promises;
const path = require("path");

const DB_FILE = path.join(__dirname, "../../database.json");

class FileService {
  static async initializeDatabase() {
    try {
      await fs.access(DB_FILE);
    } catch (error) {
      // If file doesn't exist, create it with empty tasks array
      await fs.writeFile(DB_FILE, JSON.stringify({ tasks: [] }));
    }
  }

  static async readDatabase() {
    try {
      const data = await fs.readFile(DB_FILE, "utf8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error("Error reading database: " + error.message);
    }
  }

  static async writeDatabase(data) {
    try {
      await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error("Error writing to database: " + error.message);
    }
  }

  static async getAllTasks() {
    const db = await this.readDatabase();
    return db.tasks;
  }

  static async addTask(task) {
    const db = await this.readDatabase();
    db.tasks.push(task);
    await this.writeDatabase(db);
    return task;
  }

  static async addMultipleTasks(tasks) {
    const db = await this.readDatabase();
    db.tasks.push(...tasks);
    await this.writeDatabase(db);
    return tasks;
  }

  static async updateTask(taskId, updates) {
    const db = await this.readDatabase();
    const taskIndex = db.tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    db.tasks[taskIndex] = {
      ...db.tasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
    };

    await this.writeDatabase(db);
    return db.tasks[taskIndex];
  }

  static async deleteTask(taskId) {
    const db = await this.readDatabase();
    const taskIndex = db.tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    const deletedTask = db.tasks[taskIndex];
    db.tasks.splice(taskIndex, 1);
    await this.writeDatabase(db);
    return deletedTask;
  }
}

module.exports = FileService;
