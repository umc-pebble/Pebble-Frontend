import { CalendarBoard } from "@/features/milestone/components/CalendarBoard";
import { CategoryDetailSection } from "@/features/category/components/CategoryDetailSection";
import { useCategoryDetail } from "@/features/category/hooks/useCategoryDetail";
import { useCalendarLayoutContext } from "@/features/calendar/context/useCalendarLayoutContext";
import { useNavigate, useSearchParams } from "react-router-dom";

export const CalendarMainPage = (): JSX.Element => {
  const {
    isSidebarOpen,
    currentYear,
    currentMonth,
    onChangeCalendarMonth,
    selectedCalendarDate,
    onSelectCalendarDate,
    onClearSelectedCalendarDate,
    currentUserId,
    categories,
    standaloneTasks,
    isCalendarLoading,
    calendarErrorMessage,
    reloadCalendarData,
    createTask,
    updateCategoryTask,
    deleteCategoryTask,
    updateCategory,
    deleteCategory,
    updateMilestone,
    deleteMilestone,
    updateTask,
    deleteTask,
    toggleMilestoneCompleted,
    toggleCategoryTaskCompleted,
    toggleTaskCompleted,
  } = useCalendarLayoutContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get("category");
  const isFromMyPage = searchParams.get("from") === "my";

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const selectedCategoryDetail = useCategoryDetail(selectedCategory);

  return selectedCategoryDetail ? (
    <CategoryDetailSection
      isSidebarOpen={isSidebarOpen}
      category={selectedCategoryDetail}
      backLabel={isFromMyPage ? "마이페이지" : "캘린더"}
      currentUserId={currentUserId}
      onBack={() => {
        if (isFromMyPage) {
          navigate("/my");
          return;
        }

        setSearchParams({});
      }}
      categories={categories}
      onUpdateCategory={updateCategory}
      onCreateTask={createTask}
      onUpdateCategoryTask={updateCategoryTask}
      onDeleteCategoryTask={deleteCategoryTask}
      onDeleteCategory={async (categoryId) => {
        await deleteCategory(categoryId);

        if (isFromMyPage) {
          navigate("/my");
        }
      }}
      onReloadCalendarData={reloadCalendarData}
      onUpdateMilestone={updateMilestone}
      onDeleteMilestone={deleteMilestone}
      onUpdateTask={updateTask}
      onDeleteTask={deleteTask}
      onToggleMilestoneCompleted={toggleMilestoneCompleted}
      onToggleCategoryTaskCompleted={toggleCategoryTaskCompleted}
      onToggleTaskCompleted={toggleTaskCompleted}
    />
  ) : (
    <CalendarBoard
      isSidebarOpen={isSidebarOpen}
      categories={categories}
      standaloneTasks={standaloneTasks}
      currentYear={currentYear}
      currentMonth={currentMonth}
      onChangeCalendarMonth={onChangeCalendarMonth}
      selectedDate={selectedCalendarDate}
      onSelectDate={onSelectCalendarDate}
      onClearSelectedDate={onClearSelectedCalendarDate}
      isLoading={isCalendarLoading}
      errorMessage={calendarErrorMessage}
      onRetry={reloadCalendarData}
    />
  );
};
