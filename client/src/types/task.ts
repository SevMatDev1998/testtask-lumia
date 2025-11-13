export interface Task {
  id: string;
  title: string;
  description: string;
  telegramTaskId: string;
  rewardPoints: number;
  createdAt: string;
}

export interface UserTask {
  id: string;
  userId: string;
  taskId: string;
  verified: boolean;
  completedAt: string | null;
  task?: Task;
}

export interface UserScore {
  score: number;
  completedTasks: number;
  tasks: UserTask[];
}
