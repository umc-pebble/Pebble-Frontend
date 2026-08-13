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
    categoryId?: string;
    seriesId?: number;
    dateType?: "SINGLE" | "RANGE" | "MULTIPLE";
    isCompleted?: boolean;
    displayOrder?: number;
    tasks?: TaskItem[];
  };

export type ScheduleItem = MilestoneItem | TaskItem;

export type CategoryMember = {
  id: number;
  name: string;
  role?: "OWNER" | "MEMBER";
  uniqueTag?: string;
  email?: string;
  profileImageUrl?: string | null;
};

export type Category = {
  id: string;
  userId?: number;
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
  members?: CategoryMember[];
  displayOrder?: number;
  milestoneCount?: number;
  taskCount?: number;
  sharedTaskCount?: number;
  hasSchedules?: boolean;
  taskTotalCount?: number;
  taskCompletedCount?: number;
  progressRate?: number;
  items: MilestoneItem[];
  tasks?: TaskItem[];
};
