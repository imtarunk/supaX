export type TaskType = "tweet" | "follow" | "like";

export interface TaskItem {
  type: TaskType;
  content: string;
}

export interface Task {
  id: string;
  icon: string;
  task: TaskItem[];
  points: number;
}
