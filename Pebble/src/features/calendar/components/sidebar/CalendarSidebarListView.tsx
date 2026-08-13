import type { Category, TaskItem } from "@/types";
import { SidebarScheduleCheckbox } from "@/features/calendar/components/sidebar/SidebarScheduleCheckbox";
import {
  collectSidebarItemsByDate,
  getDatedItemKey,
  type DatedSidebarItem,
} from "@/features/calendar/components/sidebar/CalendarSidebarDateItems";
import { getScheduleTextColorClass } from "@/features/calendar/utils/scheduleCompletionStyle";

const formatDatedItemLabel = (date: Date) =>
  `${date.getMonth() + 1}/${date.getDate()}`;

type CalendarSidebarListViewProps = {
  categories: Category[];
  standaloneTasks: TaskItem[];
  currentYear: number;
  currentMonth: number;
  onToggleMilestoneCompleted?: (
    categoryId: string,
    milestoneId: string,
  ) => void | Promise<void>;
  onToggleCategoryTaskCompleted?: (
    categoryId: string,
    taskId: string,
    taskDateId?: number,
  ) => void | Promise<void>;
  onToggleTaskCompleted?: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
    taskDateId?: number,
  ) => void | Promise<void>;
  onToggleStandaloneTaskCompleted?: (
    taskId: string,
    taskDateId?: number,
  ) => void | Promise<void>;
  onEditStandaloneTask?: (taskId: string) => void;
  onEditCategoryTask?: (categoryId: string, taskId: string) => void;
  onEditMilestone?: (categoryId: string, milestoneId: string) => void;
  onEditTask?: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => void;
};

export const CalendarSidebarListView = ({
  categories,
  standaloneTasks,
  currentYear,
  currentMonth,
  onToggleMilestoneCompleted,
  onToggleCategoryTaskCompleted,
  onToggleTaskCompleted,
  onToggleStandaloneTaskCompleted,
  onEditStandaloneTask,
  onEditCategoryTask,
  onEditMilestone,
  onEditTask,
}: CalendarSidebarListViewProps): JSX.Element => {
  const groupedItems = collectSidebarItemsByDate({
    categories,
    standaloneTasks,
    currentYear,
    currentMonth,
  });

  const handleToggleCompleted = (datedItem: DatedSidebarItem) => {
    if (datedItem.type === "standaloneTask") {
      void onToggleStandaloneTaskCompleted?.(
        datedItem.taskId,
        datedItem.taskDateId,
      );
      return;
    }

    if (datedItem.type === "categoryTask") {
      void onToggleCategoryTaskCompleted?.(
        datedItem.categoryId,
        datedItem.taskId,
        datedItem.taskDateId,
      );
      return;
    }

    if (datedItem.type === "milestone") {
      void onToggleMilestoneCompleted?.(
        datedItem.categoryId,
        datedItem.milestoneId,
      );
      return;
    }

    void onToggleTaskCompleted?.(
      datedItem.categoryId,
      datedItem.milestoneId,
      datedItem.taskId,
      datedItem.taskDateId,
    );
  };

  const handleEdit = (datedItem: DatedSidebarItem) => {
    if (datedItem.type === "standaloneTask") {
      onEditStandaloneTask?.(datedItem.taskId);
      return;
    }

    if (datedItem.type === "categoryTask") {
      onEditCategoryTask?.(datedItem.categoryId, datedItem.taskId);
      return;
    }

    if (datedItem.type === "milestone") {
      onEditMilestone?.(datedItem.categoryId, datedItem.milestoneId);
      return;
    }

    onEditTask?.(
      datedItem.categoryId,
      datedItem.milestoneId,
      datedItem.taskId,
    );
  };

  return (
    <div className="flex w-[352px] flex-col gap-5">
      {groupedItems.map((group) => (
        <section key={group.key} className="flex w-full flex-col gap-3">
          <h2 className="text-body-01-sb text-text-primary">{group.title}</h2>
          <div className="flex w-full flex-col gap-2">
            {group.items.map((datedItem) => {
              const { item, barColor } = datedItem;
              const titleColorClass = getScheduleTextColorClass(
                Boolean(datedItem.isCompleted),
              );

              return (
                <div
                  key={getDatedItemKey(group.key, datedItem)}
                  className="flex h-12 w-full shrink-0 items-center gap-2 overflow-hidden rounded-token-s bg-fill-inverse py-2 pr-2 shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)] transition-colors hover:bg-fill-surface dark:bg-[#222222] dark:shadow-[0px_0px_8px_0px_rgba(255,255,255,0.025)]"
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    onClick={() => handleEdit(datedItem)}
                  >
                    <div
                      className="h-8 w-2 shrink-0 rounded"
                      style={{ backgroundColor: barColor }}
                    />
                    <span className={`min-w-0 max-w-[190px] flex-1 truncate text-body-02-m ${titleColorClass}`}>
                      {item.title}
                    </span>
                  </button>

                  <div
                    role="button"
                    tabIndex={0}
                    className="flex shrink-0 cursor-pointer items-center justify-end gap-3"
                    onClick={() => handleToggleCompleted(datedItem)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleToggleCompleted(datedItem);
                      }
                    }}
                  >
                    <span className="whitespace-nowrap text-body-02-m text-text-teritary">
                      {formatDatedItemLabel(datedItem.date)}
                    </span>
                    <SidebarScheduleCheckbox
                      checked={Boolean(datedItem.isCompleted)}
                      ariaLabel={`${item.title} 일정 완료`}
                      onChange={() => {
                        handleToggleCompleted(datedItem);
                      }}
                      stopPropagation
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};
