import type { Category, ScheduleItem } from '@/types';

export type MilestoneAccordionProps = {
  category: Category;
  expanded: boolean;
  onToggleExpanded: () => void;
  onToggleMilestoneCompleted?: (
    categoryId: string,
    milestoneId: string,
  ) => void | Promise<void>;
  onToggleCategoryTaskCompleted?: (
    categoryId: string,
    taskId: string,
    taskDateId?: number,
  ) => void | Promise<void>;
  onToggleTaskCompleted?: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
    taskDateId?: number,
  ) => void | Promise<void>;
  onEditMilestone?: (categoryId: string, milestoneId: string) => void;
  onEditCategoryTask?: (categoryId: string, taskId: string) => void;
  onEditTask?: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => void;
  onAddSchedule?: (categoryId: string) => void;
  onSelectCategory?: (categoryId: string) => void;
  onToggleVisibility?: (categoryId: string) => void | Promise<void>;
  isSelected?: boolean;
};

export type SidebarScheduleRowProps = {
  item: ScheduleItem;
  checked: boolean;
  onToggle: (taskDateId?: number) => void;
  onEdit: () => void;
  barColor: string;
  widthClassName: string;
};
