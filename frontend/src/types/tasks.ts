// src/types/task.ts

/**
 * Priority levels for tasks
 */

export type TaskPriority = "P1" | "P2" | "P3" | "P4";

/**
 * Base task interface
 */
export interface Task {
  id: string;
  description: string;
  assignee: string;
  dueDate: Date;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
}

/**
 * Interface for creating a new task
 */
export interface CreateTaskRequest {
  naturalLanguageInput: string;
}

/**
 * Interface for the parsed task data before it's transformed into a Task
 */
export interface ParsedTaskData {
  description: string;
  assignee: string;
  dueDate: string; // Natural language date string (e.g., "tomorrow 5pm")
  priority?: TaskPriority; // Optional, defaults to P3
}

/**
 * Interface for the response when parsing a single task
 */
export interface ParseSingleTaskResponse {
  success: boolean;
  task?: ParsedTaskData;
  error?: string;
}

/**
 * Interface for parsing a meeting transcript
 */
export interface ParseTranscriptRequest {
  transcript: string;
}

/**
 * Interface for the response when parsing a transcript
 */
export interface ParseTranscriptResponse {
  success: boolean;
  tasks?: ParsedTaskData[];
  error?: string;
}

/**
 * Interface for updating a task
 */
export interface UpdateTaskRequest {
  id: string;
  description?: string;
  assignee?: string;
  dueDate?: Date | string;
  priority?: TaskPriority;
  isCompleted?: boolean;
}

/**
 * Interface for task filters
 */
export interface TaskFilters {
  assignee?: string;
  priority?: TaskPriority;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  isCompleted?: boolean;
}

/**
 * Interface for the task store state
 */

/**
 * Interface for the response from the API when fetching tasks
 */
export interface TasksResponse {
  success: boolean;
  data: Task[];
  error?: string;
}

/**
 * Interface for the response from the API for a single task operation
 */
export interface TaskResponse {
  success: boolean;
  data?: Task;
  error?: string;
}
