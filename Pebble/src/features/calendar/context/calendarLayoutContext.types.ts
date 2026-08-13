import type {
  CalendarStateModel,
  CreateCategoryInput,
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";
import type { TaskFormSubmitInput } from "@/features/task/components/TaskFormModal";
import type { Category, MilestoneItem } from "@/types";

export type CalendarLayoutContextValue = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  currentYear: number;
  currentMonth: number;
  onChangeCalendarMonth: (year: number, month: number) => void;
  selectedCalendarDate: Date | null;
  onSelectCalendarDate: (date: Date) => void;
  onClearSelectedCalendarDate: () => void;
  selectedCategoryId: string | null;
  viewedUserId: number | null;
  loadedViewedUserId: number | null;
  currentUserId: number | null;
  categories: Category[];
  standaloneTasks: CalendarStateModel["standaloneTasks"];
  isCalendarLoading: boolean;
  calendarErrorMessage: string | null;
  reloadCalendarData: CalendarStateModel["reloadCalendarData"];
  replaceCategories: CalendarStateModel["replaceCategories"];
  selectCategory: (categoryId: string) => void;
  toggleCategoryVisibility: CalendarStateModel["toggleCategoryVisibility"];
  createCategory: (input: CreateCategoryInput) => Promise<void>;
  createMilestone: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => Promise<MilestoneItem[]>;
  createTask: (input: TaskFormSubmitInput) => Promise<void>;
  updateCategoryTask: CalendarStateModel["updateCategoryTask"];
  deleteCategoryTask: CalendarStateModel["deleteCategoryTask"];
  updateCategory: (
    categoryId: string,
    input: UpdateCategoryInput,
  ) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  updateMilestone: CalendarStateModel["updateMilestone"];
  deleteMilestone: (categoryId: string, milestoneId: string) => Promise<void>;
  updateTask: CalendarStateModel["updateTask"];
  deleteTask: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => Promise<void>;
  updateStandaloneTask: CalendarStateModel["updateStandaloneTask"];
  deleteStandaloneTask: CalendarStateModel["deleteStandaloneTask"];
  toggleMilestoneCompleted: CalendarStateModel["toggleMilestoneCompleted"];
  toggleCategoryTaskCompleted: CalendarStateModel["toggleCategoryTaskCompleted"];
  toggleTaskCompleted: CalendarStateModel["toggleTaskCompleted"];
  toggleStandaloneTaskCompleted: CalendarStateModel["toggleStandaloneTaskCompleted"];
};
