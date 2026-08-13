type TaskCompletionTarget = {
  dateType?: "SINGLE" | "RANGE" | "MULTIPLE";
  isCompleted?: boolean;
  taskDates?: {
    isCompleted?: boolean;
  }[];
};

export const isTaskCompleted = (task: TaskCompletionTarget) => {
  if (task.dateType === "MULTIPLE" && task.taskDates?.length) {
    return task.taskDates.every((taskDate) => taskDate.isCompleted);
  }

  return Boolean(task.isCompleted);
};

export const getTaskCompletionTargets = (task: TaskCompletionTarget) => {
  if (task.dateType === "MULTIPLE" && task.taskDates?.length) {
    return task.taskDates.map((taskDate) => Boolean(taskDate.isCompleted));
  }

  return [Boolean(task.isCompleted)];
};
