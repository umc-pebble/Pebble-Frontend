import { useCallback, useEffect, useMemo, useState } from "react";

import type { Category, MilestoneItem, TaskItem } from "@/types";
import type { CalendarStateModel } from "@/features/calendar/types";
import { useCalendarCategoryActions } from "@/features/calendar/hooks/useCalendarCategoryActions";
import { useCalendarScheduleActions } from "@/features/calendar/hooks/useCalendarScheduleActions";
import { getCategories } from "@/features/category/api/categoryApi";
import { getCategoryMembers } from "@/features/category/api/sharedCategoryApi";
import {
  getMilestones,
  getUserCategoryMilestones,
} from "@/features/milestone/api/milestoneApi";
import { getMyProfile } from "@/features/mypage/api/profileApi";
import { getStandaloneTasks, getUserTasks } from "@/features/task/api/taskApi";
import { ApiRequestError, getAccessToken } from "@/services/api";

export type {
  CalendarState,
  CalendarActions,
  CalendarStateModel,
  CreateCategoryInput,
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";

type UseCalendarStateParams = {
  currentYear: number;
  currentMonth: number;
};

const formatBaseDate = (year: number, month: number) =>
  `${year}-${String(month).padStart(2, "0")}-01`;

const getAccessibleMilestones = async (category: Category) => {
  try {
    return await getMilestones(category.id);
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      error.status === 403 &&
      category.isShared &&
      category.userId
    ) {
      try {
        return await getUserCategoryMilestones(category.userId, category.id);
      } catch (fallbackError) {
        if (
          fallbackError instanceof ApiRequestError &&
          (fallbackError.status === 403 || fallbackError.status === 404)
        ) {
          return [];
        }

        throw fallbackError;
      }
    }

    if (error instanceof ApiRequestError && error.status === 403) {
      return [];
    }

    throw error;
  }
};

const getSharedOwnerId = async (category: Category) => {
  if (category.userId) {
    return category.userId;
  }

  if (!category.isShared) {
    return undefined;
  }

  const members = await getCategoryMembers(category.id);
  return members.find((member) => member.role === "OWNER")?.userId;
};

const withSharedOwnerIds = async (categories: Category[]) =>
  Promise.all(
    categories.map(async (category) => {
      if (!category.isShared || category.userId) {
        return category;
      }

      return {
        ...category,
        userId: await getSharedOwnerId(category),
      };
    }),
  );

const getSharedCategoryIdsByOwner = (categories: Category[]) => {
  const categoryIdsByOwner = new Map<number, Set<string>>();

  categories.forEach((category) => {
    if (!category.isShared || !category.userId) {
      return;
    }

    const categoryIds = categoryIdsByOwner.get(category.userId) ?? new Set();

    categoryIds.add(category.id);
    categoryIdsByOwner.set(category.userId, categoryIds);
  });

  return categoryIdsByOwner;
};

const getAccessibleUserTasks = async (
  userId: number,
  baseDate: string,
  allowedCategoryIds: Set<string>,
) => {
  try {
    const tasks = await getUserTasks(userId, baseDate);

    return tasks.filter(
      (task) => task.categoryId && allowedCategoryIds.has(task.categoryId),
    );
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      (error.status === 403 || error.status === 404)
    ) {
      return [];
    }

    throw error;
  }
};

const getTaskKey = (task: TaskItem) =>
  [
    task.id,
    task.categoryId ?? "standalone",
    task.milestoneId ?? "none",
    task.taskDates?.map((taskDate) => taskDate.taskDateId).join(",") ??
      task.dates?.join(",") ??
      task.start,
  ].join("-");

const mergeUniqueTasks = (taskGroups: TaskItem[][]) => {
  const taskMap = new Map<string, TaskItem>();

  taskGroups.flat().forEach((task) => {
    taskMap.set(getTaskKey(task), task);
  });

  return [...taskMap.values()];
};

const attachTasksToCategories = (
  categories: Category[],
  tasks: TaskItem[],
) => {
  const categoryMap = new Map<string, Category>(
    categories.map((category) => [
      category.id,
      {
        ...category,
        items: category.items.map(
          (item): MilestoneItem => ({ ...item, tasks: item.tasks ?? [] }),
        ),
        tasks: category.tasks ?? [],
      },
    ]),
  );
  const standaloneTasks: TaskItem[] = [];

  tasks.forEach((task) => {
    if (!task.categoryId) {
      standaloneTasks.push(task);
      return;
    }

    const category = categoryMap.get(task.categoryId);

    if (!category) {
      standaloneTasks.push(task);
      return;
    }

    if (!task.milestoneId) {
      category.tasks = [...(category.tasks ?? []), task];
      return;
    }

    category.items = category.items.map((milestone): MilestoneItem =>
      milestone.id === task.milestoneId
        ? { ...milestone, tasks: [...(milestone.tasks ?? []), task] }
        : milestone,
    );
  });

  return {
    categories: [...categoryMap.values()],
    standaloneTasks,
  };
};

export const useCalendarState = ({
  currentYear,
  currentMonth,
}: UseCalendarStateParams): CalendarStateModel => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
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

  const loadCalendarData = useCallback(
    async (canUpdate: () => boolean = () => true) => {
      if (!getAccessToken()) {
        if (canUpdate()) {
          setCurrentUserId(null);
          setCategories([]);
          setStandaloneTasks([]);
          setCalendarErrorMessage(null);
          setIsCalendarLoading(false);
        }
        return;
      }

      if (canUpdate()) {
        setCalendarErrorMessage(null);
        setIsCalendarLoading(true);
      }

      try {
        const baseDate = formatBaseDate(currentYear, currentMonth);
        const [loadedCategories, loadedTasks, loadedProfile] = await Promise.all([
          getCategories(),
          getStandaloneTasks(baseDate),
          getMyProfile().catch(() => null),
        ]);
        const nextCurrentUserId = loadedProfile?.id ?? null;
        const categoriesWithOwners = await withSharedOwnerIds(loadedCategories);
        const sharedCategoryIdsByOwner =
          getSharedCategoryIdsByOwner(categoriesWithOwners);
        const sharedTasks = await Promise.all(
          [...sharedCategoryIdsByOwner.entries()].map(
            ([userId, categoryIds]) =>
              getAccessibleUserTasks(userId, baseDate, categoryIds),
          ),
        );
        const uniqueTasks = mergeUniqueTasks([loadedTasks, ...sharedTasks]);
        const categoriesWithMilestones = await Promise.all(
          categoriesWithOwners.map(async (category) => ({
            ...category,
            items: await getAccessibleMilestones(category),
            tasks: [],
          })),
        );
        const nextCalendarState = attachTasksToCategories(
          categoriesWithMilestones,
          uniqueTasks,
        );

        if (canUpdate()) {
          setCurrentUserId(nextCurrentUserId);
          setCategories(nextCalendarState.categories);
          setStandaloneTasks(nextCalendarState.standaloneTasks);
        }
      } catch (error) {
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
    [currentMonth, currentYear],
  );

  useEffect(() => {
    let isActive = true;

    void loadCalendarData(() => isActive);

    return () => {
      isActive = false;
    };
  }, [loadCalendarData]);

  const categoryActions = useCalendarCategoryActions({
    categories,
    reloadCalendarData: () => loadCalendarData(),
    setCategories,
    setSelectedCategoryId,
  });
  const scheduleActions = useCalendarScheduleActions({
    categories,
    reloadCalendarData: () => loadCalendarData(),
    standaloneTasks,
  });
  return {
    currentUserId,
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
