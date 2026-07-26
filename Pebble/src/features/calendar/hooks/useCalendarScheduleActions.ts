import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { Category, TaskItem } from "@/types";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import {
  appendMilestoneToCategory,
  appendMilestonesToCategory,
  appendTaskToCategory,
  appendTaskToMilestone,
  createMilestoneEntity,
  createTaskEntity,
  removeCategoryTaskFromList,
  removeMilestoneFromCategory,
  removeTaskFromMilestone,
  replaceStandaloneTaskInList,
  updateCategoryTaskInList,
  updateMilestoneInCategory,
  updateTaskInMilestone,
} from "@/features/calendar/utils/calendarStateUtils";
import {
  createMilestone as requestCreateMilestone,
  deleteMilestone as requestDeleteMilestone,
  updateMilestone as requestUpdateMilestone,
} from "@/features/milestone/api/milestoneApi";
import {
  createTask as requestCreateTask,
  deleteTask as requestDeleteTask,
  updateTask as requestUpdateTask,
} from "@/features/task/api/taskApi";

type UseCalendarScheduleActionsParams = {
  setCategories: Dispatch<SetStateAction<Category[]>>;
  setStandaloneTasks: Dispatch<SetStateAction<TaskItem[]>>;
};

export const useCalendarScheduleActions = ({
  setCategories,
  setStandaloneTasks,
}: UseCalendarScheduleActionsParams) => {
  const createMilestone = useCallback(
    async (categoryId: string, input: CreateScheduleItemInput) => {
      const milestones = await requestCreateMilestone(categoryId, input);

      setCategories((previousCategories) =>
        milestones.length > 0
          ? appendMilestonesToCategory(previousCategories, categoryId, milestones)
          : appendMilestoneToCategory(
              previousCategories,
              categoryId,
              createMilestoneEntity(input),
            ),
      );

      return milestones;
    },
    [setCategories],
  );

  const updateMilestone = useCallback(
    async (
      categoryId: string,
      milestoneId: string,
      input: CreateScheduleItemInput,
    ) => {
      const milestone = await requestUpdateMilestone(milestoneId, input);

      setCategories((previousCategories) =>
        milestone
          ? updateMilestoneInCategory(
              previousCategories,
              categoryId,
              milestoneId,
              milestone,
            )
          : updateMilestoneInCategory(
              previousCategories,
              categoryId,
              milestoneId,
              createMilestoneEntity({ ...input, id: milestoneId }),
            ),
      );
    },
    [setCategories],
  );

  const createTask = useCallback(
    async (
      categoryId: string,
      milestoneId: string,
      input: CreateScheduleItemInput,
    ) => {
      const task =
        (await requestCreateTask({ categoryId, milestoneId, input })) ??
        createTaskEntity(input);

      setCategories((previousCategories) =>
        appendTaskToMilestone(
          previousCategories,
          categoryId,
          milestoneId,
          task,
        ),
      );

      return task;
    },
    [setCategories],
  );

  const createCategoryTask = useCallback(
    async (categoryId: string, input: CreateScheduleItemInput) => {
      const task =
        (await requestCreateTask({ categoryId, input })) ??
        createTaskEntity(input);

      setCategories((previousCategories) =>
        appendTaskToCategory(previousCategories, categoryId, task),
      );

      return task;
    },
    [setCategories],
  );

  const updateCategoryTask = useCallback(
    async (categoryId: string, taskId: string, input: CreateScheduleItemInput) => {
      const task = await requestUpdateTask({
        taskId,
        input,
        isChildTask: true,
      });

      setCategories((previousCategories) =>
        task
          ? updateCategoryTaskInList(previousCategories, categoryId, taskId, task)
          : updateCategoryTaskInList(previousCategories, categoryId, taskId, input),
      );
    },
    [setCategories],
  );

  const deleteCategoryTask = useCallback(
    async (categoryId: string, taskId: string) => {
      await requestDeleteTask({ taskId });

      setCategories((previousCategories) =>
        removeCategoryTaskFromList(previousCategories, categoryId, taskId),
      );
    },
    [setCategories],
  );

  const createStandaloneTask = useCallback(
    async (input: CreateScheduleItemInput) => {
      const task = (await requestCreateTask({ input })) ?? createTaskEntity(input);

      setStandaloneTasks((previousTasks) => [...previousTasks, task]);

      return task;
    },
    [setStandaloneTasks],
  );

  const updateStandaloneTask = useCallback(
    async (taskId: string, input: CreateScheduleItemInput) => {
      const task = await requestUpdateTask({
        taskId,
        input,
        isChildTask: false,
      });

      setStandaloneTasks((previousTasks) =>
        task
          ? replaceStandaloneTaskInList(previousTasks, taskId, task)
          : replaceStandaloneTaskInList(
              previousTasks,
              taskId,
              createTaskEntity({ ...input, id: taskId }),
            ),
      );
    },
    [setStandaloneTasks],
  );

  const deleteStandaloneTask = useCallback(
    async (taskId: string) => {
      await requestDeleteTask({ taskId });

      setStandaloneTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== taskId),
      );
    },
    [setStandaloneTasks],
  );

  const deleteMilestone = useCallback(
    async (categoryId: string, milestoneId: string) => {
      await requestDeleteMilestone(milestoneId);

      setCategories((previousCategories) =>
        removeMilestoneFromCategory(previousCategories, categoryId, milestoneId),
      );
    },
    [setCategories],
  );

  const deleteTask = useCallback(
    async (categoryId: string, milestoneId: string, taskId: string) => {
      await requestDeleteTask({ taskId });

      setCategories((previousCategories) =>
        removeTaskFromMilestone(
          previousCategories,
          categoryId,
          milestoneId,
          taskId,
        ),
      );
    },
    [setCategories],
  );

  const updateTask = useCallback(
    async (
      categoryId: string,
      milestoneId: string,
      taskId: string,
      input: CreateScheduleItemInput,
    ) => {
      const task = await requestUpdateTask({
        taskId,
        input,
        isChildTask: true,
      });

      setCategories((previousCategories) =>
        task
          ? updateTaskInMilestone(
              previousCategories,
              categoryId,
              milestoneId,
              taskId,
              task,
            )
          : updateTaskInMilestone(
              previousCategories,
              categoryId,
              milestoneId,
              taskId,
              createTaskEntity({ ...input, id: taskId }),
            ),
      );
    },
    [setCategories],
  );

  return {
    createMilestone,
    updateMilestone,
    createTask,
    createCategoryTask,
    updateCategoryTask,
    deleteCategoryTask,
    createStandaloneTask,
    updateStandaloneTask,
    deleteStandaloneTask,
    deleteMilestone,
    updateTask,
    deleteTask,
  };
};
