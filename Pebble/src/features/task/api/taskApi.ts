import { apiRequest } from "@/services/api";
import type { TaskItem } from "@/types";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import {
  mapScheduleInputToCreateTaskRequest,
  mapScheduleInputToUpdateTaskRequest,
  mapTaskResponseToTask,
} from "./taskMapper";
import type { GetTasksResponse, TaskDeleteScope, TaskResponse } from "./taskApi.types";

export async function getStandaloneTasks(baseDate?: string): Promise<TaskItem[]> {
  const data = await apiRequest<GetTasksResponse>({
    method: "GET",
    url: "/tasks",
    params: baseDate ? { baseDate } : undefined,
  });

  return data?.tasks.map(mapTaskResponseToTask) ?? [];
}

export async function getUserTasks(
  userId: number,
  baseDate?: string,
): Promise<TaskItem[]> {
  const data = await apiRequest<GetTasksResponse>({
    method: "GET",
    url: `/tasks/users/${userId}`,
    params: baseDate ? { baseDate } : undefined,
  });

  return data?.tasks.map(mapTaskResponseToTask) ?? [];
}

type TaskMutationResponse =
  | TaskResponse
  | {
      task?: TaskResponse;
      tasks?: TaskResponse[];
    };

const mapTaskMutationResponse = (data: TaskMutationResponse | null) => {
  if (!data) {
    return null;
  }

  if ("task" in data && data.task) {
    return mapTaskResponseToTask(data.task);
  }

  if ("tasks" in data && data.tasks?.[0]) {
    const dates = data.tasks
      .map((task) => task.startDate)
      .filter((date): date is string => Boolean(date));

    return mapTaskResponseToTask({
      ...data.tasks[0],
      dates,
    });
  }

  if ("id" in data) {
    return mapTaskResponseToTask(data);
  }

  return null;
};

export async function createTask({
  categoryId,
  milestoneId,
  input,
}: {
  categoryId?: string | null;
  milestoneId?: string | null;
  input: CreateScheduleItemInput;
}): Promise<TaskItem | null> {
  const data = await apiRequest<TaskMutationResponse>({
    method: "POST",
    url: "/tasks",
    data: mapScheduleInputToCreateTaskRequest({ categoryId, milestoneId, input }),
  });

  return mapTaskMutationResponse(data);
}

export async function updateTask({
  taskId,
  input,
  categoryId,
  milestoneId,
}: {
  taskId: string;
  input: CreateScheduleItemInput;
  categoryId?: string | null;
  milestoneId?: string | null;
}): Promise<TaskItem | null> {
  const data = await apiRequest<TaskMutationResponse>({
    method: "PATCH",
    url: `/tasks/${taskId}`,
    data: mapScheduleInputToUpdateTaskRequest({
      input,
      categoryId,
      milestoneId,
    }),
  });

  return mapTaskMutationResponse(data);
}

export async function deleteTask({
  taskId,
  deleteScope,
  taskDateId,
}: {
  taskId: string;
  deleteScope?: TaskDeleteScope;
  taskDateId?: number;
}): Promise<void> {
  await apiRequest({
    method: "DELETE",
    url: `/tasks/${taskId}`,
    params: {
      ...(deleteScope ? { deleteScope } : {}),
      ...(taskDateId ? { taskDateId } : {}),
    },
  });
}

export async function toggleTaskComplete(
  taskId: string,
  taskDateId?: number,
): Promise<void> {
  await apiRequest({
    method: "PATCH",
    url: `/tasks/${taskId}/complete`,
    params: taskDateId ? { taskDateId } : undefined,
  });
}
