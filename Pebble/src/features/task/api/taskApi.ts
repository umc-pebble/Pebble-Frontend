import { apiRequest } from "@/services/api";
import type { TaskItem } from "@/types";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import {
  mapScheduleInputToCreateTaskRequest,
  mapScheduleInputToUpdateTaskRequest,
  mapTaskResponseToTask,
} from "./taskMapper";
import type { GetTasksResponse, TaskDeleteScope, TaskResponse } from "./taskApi.types";

export async function getTasks(baseDate?: string): Promise<TaskItem[]> {
  const data = await apiRequest<GetTasksResponse>({
    method: "GET",
    url: "/tasks",
    params: baseDate ? { baseDate } : undefined,
  });

  return data?.tasks.map(mapTaskResponseToTask) ?? [];
}

export async function getStandaloneTasks(baseDate?: string): Promise<TaskItem[]> {
  const tasks = await getTasks(baseDate);

  return tasks.filter((task) => !task.categoryId && !task.milestoneId);
}

export async function getMilestoneTasks(
  milestoneId: string,
): Promise<TaskItem[]> {
  const data = await apiRequest<GetTasksResponse>({
    method: "GET",
    url: `/milestones/${milestoneId}/tasks`,
  });

  return data?.tasks.map(mapTaskResponseToTask) ?? [];
}

export async function createTask({
  categoryId,
  milestoneId,
  input,
}: {
  categoryId?: string | null;
  milestoneId?: string | null;
  input: CreateScheduleItemInput;
}): Promise<TaskItem | null> {
  const data = await apiRequest<TaskResponse>({
    method: "POST",
    url: "/tasks",
    data: mapScheduleInputToCreateTaskRequest({ categoryId, milestoneId, input }),
  });

  return data ? mapTaskResponseToTask(data) : null;
}

export async function updateTask({
  taskId,
  input,
  isChildTask,
}: {
  taskId: string;
  input: CreateScheduleItemInput;
  isChildTask: boolean;
}): Promise<TaskItem | null> {
  const data = await apiRequest<TaskResponse>({
    method: "PATCH",
    url: `/tasks/${taskId}`,
    data: mapScheduleInputToUpdateTaskRequest({ input, isChildTask }),
  });

  return data ? mapTaskResponseToTask(data) : null;
}

export async function deleteTask({
  taskId,
  deleteScope,
}: {
  taskId: string;
  deleteScope?: TaskDeleteScope;
}): Promise<void> {
  await apiRequest({
    method: "DELETE",
    url: `/tasks/${taskId}`,
    params: deleteScope ? { deleteScope } : undefined,
  });
}

export async function toggleTaskComplete(taskId: string): Promise<void> {
  await apiRequest({
    method: "PATCH",
    url: `/tasks/${taskId}/complete`,
  });
}
