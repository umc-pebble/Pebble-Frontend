export type TaskDateType = "SINGLE" | "RANGE" | "MULTIPLE";
export type TaskEditScope = "THIS_ONLY" | "ALL";
export type TaskDeleteScope = "THIS_ONLY" | "ALL";

export type TaskDateResponse = {
  taskDateId: number;
  date: string;
  isCompleted?: boolean;
  completedAt?: string | null;
  name?: string;
  color?: string | null;
};

export type TaskResponse = {
  id: number;
  userId?: number;
  categoryId?: number | null;
  milestoneId?: number | null;
  name: string;
  dateType: TaskDateType;
  startDate?: string | null;
  endDate?: string | null;
  dates?: string[] | null;
  color?: string | null;
  isCompleted?: boolean;
  completedAt?: string | null;
  displayOrder?: number;
  taskDates?: TaskDateResponse[];
  createdAt?: string;
  updatedAt?: string;
};

export type GetTasksResponse = {
  tasks: TaskResponse[];
};

export type CreateTaskRequest = {
  categoryId?: number | null;
  milestoneId?: number | null;
  name: string;
  dateType: TaskDateType;
  startDate?: string | null;
  endDate?: string | null;
  dates?: string[] | null;
  color?: string | null;
};

export type UpdateTaskRequest = {
  name?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  dates?: string[] | null;
  color?: string | null;
  editScope?: TaskEditScope;
  taskDateId?: number;
};
