import { useMemo } from "react";

import type { Category, ScheduleItem, TaskItem } from "@/types";
import {
  collectSidebarItemsForDate,
  getDatedItemKey,
  type DatedSidebarItem,
} from "./CalendarSidebarDateItems";
import { AddButton } from "@/components/ui/AddButton";
import { SidebarScheduleCheckbox } from "@/features/calendar/components/sidebar/SidebarScheduleCheckbox";
import { getScheduleTextColorClass } from "@/features/calendar/utils/scheduleCompletionStyle";
import { formatScheduleDisplayLabel } from "@/utils/scheduleDate";

type CalendarSidebarSelectedDateViewProps = {
  categories: Category[];
  standaloneTasks: TaskItem[];
  currentYear: number;
  currentMonth: number;
  selectedDate: Date;
  viewMode: "card" | "list";
  onAddSchedule?: (categoryId?: string) => void;
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

type SelectedDateRowProps = {
  item: ScheduleItem;
  barColor: string;
  checked: boolean;
  widthClassName?: string;
  hasShadow?: boolean;
  onToggle: () => void;
  onEdit: () => void;
};

const getSelectedDateItemCategoryId = (datedItem: DatedSidebarItem) =>
  "categoryId" in datedItem ? datedItem.categoryId : null;

const SelectedDateRow = ({
  item,
  barColor,
  checked,
  widthClassName = "w-full",
  hasShadow = false,
  onToggle,
  onEdit,
}: SelectedDateRowProps) => {
  const titleColorClass = getScheduleTextColorClass(checked);

  return (
    <div
      className={`${widthClassName} flex h-12 shrink-0 items-center gap-2 overflow-hidden rounded-token-s bg-fill-inverse py-2 pr-2 transition-colors hover:bg-fill-surface dark:bg-[#222222] ${
        hasShadow
          ? "shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)] dark:shadow-[0px_0px_8px_0px_rgba(255,255,255,0.025)]"
          : ""
      }`}
    >
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
        onClick={onEdit}
      >
        <span
          className="h-8 w-2 shrink-0 rounded"
          style={{ backgroundColor: barColor }}
          aria-hidden="true"
        />
        <span className={`min-w-0 max-w-[190px] flex-1 truncate text-body-02-m ${titleColorClass}`}>
          {item.title}
        </span>
      </button>
      <div
        role="button"
        tabIndex={0}
        className="flex shrink-0 cursor-pointer items-center justify-end gap-3"
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggle();
          }
        }}
      >
        <span className="whitespace-nowrap text-body-02-m text-text-teritary">
          {formatScheduleDisplayLabel(item)}
        </span>
        <SidebarScheduleCheckbox
          checked={checked}
          ariaLabel={`${item.title} 일정 완료`}
          onChange={onToggle}
          stopPropagation
        />
      </div>
    </div>
  );
};

export const CalendarSidebarSelectedDateView = ({
  categories,
  standaloneTasks,
  currentYear,
  currentMonth,
  selectedDate,
  viewMode,
  onAddSchedule,
  onToggleMilestoneCompleted,
  onToggleCategoryTaskCompleted,
  onToggleTaskCompleted,
  onToggleStandaloneTaskCompleted,
  onEditStandaloneTask,
  onEditCategoryTask,
  onEditMilestone,
  onEditTask,
}: CalendarSidebarSelectedDateViewProps): JSX.Element => {
  const datedItems = useMemo(
    () =>
      collectSidebarItemsForDate({
        categories,
        standaloneTasks,
        currentYear,
        currentMonth,
        selectedDate,
      }),
    [categories, currentMonth, currentYear, selectedDate, standaloneTasks],
  );
  const selectedDateKey = [
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    selectedDate.getDate(),
  ].join("-");

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

  if (viewMode === "list") {
    return (
      <div className="flex w-[352px] flex-col gap-2">
        {datedItems.map((datedItem) => (
          <SelectedDateRow
            key={getDatedItemKey(selectedDateKey, datedItem)}
            item={datedItem.item}
            barColor={datedItem.barColor}
            checked={Boolean(datedItem.isCompleted)}
            hasShadow
            onToggle={() => handleToggleCompleted(datedItem)}
            onEdit={() => handleEdit(datedItem)}
          />
        ))}
      </div>
    );
  }

  const categoryGroups = categories
    .map((category) => ({
      category,
      items: datedItems.filter(
        (datedItem) => getSelectedDateItemCategoryId(datedItem) === category.id,
      ),
    }))
    .filter(({ items }) => items.length > 0);
  const standaloneItems = datedItems.filter(
    (datedItem) => datedItem.type === "standaloneTask",
  );

  return (
    <div className="flex w-[352px] flex-col gap-5">
      {standaloneItems.map((datedItem) => (
        <SelectedDateRow
          key={getDatedItemKey(selectedDateKey, datedItem)}
          item={datedItem.item}
          barColor={datedItem.barColor}
          checked={Boolean(datedItem.isCompleted)}
          hasShadow
          onToggle={() => handleToggleCompleted(datedItem)}
          onEdit={() => handleEdit(datedItem)}
        />
      ))}

      {categoryGroups.map(({ category, items }) => (
        <section
          key={category.id}
          className="flex w-[352px] shrink-0 flex-col overflow-hidden rounded-[20px] bg-fill-inverse shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)] dark:bg-[#222222] dark:shadow-[0px_0px_8px_0px_rgba(255,255,255,0.025)]"
        >
          <div className="flex w-full items-center justify-between rounded-[20px] bg-fill-inverse py-3 pl-5 pr-3 dark:bg-[#222222]">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="h-10 w-2 shrink-0 rounded"
                style={{ backgroundColor: category.themeBase }}
                aria-hidden="true"
              />
              <h2 className="truncate text-title-03-sb text-text-strong">
                {category.title}
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-center pb-3">
            <div className="flex w-full flex-col items-end px-3">
              {items.map((datedItem) => (
                <SelectedDateRow
                  key={getDatedItemKey(selectedDateKey, datedItem)}
                  item={datedItem.item}
                  barColor={datedItem.barColor}
                  checked={Boolean(datedItem.isCompleted)}
                  widthClassName="w-[308px]"
                  onToggle={() => handleToggleCompleted(datedItem)}
                  onEdit={() => handleEdit(datedItem)}
                />
              ))}
            </div>
            {onAddSchedule && (
              <div className="px-5 pt-3">
                <AddButton
                  label="일정 추가하기"
                  variant="secondary"
                  className="w-[312px]"
                  onClick={() => onAddSchedule(category.id)}
                />
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};
