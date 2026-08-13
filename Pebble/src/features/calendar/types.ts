import type {
  Category,
  MilestoneItem,
  ScheduleEntityBase,
  ScheduleStyleFields,
  TaskItem,
} from "@/types";

export type CreateCategoryInput = Omit<Category, "id" | "items"> & {
  id?: string;
  items?: MilestoneItem[];
  tasks?: TaskItem[];
  previousMembers?: Category["members"];
};

export type UpdateCategoryInput = Partial<Omit<Category, "id" | "items">> & {
  items?: MilestoneItem[];
  previousMembers?: Category["members"];
};

export type CreateScheduleItemInput = Omit<ScheduleEntityBase, "id"> &
  ScheduleStyleFields & {
    id?: string;
    categoryId?: string;
    milestoneId?: string;
    tasks?: TaskItem[];
  };

export type CalendarState = {
  currentUserId: number | null;
  categories: Category[];
  standaloneTasks: TaskItem[];
  selectedCategory: Category | null;
  selectedCategoryId: string | null;
  loadedViewedUserId: number | null;
  isCalendarLoading: boolean;
  calendarErrorMessage: string | null;
};

export type CalendarActions = {
  reloadCalendarData: () => Promise<void>;
  replaceCategories: (categories: Category[]) => void;
  selectCategory: (categoryId: string) => void;
  clearSelectedCategory: () => void;
  toggleCategoryVisibility: (categoryId: string) => Promise<void>;
  createCategory: (input: CreateCategoryInput) => Promise<Category | null>;
  updateCategory: (
    categoryId: string,
    input: UpdateCategoryInput,
  ) => Promise<void>;
  createMilestone: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => Promise<MilestoneItem[]>;
  updateMilestone: (
    categoryId: string,
    milestoneId: string,
    input: CreateScheduleItemInput,
  ) => Promise<void>;
  createTask: (
    categoryId: string,
    milestoneId: string,
    input: CreateScheduleItemInput,
  ) => Promise<TaskItem>;
  createCategoryTask: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => Promise<TaskItem>;
  updateCategoryTask: (
    categoryId: string,
    taskId: string,
    input: CreateScheduleItemInput,
  ) => Promise<void>;
  deleteCategoryTask: (categoryId: string, taskId: string) => Promise<void>;
  createStandaloneTask: (input: CreateScheduleItemInput) => Promise<TaskItem>;
  updateStandaloneTask: (
    taskId: string,
    input: CreateScheduleItemInput,
  ) => Promise<void>;
  deleteStandaloneTask: (taskId: string) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  deleteMilestone: (categoryId: string, milestoneId: string) => Promise<void>;
  deleteTask: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => Promise<void>;
  updateTask: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
    input: CreateScheduleItemInput,
  ) => Promise<void>;
  toggleMilestoneCompleted: (
    categoryId: string,
    milestoneId: string,
  ) => Promise<void>;
  toggleCategoryTaskCompleted: (
    categoryId: string,
    taskId: string,
    taskDateId?: number,
  ) => Promise<void>;
  toggleTaskCompleted: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
    taskDateId?: number,
  ) => Promise<void>;
  toggleStandaloneTaskCompleted: (
    taskId: string,
    taskDateId?: number,
  ) => Promise<void>;
};

export type CalendarStateModel = CalendarState & CalendarActions;
