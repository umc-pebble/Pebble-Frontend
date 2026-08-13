import { type Category, type MilestoneItem, type TaskItem } from "@/types";

import type { TaskFormSubmitInput } from "@/features/task/components/TaskFormModal";
import { StandaloneTaskSection } from "@/features/task/components/StandaloneTaskSection";
import { MilestoneAccordion } from "@/features/milestone/components/MilestoneAccordion";
import { AddButton } from "@/components/ui/AddButton";
import { CalendarSidebarHeader } from "./CalendarSidebarHeader";
import { CalendarSidebarListView } from "./CalendarSidebarListView";
import { CalendarSidebarSelectedDateView } from "./CalendarSidebarSelectedDateView";
import { SidebarButtonArea } from "./SidebarButtonArea";
import { CalendarSidebarModals } from "./CalendarSidebarModals";
import { useCalendarSidebarModals } from "@/features/calendar/hooks/useCalendarSidebarModals";
import { useCalendarSidebarEditors } from "@/features/calendar/hooks/useCalendarSidebarEditors";
import { useCalendarSidebarState } from "@/features/calendar/hooks/useCalendarSidebarState";
import { useSidebarButtonShadow } from "@/features/calendar/hooks/useSidebarButtonShadow";
import type {
  CreateCategoryInput,
  CreateScheduleItemInput,
} from "@/features/calendar/types";

export const CalendarSidebar = ({
  isSidebarOpen = true,
  categories,
  standaloneTasks,
  currentYear,
  currentMonth,
  selectedDate,
  onSelectCategory,
  selectedCategoryId,
  onCreateCategory,
  onCreateMilestone,
  onCreateTask,
  onUpdateMilestone,
  onDeleteMilestone,
  onUpdateCategoryTask,
  onDeleteCategoryTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateStandaloneTask,
  onDeleteStandaloneTask,
  onToggleMilestoneCompleted,
  onToggleCategoryTaskCompleted,
  onToggleTaskCompleted,
  onToggleStandaloneTaskCompleted,
  onToggleCategoryVisibility,
  isReadOnly = false,
}: {
  isSidebarOpen?: boolean;
  isReadOnly?: boolean;
  categories: Category[];
  standaloneTasks: TaskItem[];
  currentYear: number;
  currentMonth: number;
  selectedDate?: Date | null;
  onSelectCategory?: (categoryId: string) => void;
  selectedCategoryId?: string | null;
  onCreateCategory?: (input: CreateCategoryInput) => void | Promise<void>;
  onCreateMilestone?: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<MilestoneItem[]>;
  onCreateTask?: (input: TaskFormSubmitInput) => void | Promise<void>;
  onUpdateMilestone?: (
    categoryId: string,
    milestoneId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<void>;
  onDeleteMilestone?: (
    categoryId: string,
    milestoneId: string,
  ) => void | Promise<void>;
  onUpdateCategoryTask?: (
    categoryId: string,
    taskId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<void>;
  onDeleteCategoryTask?: (
    categoryId: string,
    taskId: string,
  ) => void | Promise<void>;
  onUpdateTask?: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<void>;
  onDeleteTask?: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => void | Promise<void>;
  onUpdateStandaloneTask?: (
    taskId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<void>;
  onDeleteStandaloneTask?: (taskId: string) => void | Promise<void>;
  onToggleMilestoneCompleted?: (
    categoryId: string,
    milestoneId: string,
  ) => void | Promise<void>;
  onToggleCategoryTaskCompleted?: (
    categoryId: string,
    taskId: string,
  ) => void | Promise<void>;
  onToggleTaskCompleted?: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => void | Promise<void>;
  onToggleStandaloneTaskCompleted?: (
    taskId: string,
    taskDateId?: number,
  ) => void | Promise<void>;
  onToggleCategoryVisibility?: (categoryId: string) => void | Promise<void>;
}): JSX.Element => {
  const canEdit = !isReadOnly;
  const {
    viewMode,
    setViewMode,
    expandedCategories,
    monthLabel,
    displayedCategories,
    displayedStandaloneTasks,
    hasDisplayedSchedules,
    toggleCategory,
  } = useCalendarSidebarState({
    categories,
    standaloneTasks,
    currentYear,
    currentMonth,
  });
  const sidebarTitle = selectedDate
    ? `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`
    : monthLabel;
  const { scrollContainerRef, hasHiddenContentUnderButton } =
    useSidebarButtonShadow({
      displayedCategories,
      displayedStandaloneTasks,
      expandedCategories,
      viewMode,
    });
  const {
    isAddMenuOpen,
    openAddMenu,
    closeAddMenu,
    isCategoryModalOpen,
    isMilestoneModalOpen,
    isTaskModalOpen,
    openCategoryModal,
    openMilestoneModal,
    openTaskModal,
    createDefaultCategoryId,
    closeCreateModal,
    editingStandaloneTaskId,
    editingStandaloneTask,
    openStandaloneTaskEditor,
    closeStandaloneTaskEditor,
  } = useCalendarSidebarModals({ standaloneTasks });
  const {
    categoryTask: editingCategoryTask,
    categoryTaskTarget: editingCategoryTaskTarget,
    closeCategoryTaskEditor,
    closeMilestoneEditor,
    closeMilestoneTaskEditor,
    milestone: editingMilestone,
    milestoneTarget: editingMilestoneTarget,
    milestoneTask: editingTask,
    milestoneTaskTarget: editingTaskTarget,
    openCategoryTaskEditor,
    openMilestoneEditor,
    openMilestoneTaskEditor,
  } = useCalendarSidebarEditors(categories);

  return (
    <aside 
      className={`flex shrink-0 h-[1000px] relative items-stretch overflow-visible transition-all duration-300 ${
        isSidebarOpen ? "w-[392px]" : "w-0"
      }`}
    >
      {/* 메인 마일스톤 관리 영역 */}
      <section 
        className={`relative h-[1000px] bg-fill-inverse rounded-[0px_32px_32px_0px] flex flex-col transition-all duration-300 overflow-hidden shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)] dark:border-r dark:border-border-teritory ${
          isSidebarOpen ? "w-[392px] opacity-100" : "w-0 opacity-0"
        }`}
      >
        <div className="w-[392px] min-w-[392px] h-[1000px] flex flex-col">
          <CalendarSidebarHeader
            monthLabel={sidebarTitle}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
          />
          {/* Flexbox에서 내용이 부모를 뚫고 나가는 것을 방지하기 위해 min-h-0 추가 */}
          <div className="relative -left-px flex min-h-0 h-[888px] w-full flex-col px-5 pb-3 pt-1">
            <div
              ref={scrollContainerRef}
              className="-mx-3 flex max-h-[calc(100%-56px)] w-[calc(100%+24px)] flex-col items-start gap-5 overflow-y-auto overflow-x-hidden px-3 py-3 custom-scrollbar"
            >
              {selectedDate ? (
                <CalendarSidebarSelectedDateView
                  categories={displayedCategories}
                  standaloneTasks={displayedStandaloneTasks}
                  currentYear={currentYear}
                  currentMonth={currentMonth}
                  selectedDate={selectedDate}
                  viewMode={viewMode}
                  onAddSchedule={canEdit ? openAddMenu : undefined}
                  onToggleMilestoneCompleted={
                    canEdit ? onToggleMilestoneCompleted : undefined
                  }
                  onToggleCategoryTaskCompleted={
                    canEdit ? onToggleCategoryTaskCompleted : undefined
                  }
                  onToggleTaskCompleted={
                    canEdit ? onToggleTaskCompleted : undefined
                  }
                  onToggleStandaloneTaskCompleted={
                    canEdit ? onToggleStandaloneTaskCompleted : undefined
                  }
                  onEditStandaloneTask={
                    canEdit ? openStandaloneTaskEditor : undefined
                  }
                  onEditCategoryTask={
                    canEdit
                      ? openCategoryTaskEditor
                      : undefined
                  }
                  onEditMilestone={
                    canEdit
                      ? openMilestoneEditor
                      : undefined
                  }
                  onEditTask={
                    canEdit
                      ? openMilestoneTaskEditor
                      : undefined
                  }
                />
              ) : viewMode === "list" ? (
                <CalendarSidebarListView
                  categories={displayedCategories}
                  standaloneTasks={displayedStandaloneTasks}
                  currentYear={currentYear}
                  currentMonth={currentMonth}
                  onToggleMilestoneCompleted={
                    canEdit ? onToggleMilestoneCompleted : undefined
                  }
                  onToggleCategoryTaskCompleted={
                    canEdit ? onToggleCategoryTaskCompleted : undefined
                  }
                  onToggleTaskCompleted={
                    canEdit ? onToggleTaskCompleted : undefined
                  }
                  onToggleStandaloneTaskCompleted={
                    canEdit ? onToggleStandaloneTaskCompleted : undefined
                  }
                  onEditStandaloneTask={
                    canEdit ? openStandaloneTaskEditor : undefined
                  }
                  onEditCategoryTask={
                    canEdit
                      ? openCategoryTaskEditor
                      : undefined
                  }
                  onEditMilestone={
                    canEdit
                      ? openMilestoneEditor
                      : undefined
                  }
                  onEditTask={
                    canEdit
                      ? openMilestoneTaskEditor
                      : undefined
                  }
                />
              ) : (
                <>
                  {displayedStandaloneTasks.length > 0 && (
                    <StandaloneTaskSection
                      tasks={displayedStandaloneTasks}
                      onToggleTaskCompleted={
                        canEdit ? onToggleStandaloneTaskCompleted : undefined
                      }
                      onEditTask={canEdit ? openStandaloneTaskEditor : undefined}
                    />
                  )}

                  {displayedCategories.map((category) => (
                    <MilestoneAccordion
                      key={category.id}
                      category={category}
                      expanded={Boolean(expandedCategories[category.id])}
                      onToggleExpanded={() => toggleCategory(category.id)}
                      onToggleMilestoneCompleted={
                        canEdit ? onToggleMilestoneCompleted : undefined
                      }
                      onToggleCategoryTaskCompleted={
                        canEdit ? onToggleCategoryTaskCompleted : undefined
                      }
                      onToggleTaskCompleted={
                        canEdit ? onToggleTaskCompleted : undefined
                      }
                      onEditCategoryTask={
                        canEdit
                          ? openCategoryTaskEditor
                          : undefined
                      }
                      onEditMilestone={
                        canEdit
                          ? openMilestoneEditor
                          : undefined
                      }
                      onEditTask={
                        canEdit
                          ? openMilestoneTaskEditor
                          : undefined
                      }
                      onAddSchedule={
                        canEdit ? (categoryId) => openAddMenu(categoryId) : undefined
                      }
                      onSelectCategory={canEdit ? onSelectCategory : undefined}
                      onToggleVisibility={
                        canEdit ? onToggleCategoryVisibility : undefined
                      }
                      isSelected={selectedCategoryId === category.id}
                    />
                  ))}
                </>
              )}
            </div>

            {canEdit && (
              <SidebarButtonArea
                hasContent={hasDisplayedSchedules}
                hasHiddenContentUnderButton={hasHiddenContentUnderButton}
              >
                <AddButton
                  label="추가하기"
                  variant="primary"
                  className="w-[352px]"
                  showIcon={false}
                  onClick={() => openAddMenu()}
                />
              </SidebarButtonArea>
            )}
          </div>
        </div>
      </section>
      
      {canEdit ? (
        <CalendarSidebarModals
          categories={categories}
          createDefaultCategoryId={createDefaultCategoryId}
          editingCategoryTask={editingCategoryTask}
          editingCategoryTaskTarget={editingCategoryTaskTarget}
          editingMilestone={editingMilestone}
          editingMilestoneTarget={editingMilestoneTarget}
          editingStandaloneTask={editingStandaloneTask}
          editingStandaloneTaskId={editingStandaloneTaskId}
          editingTask={editingTask}
          editingTaskTarget={editingTaskTarget}
          isAddMenuOpen={isAddMenuOpen}
          isCategoryModalOpen={isCategoryModalOpen}
          isMilestoneModalOpen={isMilestoneModalOpen}
          isTaskModalOpen={isTaskModalOpen}
          closeAddMenu={closeAddMenu}
          closeCategoryTaskEditor={closeCategoryTaskEditor}
          closeCreateModal={closeCreateModal}
          closeMilestoneEditor={closeMilestoneEditor}
          closeMilestoneTaskEditor={closeMilestoneTaskEditor}
          closeStandaloneTaskEditor={closeStandaloneTaskEditor}
          openCategoryModal={openCategoryModal}
          openMilestoneModal={openMilestoneModal}
          openTaskModal={openTaskModal}
          onCreateCategory={onCreateCategory}
          onCreateMilestone={onCreateMilestone}
          onCreateTask={onCreateTask}
          onDeleteCategoryTask={onDeleteCategoryTask}
          onDeleteMilestone={onDeleteMilestone}
          onDeleteStandaloneTask={onDeleteStandaloneTask}
          onDeleteTask={onDeleteTask}
          onUpdateCategoryTask={onUpdateCategoryTask}
          onUpdateMilestone={onUpdateMilestone}
          onUpdateStandaloneTask={onUpdateStandaloneTask}
          onUpdateTask={onUpdateTask}
        />
      ) : null}
    </aside>
  );
};
