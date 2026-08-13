import type { CreateScheduleItemInput } from "@/features/calendar/types";
import type { MilestoneDeleteScope } from "@/features/milestone/api/milestoneApi.types";
import { deleteTask } from "@/features/task/api/taskApi";
import type { TaskItem } from "@/types";

export const getMilestoneDeleteScope = (
  dateType?: string,
): MilestoneDeleteScope | undefined =>
  dateType === "MULTIPLE" ? "ALL" : undefined;

const isMultipleTask = (task?: TaskItem | null) => {
  const hasMultipleDates =
    (task?.dates?.length ?? 0) > 1 || (task?.taskDates?.length ?? 0) > 1;

  return task?.dateType === "MULTIPLE" || hasMultipleDates;
};

export const deleteTaskWithScope = async (
  taskId: string,
  task?: TaskItem | null,
) => {
  if (!isMultipleTask(task)) {
    await deleteTask({ taskId });
    return;
  }

  const taskDateIds =
    task?.taskDates
      ?.map((taskDate) => taskDate.taskDateId)
      .filter((taskDateId): taskDateId is number => Boolean(taskDateId)) ?? [];

  if (taskDateIds.length === 0) {
    await deleteTask({ taskId, deleteScope: "ALL" });
    return;
  }

  for (const taskDateId of taskDateIds) {
    await deleteTask({
      taskId,
      deleteScope: "THIS_ONLY",
      taskDateId,
    });
  }
};

export const getTaskCompleteTargetIds = (
  task?: TaskItem | null,
  taskDateId?: number,
) => {
  if (taskDateId) {
    return [taskDateId];
  }

  if (task?.dateType !== "MULTIPLE" || !task.taskDates?.length) {
    return [undefined];
  }

  return [];
};

export const splitMultipleScheduleInput = (
  input: CreateScheduleItemInput,
): CreateScheduleItemInput[] => {
  if (!input.dates?.length) {
    return [input];
  }

  return input.dates.map((date) => ({
    ...input,
    start: date,
    end: undefined,
    dates: undefined,
  }));
};
