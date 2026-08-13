import { useMemo, useState } from "react";

import type { Category, TaskItem } from "@/types";
import {
  filterCategoriesByMonth,
  isScheduleItemInMonth,
} from "@/features/milestone/components/scheduleDateUtils";

type UseCalendarSidebarStateParams = {
  categories: Category[];
  standaloneTasks: TaskItem[];
  currentYear: number;
  currentMonth: number;
};

export const useCalendarSidebarState = ({
  categories,
  standaloneTasks,
  currentYear,
  currentMonth,
}: UseCalendarSidebarStateParams) => {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const monthLabel = useMemo(() => `${currentMonth}월`, [currentMonth]);
  const displayedCategories = useMemo(
    () => filterCategoriesByMonth(categories, currentYear, currentMonth),
    [categories, currentYear, currentMonth],
  );
  const displayedStandaloneTasks = useMemo(
    () =>
      standaloneTasks.filter((task) =>
        isScheduleItemInMonth(task, currentYear, currentMonth),
      ),
    [standaloneTasks, currentYear, currentMonth],
  );
  const hasDisplayedSchedules =
    displayedStandaloneTasks.length > 0 ||
    displayedCategories.some(
      (category) =>
        category.items.length > 0 || (category.tasks?.length ?? 0) > 0,
    );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((previousExpandedCategories) => ({
      ...previousExpandedCategories,
      [categoryId]: !previousExpandedCategories[categoryId],
    }));
  };

  return {
    viewMode,
    setViewMode,
    expandedCategories,
    monthLabel,
    displayedCategories,
    displayedStandaloneTasks,
    hasDisplayedSchedules,
    toggleCategory,
  };
};
