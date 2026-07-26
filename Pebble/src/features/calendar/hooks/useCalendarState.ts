import { useCallback, useEffect, useMemo, useState } from "react";

import type { Category, TaskItem } from "@/types";
import type { CalendarStateModel } from "@/features/calendar/types";
import { useCalendarCategoryActions } from "@/features/calendar/hooks/useCalendarCategoryActions";
import { useCalendarScheduleActions } from "@/features/calendar/hooks/useCalendarScheduleActions";
import { getCategories } from "@/features/category/api/categoryApi";
import { getMilestones } from "@/features/milestone/api/milestoneApi";
import {
  getTasks,
} from "@/features/task/api/taskApi";
import { getAccessToken } from "@/services/api";
import { replaceTasksInCategories } from "@/features/calendar/utils/calendarStateUtils";

export type {
  CalendarState,
  CalendarActions,
  CalendarStateModel,
  CreateCategoryInput,
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";

export const useCalendarState = (): CalendarStateModel => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [standaloneTasks, setStandaloneTasks] = useState<TaskItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [calendarErrorMessage, setCalendarErrorMessage] = useState<
    string | null
  >(null);

  const selectedCategory = useMemo(
    () =>
      categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );

  const categoryActions = useCalendarCategoryActions({
    setCategories,
    setSelectedCategoryId,
  });
  const { replaceCategories } = categoryActions;
  const scheduleActions = useCalendarScheduleActions({
    setCategories,
    setStandaloneTasks,
  });

  const loadCalendarData = useCallback(
    async (canUpdate: () => boolean = () => true) => {
      const accessToken = getAccessToken();

      if (canUpdate()) {
        setCalendarErrorMessage(null);
      }

      if (!accessToken) {
        if (canUpdate()) {
          replaceCategories([]);
          setStandaloneTasks([]);
          setIsCalendarLoading(false);
        }
        return;
      }

      try {
        if (canUpdate()) {
          setIsCalendarLoading(true);
        }
        const nextCategories = await getCategories();
        const [categoriesWithMilestones, nextTasks] =
          await Promise.all([
            Promise.all(
              nextCategories.map(async (category) => {
                const milestones = await getMilestones(category.id);
                return {
                  ...category,
                  items: milestones,
                };
              }),
            ),
            getTasks(),
          ]);
        const nextCategoriesWithTasks = replaceTasksInCategories(
          categoriesWithMilestones,
          nextTasks,
        );
        const nextStandaloneTasks = nextTasks.filter(
          (task) => !task.categoryId && !task.milestoneId,
        );

        if (canUpdate()) {
          replaceCategories(nextCategoriesWithTasks);
          setStandaloneTasks(nextStandaloneTasks);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);

        if (canUpdate()) {
          setCalendarErrorMessage(
            error instanceof Error
              ? error.message
              : "캘린더 정보를 불러오지 못했어요.",
          );
        }
      } finally {
        if (canUpdate()) {
          setIsCalendarLoading(false);
        }
      }
    },
    [replaceCategories],
  );

  useEffect(() => {
    let isMounted = true;

    void loadCalendarData(() => isMounted);

    return () => {
      isMounted = false;
    };
  }, [loadCalendarData]);

  return {
    categories,
    standaloneTasks,
    selectedCategory,
    selectedCategoryId,
    isCalendarLoading,
    calendarErrorMessage,
    reloadCalendarData: () => loadCalendarData(),
    ...categoryActions,
    ...scheduleActions,
  };
};
