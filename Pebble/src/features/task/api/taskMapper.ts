import type { TaskItem } from "@/types";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import type {
  CreateTaskRequest,
  TaskDateType,
  TaskResponse,
  UpdateTaskRequest,
} from "./taskApi.types";

const getDateTypeFromInput = (input: CreateScheduleItemInput): TaskDateType => {
  if (input.dates && input.dates.length > 0) {
    return "MULTIPLE";
  }

  if (input.end) {
    return "RANGE";
  }

  return "SINGLE";
};

const normalizeApiDate = (date?: string | null) => date?.slice(0, 10) ?? null;

export function mapTaskResponseToTask(task: TaskResponse): TaskItem {
  const taskDates = task.taskDates
    ?.map((taskDate) => ({
      ...taskDate,
      date: normalizeApiDate(taskDate.date) ?? taskDate.date,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const dates =
    taskDates?.map((taskDate) => taskDate.date) ??
    task.dates
      ?.map((date) => normalizeApiDate(date) ?? date)
      .sort((a, b) => a.localeCompare(b)) ??
    undefined;
  const startDate = normalizeApiDate(task.startDate);
  const endDate = normalizeApiDate(task.endDate);

  return {
    id: String(task.id),
    title: task.name,
    start: startDate ?? dates?.[0] ?? "",
    end: endDate ?? undefined,
    dates,
    accent: task.color ?? undefined,
    itemType: "task",
    categoryId: task.categoryId ? String(task.categoryId) : undefined,
    milestoneId: task.milestoneId ? String(task.milestoneId) : undefined,
    dateType: task.dateType,
    isCompleted: task.isCompleted,
    completedAt: task.completedAt ?? undefined,
    displayOrder: task.displayOrder,
    taskDates,
  };
}

export function mapScheduleInputToCreateTaskRequest({
  categoryId,
  milestoneId,
  input,
}: {
  categoryId?: string | null;
  milestoneId?: string | null;
  input: CreateScheduleItemInput;
}): CreateTaskRequest {
  const dateType = getDateTypeFromInput(input);
  const isChildTask = Boolean(categoryId || milestoneId);

  return {
    categoryId: categoryId ? Number(categoryId) : null,
    milestoneId: milestoneId ? Number(milestoneId) : null,
    name: input.title,
    dateType,
    startDate: dateType === "MULTIPLE" ? null : input.start,
    endDate: dateType === "RANGE" ? input.end ?? null : null,
    dates: dateType === "MULTIPLE" ? input.dates ?? [] : null,
    color: isChildTask ? undefined : input.accent ?? "#171717",
  };
}

export function mapScheduleInputToUpdateTaskRequest({
  input,
  categoryId,
  milestoneId,
}: {
  input: CreateScheduleItemInput;
  categoryId?: string | null;
  milestoneId?: string | null;
}): UpdateTaskRequest {
  const dateType = getDateTypeFromInput(input);
  const nextCategoryId =
    categoryId !== undefined ? categoryId : input.categoryId ?? null;
  const nextMilestoneId = nextCategoryId
    ? milestoneId !== undefined
      ? milestoneId
      : input.milestoneId ?? null
    : null;

  return {
    categoryId: nextCategoryId ? Number(nextCategoryId) : null,
    milestoneId: nextMilestoneId ? Number(nextMilestoneId) : null,
    name: input.title,
    dateType,
    startDate: dateType === "MULTIPLE" ? null : input.start,
    endDate: dateType === "RANGE" ? input.end ?? null : null,
    dates: dateType === "MULTIPLE" ? input.dates ?? [] : null,
    color: nextCategoryId ? null : input.accent ?? "#171717",
  };
}
