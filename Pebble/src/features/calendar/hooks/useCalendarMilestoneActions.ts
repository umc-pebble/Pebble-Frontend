import { useCallback } from "react";

import type { CreateScheduleItemInput } from "@/features/calendar/types";
import {
  getMilestoneDeleteScope,
  splitMultipleScheduleInput,
} from "@/features/calendar/utils/scheduleActionUtils";
import {
  createMilestone as createMilestoneApi,
  deleteMilestone as deleteMilestoneApi,
  toggleMilestoneComplete as toggleMilestoneCompleteApi,
  updateMilestone as updateMilestoneApi,
} from "@/features/milestone/api/milestoneApi";
import type { Category } from "@/types";

type UseCalendarMilestoneActionsParams = {
  categories: Category[];
  reloadCalendarData: () => Promise<void>;
};

export const useCalendarMilestoneActions = ({
  categories,
  reloadCalendarData,
}: UseCalendarMilestoneActionsParams) => {
  const createMilestone = useCallback(
    async (categoryId: string, input: CreateScheduleItemInput) => {
      const milestones = (
        await Promise.all(
          splitMultipleScheduleInput(input).map((splitInput) =>
            createMilestoneApi(categoryId, splitInput),
          ),
        )
      ).flat();

      await reloadCalendarData();
      return milestones;
    },
    [reloadCalendarData],
  );

  const updateMilestone = useCallback(
    async (
      categoryId: string,
      milestoneId: string,
      input: CreateScheduleItemInput,
    ) => {
      await updateMilestoneApi(milestoneId, categoryId, input);
      await reloadCalendarData();
    },
    [reloadCalendarData],
  );

  const deleteMilestone = useCallback(
    async (categoryId: string, milestoneId: string) => {
      const milestone =
        categories
          .find((category) => category.id === categoryId)
          ?.items.find((item) => item.id === milestoneId) ?? null;

      await deleteMilestoneApi(
        milestoneId,
        getMilestoneDeleteScope(milestone?.dateType),
      );
      await reloadCalendarData();
    },
    [categories, reloadCalendarData],
  );

  const toggleMilestoneCompleted = useCallback(
    async (categoryId: string, milestoneId: string) => {
      const milestone =
        categories
          .find((category) => category.id === categoryId)
          ?.items.find((item) => item.id === milestoneId) ?? null;

      await toggleMilestoneCompleteApi(milestoneId, !milestone?.isCompleted);
      await reloadCalendarData();
    },
    [categories, reloadCalendarData],
  );

  return {
    createMilestone,
    deleteMilestone,
    toggleMilestoneCompleted,
    updateMilestone,
  };
};
