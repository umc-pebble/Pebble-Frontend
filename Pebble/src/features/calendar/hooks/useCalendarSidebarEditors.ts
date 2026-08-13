import { useMemo, useState } from 'react';

import type { Category } from '@/types';

type MilestoneTarget = {
  categoryId: string;
  milestoneId: string;
};

type CategoryTaskTarget = {
  categoryId: string;
  taskId: string;
};

type MilestoneTaskTarget = MilestoneTarget & {
  taskId: string;
};

export const useCalendarSidebarEditors = (categories: Category[]) => {
  const [milestoneTarget, setMilestoneTarget] =
    useState<MilestoneTarget | null>(null);
  const [categoryTaskTarget, setCategoryTaskTarget] =
    useState<CategoryTaskTarget | null>(null);
  const [milestoneTaskTarget, setMilestoneTaskTarget] =
    useState<MilestoneTaskTarget | null>(null);

  const milestoneCategory = useMemo(
    () =>
      milestoneTarget
        ? categories.find(
            (category) => category.id === milestoneTarget.categoryId,
          ) ?? null
        : null,
    [categories, milestoneTarget],
  );
  const categoryTaskCategory = useMemo(
    () =>
      categoryTaskTarget
        ? categories.find(
            (category) => category.id === categoryTaskTarget.categoryId,
          ) ?? null
        : null,
    [categories, categoryTaskTarget],
  );
  const milestoneTaskCategory = useMemo(
    () =>
      milestoneTaskTarget
        ? categories.find(
            (category) => category.id === milestoneTaskTarget.categoryId,
          ) ?? null
        : null,
    [categories, milestoneTaskTarget],
  );
  const milestone =
    milestoneCategory?.items.find(
      (item) => item.id === milestoneTarget?.milestoneId,
    ) ?? null;
  const categoryTask =
    categoryTaskCategory?.tasks?.find(
      (task) => task.id === categoryTaskTarget?.taskId,
    ) ?? null;
  const milestoneTaskMilestone =
    milestoneTaskCategory?.items.find(
      (item) => item.id === milestoneTaskTarget?.milestoneId,
    ) ?? null;
  const milestoneTask =
    milestoneTaskMilestone?.tasks?.find(
      (task) => task.id === milestoneTaskTarget?.taskId,
    ) ?? null;

  return {
    categoryTask,
    categoryTaskTarget,
    closeCategoryTaskEditor: () => setCategoryTaskTarget(null),
    closeMilestoneEditor: () => setMilestoneTarget(null),
    closeMilestoneTaskEditor: () => setMilestoneTaskTarget(null),
    milestone,
    milestoneTarget,
    milestoneTask,
    milestoneTaskTarget,
    openCategoryTaskEditor: (categoryId: string, taskId: string) =>
      setCategoryTaskTarget({ categoryId, taskId }),
    openMilestoneEditor: (categoryId: string, milestoneId: string) =>
      setMilestoneTarget({ categoryId, milestoneId }),
    openMilestoneTaskEditor: (
      categoryId: string,
      milestoneId: string,
      taskId: string,
    ) => setMilestoneTaskTarget({ categoryId, milestoneId, taskId }),
  };
};
