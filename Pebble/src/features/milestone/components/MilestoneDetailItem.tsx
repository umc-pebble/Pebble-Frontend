import ChevronDownIcon from "@/assets/icons/chevron-down.svg?react";
import { AddButton } from "@/components/ui/AddButton";
import { SidebarScheduleCheckbox } from "@/features/calendar/components/sidebar/SidebarScheduleCheckbox";
import { getScheduleTextColorClass } from "@/features/calendar/utils/scheduleCompletionStyle";
import { TaskDetailRow } from "@/features/task/components/TaskDetailRow";
import { type MilestoneItem } from "@/types";
import { getScheduleDisplayLabels } from "@/utils/scheduleDate";

type MilestoneDetailItemProps = {
  item: MilestoneItem;
  themeMidColor: string;
  themeLightColor: string;
  isExpanded: boolean;
  onToggle: () => void;
  onToggleCompleted?: () => void | Promise<void>;
  onEdit?: () => void;
  onAddTask?: () => void;
  onEditTask?: (taskId: string) => void;
  onToggleTaskCompleted?: (taskId: string) => void | Promise<void>;
};

export const MilestoneDetailItem = ({
  item,
  themeMidColor,
  themeLightColor,
  isExpanded,
  onToggle,
  onToggleCompleted,
  onEdit,
  onAddTask,
  onEditTask,
  onToggleTaskCompleted,
}: MilestoneDetailItemProps) => {
  const dateLabels = getScheduleDisplayLabels(item);
  const isCompleted = Boolean(item.isCompleted);
  const titleColorClass = getScheduleTextColorClass(isCompleted);

  return (
    <>
      {dateLabels.map((dateLabel) => (
        <div
          key={`${item.id}-${dateLabel}`}
          className="w-full bg-fill-inverse dark:bg-[#222222] rounded-[20px] shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)] dark:shadow-[0px_0px_8px_0px_rgba(255,255,255,0.025)] flex flex-col overflow-hidden"
        >
          <div
            className="flex w-full items-center justify-between bg-fill-inverse py-3 pl-5 pr-3 transition-colors max-sm:flex-col max-sm:items-stretch max-sm:gap-2 dark:bg-[#222222]"
          >
            <button
              type="button"
              className="flex w-[232px] items-center gap-3 text-left max-sm:w-full"
              onClick={(event) => {
                event.stopPropagation();
                onEdit?.();
              }}
            >
              <div
                className="w-2 h-10 rounded-sm"
                style={{ backgroundColor: themeMidColor }}
              />
              <span className={`truncate text-title-03-sb ${titleColorClass}`}>
                {item.title}
              </span>
            </button>
            <div className="flex items-center gap-3 max-sm:justify-between">
              <div
                role="button"
                tabIndex={0}
                className="flex cursor-pointer items-center gap-3"
                onClick={() => {
                  void onToggleCompleted?.();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    void onToggleCompleted?.();
                  }
                }}
              >
                <span className="text-body-02-m text-text-teritary">
                  {dateLabel}
                </span>
                <SidebarScheduleCheckbox
                  checked={isCompleted}
                  ariaLabel={`${item.title} 일정 완료`}
                  onChange={() => {
                    void onToggleCompleted?.();
                  }}
                  stopPropagation
                />
              </div>
              <button
                className="w-11 h-11 flex items-center justify-center rounded-token-s hover:bg-fill-surface transition-colors dark:hover:bg-btn-quaternary"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
              >
                <ChevronDownIcon className={`w-6 h-6 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="w-full flex flex-col items-center">
              {item.tasks && item.tasks.length > 0 && (
                <div className="w-full pl-8 pr-3 flex flex-col justify-center items-end gap-2">
                  {item.tasks.map((task) => (
                    <TaskDetailRow
                      key={task.id}
                      task={task}
                      themeLightColor={themeLightColor}
                      onToggleCompleted={() => onToggleTaskCompleted?.(task.id)}
                      onEdit={() => onEditTask?.(task.id)}
                    />
                  ))}
                </div>
              )}
              <div className="w-full px-5 py-3 flex flex-col justify-start items-start gap-2.5">
                <AddButton
                  label="태스크 추가하기"
                  variant="secondary"
                  className="w-[740px] max-xl:w-full"
                  onClick={onAddTask}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};
