import { type ScheduleItem } from "@/types";
import { SidebarScheduleCheckbox } from "@/features/calendar/components/sidebar/SidebarScheduleCheckbox";
import { getScheduleTextColorClass } from "@/features/calendar/utils/scheduleCompletionStyle";
import { isTaskCompleted } from "@/features/task/utils/taskCompletion";
import {
  formatScheduleDisplayDate,
  getScheduleDisplayLabels,
} from "@/utils/scheduleDate";

// The task definition inside a category detail item seems to be just a standard ScheduleItem
type TaskDetailRowProps = {
  task: ScheduleItem;
  themeLightColor: string;
  onToggleCompleted?: (taskDateId?: number) => void | Promise<void>;
  onEdit?: () => void;
};

const getTaskDateRows = (task: ScheduleItem) => {
  if ("taskDates" in task && task.taskDates?.length) {
    return task.taskDates.map((taskDate) => ({
      key: String(taskDate.taskDateId),
      dateLabel: formatScheduleDisplayDate(taskDate.date.slice(0, 10)),
      isCompleted: Boolean(taskDate.isCompleted),
      taskDateId: taskDate.taskDateId,
    }));
  }

  const isCompleted = isTaskCompleted(task);

  return getScheduleDisplayLabels(task).map((dateLabel) => ({
    key: dateLabel,
    dateLabel,
    isCompleted,
    taskDateId: undefined,
  }));
};

export const TaskDetailRow = ({
  task,
  themeLightColor,
  onToggleCompleted,
  onEdit,
}: TaskDetailRowProps) => {
  const dateRows = getTaskDateRows(task);

  return (
    <>
      {dateRows.map((dateRow) => {
        const titleColorClass = getScheduleTextColorClass(dateRow.isCompleted);

        return (
        <div
          key={`${task.id}-${dateRow.key}`}
          className="inline-flex w-[736px] items-center justify-start gap-2 overflow-hidden rounded-xl bg-fill-inverse py-2 pr-2 max-xl:w-full dark:bg-[#222222]"
        >
          <button
            type="button"
            className="flex-1 flex justify-start items-center gap-2 text-left"
            onClick={onEdit}
          >
            <div
              className="w-2 h-8 rounded-sm"
              style={{ backgroundColor: themeLightColor }}
            />
            <span className={`max-w-64 truncate text-body-02-m ${titleColorClass}`}>
              {task.title}
            </span>
          </button>
          <div className="flex justify-end items-center gap-3">
            <div
              role="button"
              tabIndex={0}
              className="flex cursor-pointer items-center gap-3"
              onClick={() => {
                void onToggleCompleted?.(dateRow.taskDateId);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  void onToggleCompleted?.(dateRow.taskDateId);
                }
              }}
            >
              <span className="text-body-02-m text-text-teritary">
                {dateRow.dateLabel}
              </span>
              <SidebarScheduleCheckbox
                checked={dateRow.isCompleted}
                ariaLabel={`${task.title} 일정 완료`}
                onChange={() => {
                  void onToggleCompleted?.(dateRow.taskDateId);
                }}
                stopPropagation
              />
            </div>
          </div>
        </div>
        );
      })}
    </>
  );
};
