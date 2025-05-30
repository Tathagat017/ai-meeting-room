const { v4: uuidv4 } = require("uuid");

//class task or type task to generate a new task or update task an existing task
class Task {
  constructor(description, assignee, dueDate, priority = "P3") {
    this.id = uuidv4();
    this.description = description;
    this.assignee = assignee;
    this.dueDate = dueDate;
    this.priority = priority;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isCompleted = false;
  }

  toJSON() {
    return {
      id: this.id,
      description: this.description,
      assignee: this.assignee,
      dueDate: this.dueDate,
      priority: this.priority,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isCompleted: this.isCompleted,
    };
  }
}

module.exports = Task;
