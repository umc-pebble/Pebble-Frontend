import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { CalendarLayoutContext } from "@/features/calendar/context/calendarLayoutContext";
import type { CalendarLayoutContextValue } from "@/features/calendar/context/calendarLayoutContext.types";
import { useCalendarState } from "@/features/calendar/hooks/useCalendarState";
import type { CreateCategoryInput } from "@/features/calendar/types";
import { CALENDAR_UPDATED_EVENT } from "@/features/calendar/utils/calendarSync";
import type { TaskFormSubmitInput } from "@/features/task/components/TaskFormModal";

type CalendarLayoutProviderProps = {
  children: ReactNode;
};

export const CalendarLayoutProvider = ({
  children,
}: CalendarLayoutProviderProps): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentYear, setCurrentYear] = useState<number>(
    () => new Date().getFullYear(),
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    () => new Date().getMonth() + 1,
  );
  const [selectedCalendarDate, setSelectedCalendarDate] =
    useState<Date | null>(null);
  const viewedUserIdParam = searchParams.get("friendId");
  const parsedViewedUserId = viewedUserIdParam
    ? Number(viewedUserIdParam)
    : null;
  const viewedUserId =
    parsedViewedUserId !== null && Number.isFinite(parsedViewedUserId)
      ? parsedViewedUserId
      : null;
  const {
    currentUserId,
    categories,
    standaloneTasks,
    replaceCategories,
    selectCategory,
    toggleCategoryVisibility,
    createCategory,
    createMilestone,
    createTask,
    createCategoryTask,
    updateCategoryTask,
    deleteCategoryTask,
    createStandaloneTask,
    updateStandaloneTask,
    deleteStandaloneTask,
    updateCategory,
    deleteCategory,
    updateMilestone,
    deleteMilestone,
    updateTask,
    deleteTask,
    toggleMilestoneCompleted,
    toggleCategoryTaskCompleted,
    toggleTaskCompleted,
    toggleStandaloneTaskCompleted,
    loadedViewedUserId,
    isCalendarLoading,
    calendarErrorMessage,
    reloadCalendarData,
  } = useCalendarState({
    currentYear,
    currentMonth,
    viewedUserId,
  });
  const selectedCategoryId = searchParams.get("category");

  const handleToggleSidebar = () => {
    setIsSidebarOpen((previous) => !previous);
  };

  const handleChangeCalendarMonth = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    setSelectedCalendarDate(null);
  };

  const handleSelectCalendarDate = (date: Date) => {
    setSelectedCalendarDate((previousSelectedDate) => {
      if (
        previousSelectedDate &&
        previousSelectedDate.getFullYear() === date.getFullYear() &&
        previousSelectedDate.getMonth() === date.getMonth() &&
        previousSelectedDate.getDate() === date.getDate()
      ) {
        return null;
      }

      return date;
    });
  };

  const handleSelectCategory = (categoryId: string) => {
    if (selectedCategoryId === categoryId) {
      navigate("/calendar");
      return;
    }

    selectCategory(categoryId);
    navigate(`/calendar?category=${categoryId}`);
  };

  const handleCreateCategory = async (input: CreateCategoryInput) => {
    await createCategory(input);

    if (pathname.startsWith("/calendar")) {
      navigate("/calendar");
    }
  };

  useEffect(() => {
    const handleCalendarUpdated = () => {
      void reloadCalendarData();
    };

    window.addEventListener(CALENDAR_UPDATED_EVENT, handleCalendarUpdated);

    return () => {
      window.removeEventListener(CALENDAR_UPDATED_EVENT, handleCalendarUpdated);
    };
  }, [reloadCalendarData]);

  const handleDeleteCategory = async (categoryId: string) => {
    await deleteCategory(categoryId);
    navigate("/calendar");
  };

  const handleCreateTask = async ({
    categoryId,
    milestoneId,
    task,
  }: TaskFormSubmitInput) => {
    if (categoryId && milestoneId) {
      await createTask(categoryId, milestoneId, task);
      return;
    }

    if (categoryId) {
      await createCategoryTask(categoryId, task);
      return;
    }

    await createStandaloneTask(task);
  };

  const value: CalendarLayoutContextValue = {
    isSidebarOpen,
    onToggleSidebar: handleToggleSidebar,
    currentYear,
    currentMonth,
    onChangeCalendarMonth: handleChangeCalendarMonth,
    selectedCalendarDate,
    onSelectCalendarDate: handleSelectCalendarDate,
    onClearSelectedCalendarDate: () => setSelectedCalendarDate(null),
    selectedCategoryId,
    viewedUserId,
    loadedViewedUserId,
    currentUserId,
    categories,
    standaloneTasks,
    isCalendarLoading,
    calendarErrorMessage,
    reloadCalendarData,
    replaceCategories,
    selectCategory: handleSelectCategory,
    toggleCategoryVisibility,
    createCategory: handleCreateCategory,
    createMilestone,
    createTask: handleCreateTask,
    updateCategoryTask,
    deleteCategoryTask,
    updateCategory,
    deleteCategory: handleDeleteCategory,
    updateMilestone,
    deleteMilestone,
    updateTask,
    deleteTask,
    updateStandaloneTask,
    deleteStandaloneTask,
    toggleMilestoneCompleted,
    toggleCategoryTaskCompleted,
    toggleTaskCompleted,
    toggleStandaloneTaskCompleted,
  };

  return (
    <CalendarLayoutContext.Provider value={value}>
      {children}
    </CalendarLayoutContext.Provider>
  );
};
