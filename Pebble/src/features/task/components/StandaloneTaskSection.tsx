import { type TaskItem } from "@/types";
import { SidebarScheduleCheckbox } from "@/features/calendar/components/sidebar/SidebarScheduleCheckbox";
import { getScheduleTextColorClass } from "@/features/calendar/utils/scheduleCompletionStyle";
import { isTaskCompleted } from "@/features/task/utils/taskCompletion";
import {
  formatScheduleDisplayDate,
  getScheduleDisplayLabels,
} from "@/utils/scheduleDate";

type StandaloneTaskSectionProps = {
  tasks: TaskItem[];
  onToggleTaskCompleted?: (
    taskId: string,
    taskDateId?: number,
  ) => void | Promise<void>;
  onEditTask?: (taskId: string) => void;
};

const getStandaloneTaskRows = (task: TaskItem) => {
  if (task.taskDates?.length) {
    return [...task.taskDates]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((taskDate) => ({
        key: String(taskDate.taskDateId),
        dateLabel: formatScheduleDisplayDate(taskDate.date.slice(0, 10)),
        taskDateId: taskDate.taskDateId,
        isCompleted: Boolean(taskDate.isCompleted),
      }));
  }

  return getScheduleDisplayLabels(task).map((dateLabel) => ({
    key: dateLabel,
    dateLabel,
    taskDateId: undefined,
    isCompleted: isTaskCompleted(task),
  }));
};

export const StandaloneTaskSection = ({
  tasks,
  onToggleTaskCompleted,
  onEditTask,
}: StandaloneTaskSectionProps): JSX.Element => (
  <>
    {tasks.flatMap((task) => {
      const rows = getStandaloneTaskRows(task);
      const accentColor = task.accent ?? "#171717";

      return rows.map((row) => {
        const titleColorClass = getScheduleTextColorClass(
          row.isCompleted,
          "text-text-strong",
        );

        return (
          <section
            key={`${task.id}-${row.key}`}
            className="flex w-[352px] shrink-0 flex-col overflow-visible rounded-[20px] bg-fill-inverse shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)] dark:bg-[#222222] dark:shadow-[0px_0px_8px_0px_rgba(255,255,255,0.025)]"
          >
            <div
              className="flex w-full items-center justify-between gap-3 rounded-[20px] bg-fill-inverse py-3 pl-5 pr-3 text-left transition-colors hover:bg-fill-surface dark:bg-[#222222]"
            >
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
                onClick={() => onEditTask?.(task.id)}
              >
                <div
                  className="h-10 w-2 shrink-0 rounded"
                  style={{ backgroundColor: accentColor }}
                />
                <span
                  className={`min-w-0 flex-1 truncate text-title-03-sb ${titleColorClass}`}
                >
                  {task.title}
                </span>
              </button>

              <div
                role="button"
                tabIndex={0}
                className="flex shrink-0 cursor-pointer items-center justify-end gap-2"
                onClick={() => onToggleTaskCompleted?.(task.id, row.taskDateId)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onToggleTaskCompleted?.(task.id, row.taskDateId);
                  }
                }}
              >
                <span className="whitespace-nowrap text-body-02-m text-text-teritary">
                  {row.dateLabel}
                </span>
                <SidebarScheduleCheckbox
                  checked={row.isCompleted}
                  ariaLabel={`${task.title} 일정 완료`}
                  onChange={() =>
                    onToggleTaskCompleted?.(task.id, row.taskDateId)
                  }
                  stopPropagation
                />
              </div>
            </div>
          </section>
        );
      });
    })}
  </>
);
