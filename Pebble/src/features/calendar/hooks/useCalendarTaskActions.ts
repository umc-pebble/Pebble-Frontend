import { useCallback, type Dispatch, type SetStateAction } from "react";

import type { CreateScheduleItemInput } from "@/features/calendar/types";
import {
  deleteTaskWithScope,
  getTaskCompleteTargetIds,
  splitMultipleScheduleInput,
} from "@/features/calendar/utils/scheduleActionUtils";
import { createTaskEntity } from "@/features/calendar/utils/calendarStateUtils";
import {
  createTask as createTaskApi,
  toggleTaskComplete as toggleTaskCompleteApi,
  updateTask as updateTaskApi,
} from "@/features/task/api/taskApi";
import type { Category, TaskItem } from "@/types";

type UseCalendarTaskActionsParams = {
  categories: Category[];
  reloadCalendarData: () => Promise<void>;
  setCategories: Dispatch<SetStateAction<Category[]>>;
  standaloneTasks: TaskItem[];
};

export const useCalendarTaskActions = ({
  categories,
  reloadCalendarData,
  setCategories,
  standaloneTasks,
}: UseCalendarTaskActionsParams) => {
  const markCategoryAsEmptyIfNoLoadedSchedules = useCallback(
    (categoryId: string) => {
      setCategories((previousCategories) =>
        previousCategories.map((category) => {
          const hasLoadedSchedules =
            category.items.length > 0 || (category.tasks?.length ?? 0) > 0;

          if (category.id !== categoryId || hasLoadedSchedules) {
            return category;
          }

          return {
            ...category,
            hasSchedules: false,
            milestoneCount: 0,
            taskCount: 0,
            sharedTaskCount: 0,
          };
        }),
      );
    },
    [setCategories],
  );

  const createTaskEntityGroup = useCallback(
    async (
      input: CreateScheduleItemInput,
      categoryId?: string,
      milestoneId?: string,
    ) => {
      const tasks = await Promise.all(
        splitMultipleScheduleInput(input).map(async (splitInput) =>
          (await createTaskApi({ categoryId, milestoneId, input: splitInput })) ??
          createTaskEntity({ ...splitInput, categoryId, milestoneId }),
        ),
      );

      await reloadCalendarData();
      return tasks[0];
    },
    [reloadCalendarData],
  );

  const createTask = useCallback(
    (
      categoryId: string,
      milestoneId: string,
      input: CreateScheduleItemInput,
    ) => createTaskEntityGroup(input, categoryId, milestoneId),
    [createTaskEntityGroup],
  );

  const createCategoryTask = useCallback(
    (categoryId: string, input: CreateScheduleItemInput) =>
      createTaskEntityGroup(input, categoryId),
    [createTaskEntityGroup],
  );

  const createStandaloneTask = useCallback(
    (input: CreateScheduleItemInput) => createTaskEntityGroup(input),
    [createTaskEntityGroup],
  );

  const updateTaskEntity = useCallback(
    async ({
      taskId,
      input,
      defaultCategoryId,
      defaultMilestoneId,
    }: {
      taskId: string;
      input: CreateScheduleItemInput;
      defaultCategoryId: string | null;
      defaultMilestoneId: string | null;
    }) => {
      await updateTaskApi({
        taskId,
        input,
        categoryId:
          "categoryId" in input
            ? input.categoryId ?? null
            : defaultCategoryId,
        milestoneId:
          "milestoneId" in input
            ? input.milestoneId ?? null
            : defaultMilestoneId,
      });
      await reloadCalendarData();
    },
    [reloadCalendarData],
  );

  const updateCategoryTask = useCallback(
    (categoryId: string, taskId: string, input: CreateScheduleItemInput) =>
      updateTaskEntity({
        taskId,
        input,
        defaultCategoryId: categoryId,
        defaultMilestoneId: null,
      }),
    [updateTaskEntity],
  );

  const updateTask = useCallback(
    (
      categoryId: string,
      milestoneId: string,
      taskId: string,
      input: CreateScheduleItemInput,
    ) =>
      updateTaskEntity({
        taskId,
        input,
        defaultCategoryId: categoryId,
        defaultMilestoneId: milestoneId,
      }),
    [updateTaskEntity],
  );

  const updateStandaloneTask = useCallback(
    (taskId: string, input: CreateScheduleItemInput) =>
      updateTaskEntity({
        taskId,
        input,
        defaultCategoryId: null,
        defaultMilestoneId: null,
      }),
    [updateTaskEntity],
  );

  const deleteCategoryTask = useCallback(
    async (categoryId: string, taskId: string) => {
      const category =
        categories.find((item) => item.id === categoryId) ?? null;
      const task =
        category?.tasks?.find((categoryTask) => categoryTask.id === taskId) ??
        null;
      const willBeEmptyCategory =
        category !== null &&
        category.items.length === 0 &&
        (category.tasks?.filter((categoryTask) => categoryTask.id !== taskId)
          .length ?? 0) === 0;

      await deleteTaskWithScope(taskId, task);
      await reloadCalendarData();

      if (willBeEmptyCategory) {
        markCategoryAsEmptyIfNoLoadedSchedules(categoryId);
      }
    },
    [categories, markCategoryAsEmptyIfNoLoadedSchedules, reloadCalendarData],
  );

  const deleteTask = useCallback(
    async (categoryId: string, milestoneId: string, taskId: string) => {
      const task =
        categories
          .find((category) => category.id === categoryId)
          ?.items.find((item) => item.id === milestoneId)
          ?.tasks?.find((milestoneTask) => milestoneTask.id === taskId) ?? null;

      await deleteTaskWithScope(taskId, task);
      await reloadCalendarData();
    },
    [categories, reloadCalendarData],
  );

  const deleteStandaloneTask = useCallback(
    async (taskId: string) => {
      const task =
        standaloneTasks.find((item) => item.id === taskId) ?? null;

      await deleteTaskWithScope(taskId, task);
      await reloadCalendarData();
    },
    [reloadCalendarData, standaloneTasks],
  );

  const toggleTaskEntityCompleted = useCallback(
    async (taskId: string, task: TaskItem | null, taskDateId?: number) => {
      await Promise.all(
        getTaskCompleteTargetIds(task, taskDateId).map((targetTaskDateId) =>
          toggleTaskCompleteApi(taskId, targetTaskDateId),
        ),
      );
      await reloadCalendarData();
    },
    [reloadCalendarData],
  );

  const toggleCategoryTaskCompleted = useCallback(
    (categoryId: string, taskId: string, taskDateId?: number) => {
      const task =
        categories
          .find((category) => category.id === categoryId)
          ?.tasks?.find((categoryTask) => categoryTask.id === taskId) ?? null;

      return toggleTaskEntityCompleted(taskId, task, taskDateId);
    },
    [categories, toggleTaskEntityCompleted],
  );

  const toggleTaskCompleted = useCallback(
    (
      categoryId: string,
      milestoneId: string,
      taskId: string,
      taskDateId?: number,
    ) => {
      const task =
        categories
          .find((category) => category.id === categoryId)
          ?.items.find((item) => item.id === milestoneId)
          ?.tasks?.find((milestoneTask) => milestoneTask.id === taskId) ?? null;

      return toggleTaskEntityCompleted(taskId, task, taskDateId);
    },
    [categories, toggleTaskEntityCompleted],
  );

  const toggleStandaloneTaskCompleted = useCallback(
    (taskId: string, taskDateId?: number) => {
      const task = standaloneTasks.find((item) => item.id === taskId) ?? null;
      return toggleTaskEntityCompleted(taskId, task, taskDateId);
    },
    [standaloneTasks, toggleTaskEntityCompleted],
  );

  return {
    createCategoryTask,
    createStandaloneTask,
    createTask,
    deleteCategoryTask,
    deleteStandaloneTask,
    deleteTask,
    toggleCategoryTaskCompleted,
    toggleStandaloneTaskCompleted,
    toggleTaskCompleted,
    updateCategoryTask,
    updateStandaloneTask,
    updateTask,
  };
};
