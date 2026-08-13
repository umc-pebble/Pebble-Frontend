export const getScheduleTextColorClass = (
  isCompleted: boolean,
  defaultClassName = "text-text-strong",
) => (isCompleted ? "text-text-teritary" : defaultClassName);
