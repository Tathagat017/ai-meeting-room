import { QueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { ParsedTaskData, Task, UpdateTaskRequest } from "../types/tasks";

export class TaskStore {
  queryClient: QueryClient;
  tasks: Task[] = [];
  parsedIndividualTasks: ParsedTaskData[] = [];
  parsedTranscriptTasks: ParsedTaskData[] = [];
  loading: boolean = false;
  tasksLoaded: boolean = false;
  private baseUrl: string = import.meta.env.VITE_API_BASE_URL;

  constructor(queryClient: QueryClient) {
    makeAutoObservable(this);
    this.queryClient = queryClient;
  }

  get Tasks() {
    return this.tasks;
  }

  get ParsedIndividualTasks() {
    return this.parsedIndividualTasks;
  }

  get ParsedTranscriptTasks() {
    return this.parsedTranscriptTasks;
  }

  get Loading() {
    return this.loading;
  }

  get TasksLoaded() {
    return this.tasksLoaded;
  }
  // API calls
  async getTasks(): Promise<Task[]> {
    if (this.tasksLoaded) {
      return this.tasks;
    }

    try {
      runInAction(() => {
        this.loading = true;
      });

      const response: AxiosResponse<Task[]> = await axios.get(
        `${this.baseUrl}/api/tasks`
      );

      runInAction(() => {
        this.tasks = response.data;
        this.tasksLoaded = true;
        this.loading = false;
      });

      return response.data;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async parseTask(text: string): Promise<ParsedTaskData> {
    try {
      const response: AxiosResponse<ParsedTaskData> = await axios.post(
        `${this.baseUrl}/api/tasks/parse`,
        { text }
      );

      runInAction(() => {
        this.parsedIndividualTasks = [response.data];
      });

      return response.data;
    } catch (error) {
      console.error("Error parsing task:", error);
      throw error;
    }
  }

  async acceptParsedTask(task: ParsedTaskData): Promise<void> {
    try {
      await this.createTask(task);
      runInAction(() => {
        this.parsedIndividualTasks = this.parsedIndividualTasks.filter(
          (t) => t !== task
        );
      });
    } catch (error) {
      console.error("Error accepting parsed task:", error);
      throw error;
    }
  }

  async createTask(task: ParsedTaskData): Promise<Task> {
    try {
      const response: AxiosResponse<Task> = await axios.post(
        `${this.baseUrl}/api/tasks`,
        {
          text: JSON.stringify(task),
        }
      );

      runInAction(() => {
        this.tasks.push(response.data);
        this.queryClient.invalidateQueries({ queryKey: ["tasks"] });
      });

      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async rejectParsedTask() {
    runInAction(() => {
      this.parsedIndividualTasks = [];
    });
  }

  async parseTranscript(transcript: string): Promise<ParsedTaskData[]> {
    try {
      const response: AxiosResponse<ParsedTaskData[]> = await axios.post(
        `${this.baseUrl}/api/tasks/parse/transcript`,
        {
          transcript,
        }
      );

      runInAction(() => {
        this.parsedTranscriptTasks = response.data;
      });

      return response.data;
    } catch (error) {
      console.error("Error parsing transcript:", error);
      throw error;
    }
  }

  async createMultipleTasks(tasks: ParsedTaskData[]): Promise<Task[]> {
    try {
      const response: AxiosResponse<Task[]> = await axios.post(
        `${this.baseUrl}/api/tasks/multi`,
        { parsedTasks: tasks }
      );

      runInAction(() => {
        this.tasks.push(...response.data);
        this.parsedTranscriptTasks = [];
      });

      return response.data;
    } catch (error) {
      console.error("Error creating multiple tasks:", error);
      throw error;
    }
  }

  async acceptTranscriptTask(task: ParsedTaskData): Promise<void> {
    try {
      const response = await this.createTask(task);
      runInAction(() => {
        this.parsedTranscriptTasks = this.parsedTranscriptTasks.filter(
          (t) => t !== task
        );
        this.tasks.push(response);
      });
    } catch (error) {
      console.error("Error accepting transcript task:", error);
      throw error;
    }
  }

  rejectTranscriptTask(task: ParsedTaskData) {
    runInAction(() => {
      this.parsedTranscriptTasks = this.parsedTranscriptTasks.filter(
        (t) => t !== task
      );
    });
  }

  rejectAllTranscriptTasks() {
    runInAction(() => {
      this.parsedTranscriptTasks = [];
    });
  }

  async updateTask(updateRequest: UpdateTaskRequest): Promise<Task> {
    try {
      const response: AxiosResponse<Task> = await axios.post(
        `${this.baseUrl}/api/tasks/update/${updateRequest.id}`,
        updateRequest
      );

      runInAction(() => {
        const index = this.tasks.findIndex((t) => t.id === updateRequest.id);
        if (index !== -1) {
          this.tasks[index] = response.data;
          this.tasks = [...this.tasks];
        }
      });

      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/api/tasks/${taskId}`);
      runInAction(() => {
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
        this.queryClient.invalidateQueries({ queryKey: ["tasks"] });
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  setTasks(tasks: Task[]) {
    runInAction(() => {
      this.tasks = tasks;
    });
  }

  async reorderTasks(tasks: Task[]) {
    try {
      const response: AxiosResponse = await axios.post(
        `${this.baseUrl}/api/tasks/reorder`,
        tasks
      );

      runInAction(() => {
        this.tasks = response.data.tasks;
      });

      return response.data;
    } catch (error) {
      console.error("Error reordering tasks:", error);
      throw error;
    }
  }
}
