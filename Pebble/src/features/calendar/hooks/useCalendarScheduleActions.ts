import type { Dispatch, SetStateAction } from "react";

import { useCalendarMilestoneActions } from "@/features/calendar/hooks/useCalendarMilestoneActions";
import { useCalendarTaskActions } from "@/features/calendar/hooks/useCalendarTaskActions";
import type { Category, TaskItem } from "@/types";

type UseCalendarScheduleActionsParams = {
  categories: Category[];
  reloadCalendarData: () => Promise<void>;
  setCategories: Dispatch<SetStateAction<Category[]>>;
  standaloneTasks: TaskItem[];
};

export const useCalendarScheduleActions = (
  params: UseCalendarScheduleActionsParams,
) => ({
  ...useCalendarMilestoneActions(params),
  ...useCalendarTaskActions(params),
});
