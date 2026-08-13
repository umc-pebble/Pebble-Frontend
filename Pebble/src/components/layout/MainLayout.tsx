import { Outlet, useLocation } from 'react-router-dom';

import { GlobalNavigationBar } from '@/components/layout/GlobalNavigationBar';
import {
  MAIN_LAYOUT_HEIGHT,
  MAIN_LAYOUT_WIDTH,
  useMainLayoutViewport,
} from '@/components/layout/useMainLayoutViewport';
import {
  MobileCalendarLayout,
  MobileNestedPageLayout,
} from '@/features/calendar/components/mobile/MobileCalendarLayout';
import { CalendarSidebar } from '@/features/calendar/components/sidebar/CalendarSidebar';
import { SidebarDivider } from '@/features/calendar/components/sidebar/SidebarDivider';
import { CalendarLayoutProvider } from '@/features/calendar/context/CalendarLayoutProvider';
import { useCalendarLayoutContext } from '@/features/calendar/context/useCalendarLayoutContext';

const DesktopMainLayout = ({ scale }: { scale: number }) => {
  const {
    isSidebarOpen,
    onToggleSidebar,
    currentYear,
    currentMonth,
    selectedCalendarDate,
    selectedCategoryId,
    viewedUserId,
    categories,
    standaloneTasks,
    selectCategory,
    toggleCategoryVisibility,
    createCategory,
    createMilestone,
    createTask,
    updateMilestone,
    deleteMilestone,
    updateCategoryTask,
    deleteCategoryTask,
    updateTask,
    deleteTask,
    updateStandaloneTask,
    deleteStandaloneTask,
    toggleMilestoneCompleted,
    toggleCategoryTaskCompleted,
    toggleTaskCompleted,
    toggleStandaloneTaskCompleted,
  } = useCalendarLayoutContext();
  const isFriendCalendarView = viewedUserId !== null;

  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-auto bg-fill-inverse p-3 dark:bg-fill-surface">
      <div
        className="relative"
        style={{
          width: MAIN_LAYOUT_WIDTH * scale,
          height: MAIN_LAYOUT_HEIGHT * scale,
        }}
      >
        <div
          className="absolute left-0 top-0 flex origin-top-left gap-4"
          style={{ transform: `scale(${scale})` }}
        >
          <div className="relative flex h-[1000px] shrink-0 overflow-hidden rounded-[20px] shadow-shadow-m">
            <GlobalNavigationBar
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={onToggleSidebar}
            />
            <SidebarDivider visible={isSidebarOpen} />
            <CalendarSidebar
              isSidebarOpen={isSidebarOpen}
              categories={categories}
              standaloneTasks={standaloneTasks}
              currentYear={currentYear}
              currentMonth={currentMonth}
              selectedDate={selectedCalendarDate}
              onSelectCategory={selectCategory}
              isReadOnly={isFriendCalendarView}
              onToggleCategoryVisibility={toggleCategoryVisibility}
              selectedCategoryId={selectedCategoryId}
              onCreateCategory={createCategory}
              onCreateMilestone={createMilestone}
              onCreateTask={createTask}
              onUpdateMilestone={updateMilestone}
              onDeleteMilestone={deleteMilestone}
              onUpdateCategoryTask={updateCategoryTask}
              onDeleteCategoryTask={deleteCategoryTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onUpdateStandaloneTask={updateStandaloneTask}
              onDeleteStandaloneTask={deleteStandaloneTask}
              onToggleMilestoneCompleted={toggleMilestoneCompleted}
              onToggleCategoryTaskCompleted={toggleCategoryTaskCompleted}
              onToggleTaskCompleted={toggleTaskCompleted}
              onToggleStandaloneTaskCompleted={toggleStandaloneTaskCompleted}
            />
          </div>
          <Outlet />
        </div>
      </div>
    </main>
  );
};

const MainLayoutFrame = () => {
  const { pathname, search } = useLocation();
  const { isCompactLayout, isTablet, scale } = useMainLayoutViewport();
  const isCategoryDetail = new URLSearchParams(search).has('category');

  if (isCompactLayout && pathname === '/calendar' && !isCategoryDetail) {
    return <MobileCalendarLayout isTablet={isTablet} />;
  }

  if (isCompactLayout) {
    return <MobileNestedPageLayout isTablet={isTablet} />;
  }

  return <DesktopMainLayout scale={scale} />;
};

export const MainLayout = (): JSX.Element => (
  <CalendarLayoutProvider>
    <MainLayoutFrame />
  </CalendarLayoutProvider>
);
