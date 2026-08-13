import { getCategories, getUserCategories } from '@/features/category/api/categoryApi';
import { getCategoryMembers } from '@/features/category/api/sharedCategoryApi';
import {
  getMonthlyMilestones,
  getUserCategoryMilestones,
} from '@/features/milestone/api/milestoneApi';
import { getMyProfile } from '@/features/mypage/api/profileApi';
import { getStandaloneTasks, getUserTasks } from '@/features/task/api/taskApi';
import { ApiRequestError } from '@/services/api';
import type { Category, MilestoneItem, TaskItem } from '@/types';

type CalendarDataSnapshot = {
  categories: Category[];
  currentUserId: number | null;
  loadedViewedUserId: number | null;
  standaloneTasks: TaskItem[];
};

type LoadCalendarDataParams = {
  currentMonth: number;
  currentYear: number;
  knownCurrentUserId?: number | null;
  viewedUserId?: number | null;
};

const formatBaseDate = (year: number, month: number) =>
  `${year}-${String(month).padStart(2, '0')}-01`;

const getSharedOwnerId = async (category: Category) => {
  if (category.userId) {
    return category.userId;
  }

  if (!category.isShared) {
    return undefined;
  }

  const members = await getCategoryMembers(category.id);
  return members.find((member) => member.role === 'OWNER')?.userId;
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

const getSharedCategoryIdsByOwner = (
  categories: Category[],
  currentUserId: number | null,
) => {
  const categoryIdsByOwner = new Map<number, Set<string>>();

  categories.forEach((category) => {
    if (
      !category.isShared ||
      !category.userId ||
      category.userId === currentUserId
    ) {
      return;
    }

    const categoryIds =
      categoryIdsByOwner.get(category.userId) ?? new Set<string>();
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
      (task) =>
        task.categoryId && allowedCategoryIds.has(task.categoryId),
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
    task.categoryId ?? 'standalone',
    task.milestoneId ?? 'none',
    task.taskDates?.map((taskDate) => taskDate.taskDateId).join(',') ??
      task.dates?.join(',') ??
      task.start,
  ].join('-');

const mergeUniqueTasks = (taskGroups: TaskItem[][]) => {
  const taskMap = new Map<string, TaskItem>();
  taskGroups.flat().forEach((task) => taskMap.set(getTaskKey(task), task));
  return [...taskMap.values()];
};

const filterPublicCategories = (categories: Category[]) =>
  categories.filter((category) => category.isPublic !== false);

const filterTasksByVisibleCategories = (
  tasks: TaskItem[],
  categories: Category[],
) => {
  const visibleCategoryIds = new Set(
    categories.map((category) => category.id),
  );

  return tasks.filter(
    (task) =>
      !task.categoryId || visibleCategoryIds.has(task.categoryId),
  );
};

const attachMilestonesToCategories = (
  categories: Category[],
  milestones: MilestoneItem[],
) => {
  const categoryMap = new Map<string, Category>(
    categories.map((category) => [
      category.id,
      {
        ...category,
        items: [],
        tasks: category.tasks ?? [],
      },
    ]),
  );

  milestones.forEach((milestone) => {
    if (!milestone.categoryId) {
      return;
    }

    const category = categoryMap.get(milestone.categoryId);

    if (category) {
      category.items = [...category.items, { ...milestone, tasks: [] }];
    }
  });

  return [...categoryMap.values()];
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
          (item): MilestoneItem => ({
            ...item,
            tasks: item.tasks ?? [],
          }),
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

    category.items = category.items.map(
      (milestone): MilestoneItem =>
        milestone.id === task.milestoneId
          ? {
              ...milestone,
              tasks: [...(milestone.tasks ?? []), task],
            }
          : milestone,
    );
  });

  return {
    categories: [...categoryMap.values()],
    standaloneTasks,
  };
};

const getPublicMilestones = async (
  userId: number,
  categories: Category[],
) => {
  const milestoneGroups = await Promise.all(
    categories.map(async (category) => {
      try {
        return await getUserCategoryMilestones(userId, category.id);
      } catch (error) {
        if (
          error instanceof ApiRequestError &&
          (error.status === 403 || error.status === 404)
        ) {
          return [];
        }

        throw error;
      }
    }),
  );

  return milestoneGroups.flat();
};

const loadFriendCalendarData = async ({
  baseDate,
  currentUserId,
  viewedUserId,
}: {
  baseDate: string;
  currentUserId: number | null;
  viewedUserId: number;
}): Promise<CalendarDataSnapshot> => {
  const [loadedCategories, loadedTasks] = await Promise.all([
    getUserCategories(viewedUserId),
    getUserTasks(viewedUserId, baseDate),
  ]);
  const publicCategories = filterPublicCategories(loadedCategories).map(
    (category) => ({
      ...category,
      userId: category.userId ?? viewedUserId,
    }),
  );
  const publicTasks = filterTasksByVisibleCategories(
    loadedTasks,
    publicCategories,
  );
  const loadedMilestones = await getPublicMilestones(
    viewedUserId,
    publicCategories,
  );
  const nextCalendarState = attachTasksToCategories(
    attachMilestonesToCategories(publicCategories, loadedMilestones),
    publicTasks,
  );

  return {
    ...nextCalendarState,
    currentUserId,
    loadedViewedUserId: viewedUserId,
  };
};

const loadOwnCalendarData = async ({
  baseDate,
  currentUserId,
}: {
  baseDate: string;
  currentUserId: number | null;
}): Promise<CalendarDataSnapshot> => {
  const [loadedCategories, loadedTasks, loadedMilestones] =
    await Promise.all([
      getCategories(),
      getStandaloneTasks(baseDate),
      getMonthlyMilestones(baseDate),
    ]);
  const categoriesWithOwners = await withSharedOwnerIds(loadedCategories);
  const sharedCategoryIdsByOwner = getSharedCategoryIdsByOwner(
    categoriesWithOwners,
    currentUserId,
  );
  const sharedTasks = await Promise.all(
    [...sharedCategoryIdsByOwner.entries()].map(([userId, categoryIds]) =>
      getAccessibleUserTasks(userId, baseDate, categoryIds),
    ),
  );
  const nextCalendarState = attachTasksToCategories(
    attachMilestonesToCategories(categoriesWithOwners, loadedMilestones),
    mergeUniqueTasks([loadedTasks, ...sharedTasks]),
  );

  return {
    ...nextCalendarState,
    currentUserId,
    loadedViewedUserId: null,
  };
};

export const loadCalendarDataSnapshot = async ({
  currentMonth,
  currentYear,
  knownCurrentUserId,
  viewedUserId,
}: LoadCalendarDataParams): Promise<CalendarDataSnapshot> => {
  const baseDate = formatBaseDate(currentYear, currentMonth);
  const currentUserId =
    knownCurrentUserId ??
    (await getMyProfile().catch(() => null))?.id ??
    null;
  const shouldLoadFriendCalendar =
    viewedUserId !== undefined &&
    viewedUserId !== null &&
    viewedUserId !== currentUserId;

  if (shouldLoadFriendCalendar) {
    return loadFriendCalendarData({
      baseDate,
      currentUserId,
      viewedUserId,
    });
  }

  return loadOwnCalendarData({ baseDate, currentUserId });
};

export const isInitialCalendarNetworkError = (error: unknown) =>
  error instanceof ApiRequestError &&
  (error.type === 'network' || error.type === 'timeout');
