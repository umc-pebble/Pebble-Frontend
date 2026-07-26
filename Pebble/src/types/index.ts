export type ScheduleDateFields = {
  start: string;
  end?: string;
  dates?: string[];
};

export type ScheduleEntityBase = ScheduleDateFields & {
  id: string;
  title: string;
};

export type ScheduleStyleFields = {
  accent?: string;
};

export type TaskItem = ScheduleEntityBase &
  ScheduleStyleFields & {
    itemType?: "task";
    categoryId?: string;
    milestoneId?: string;
    dateType?: "SINGLE" | "RANGE" | "MULTIPLE";
    isCompleted?: boolean;
    completedAt?: string;
    displayOrder?: number;
    taskDates?: {
      taskDateId: number;
      date: string;
      isCompleted?: boolean;
      completedAt?: string | null;
      name?: string;
      color?: string | null;
    }[];
    tasks?: never;
  };

export type MilestoneItem = ScheduleEntityBase &
  ScheduleStyleFields & {
    itemType?: "milestone";
    seriesId?: number;
    dateType?: "SINGLE" | "RANGE" | "MULTIPLE";
    isCompleted?: boolean;
    displayOrder?: number;
    tasks?: TaskItem[];
  };

export type ScheduleItem = MilestoneItem | TaskItem;

export type Category = {
  id: string;
  title: string;
  accent: string;
  themeBase: string;
  themeMid: string;
  themeLight: string;
  themeTextOnMid?: string;
  themeTextOnLight?: string;
  imageUrl?: string;
  isHidden?: boolean;
  isPublic?: boolean;
  isCompleted?: boolean;
  isShared?: boolean;
  displayOrder?: number;
  items: MilestoneItem[];
  tasks?: TaskItem[];
};
