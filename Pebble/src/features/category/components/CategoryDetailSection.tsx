import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react';
import { useCategoryDetailState } from '@/features/category/hooks/useCategoryDetailState';
import type {
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from '@/features/calendar/types';
import type { TaskFormSubmitInput } from '@/features/task/components/TaskFormModal';
import type { Category } from '@/types';

import { CategoryDetailHeader } from './CategoryDetailHeader';
import { CategoryDetailModals } from './CategoryDetailModals';
import { CategoryDetailScheduleList } from './CategoryDetailScheduleList';

type CategoryDetailSectionProps = {
  isSidebarOpen: boolean;
  category: Category;
  backLabel?: string;
  currentUserId: number | null;
  onBack: () => void;
  categories: Category[];
  onUpdateCategory: (
    categoryId: string,
    input: UpdateCategoryInput,
  ) => Promise<void>;
  onCreateTask: (
    input: TaskFormSubmitInput,
  ) => void | Promise<void>;
  onUpdateCategoryTask: (
    categoryId: string,
    taskId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<void>;
  onDeleteCategoryTask: (
    categoryId: string,
    taskId: string,
  ) => void | Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onReloadCalendarData: () => Promise<void>;
  onUpdateMilestone: (
    categoryId: string,
    milestoneId: string,
    input: CreateScheduleItemInput,
  ) => Promise<void>;
  onDeleteMilestone: (
    categoryId: string,
    milestoneId: string,
  ) => Promise<void>;
  onUpdateTask: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
    input: CreateScheduleItemInput,
  ) => Promise<void>;
  onDeleteTask: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => Promise<void>;
  onToggleMilestoneCompleted: (
    categoryId: string,
    milestoneId: string,
  ) => Promise<void>;
  onToggleCategoryTaskCompleted: (
    categoryId: string,
    taskId: string,
    taskDateId?: number,
  ) => Promise<void>;
  onToggleTaskCompleted: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => Promise<void>;
};

export const CategoryDetailSection = ({
  isSidebarOpen,
  category,
  backLabel = '캘린더',
  currentUserId,
  onBack,
  categories,
  onUpdateCategory,
  onCreateTask,
  onUpdateCategoryTask,
  onDeleteCategoryTask,
  onDeleteCategory,
  onReloadCalendarData,
  onUpdateMilestone,
  onDeleteMilestone,
  onUpdateTask,
  onDeleteTask,
  onToggleMilestoneCompleted,
  onToggleCategoryTaskCompleted,
  onToggleTaskCompleted,
}: CategoryDetailSectionProps) => {
  const state = useCategoryDetailState(category);

  return (
    <section
      className={[
        'relative h-[1000px] overflow-hidden rounded-[20px]',
        'bg-fill-inverse shadow-shadow-m dark:shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)]',
        'transition-all duration-300',
        isSidebarOpen ? 'w-[898px]' : 'w-[1290px]',
        'max-xl:h-[calc(100vh-116px)] max-xl:min-h-[600px] max-xl:w-full max-xl:overflow-y-auto max-xl:p-4',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={onBack}
        className="absolute left-[20px] top-[36px] flex items-center gap-2 transition-opacity hover:opacity-80 max-xl:static max-xl:w-fit"
        aria-label={`${backLabel}로 돌아가기`}
      >
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl">
          <ChevronLeftIcon className="h-6 w-6 text-text-strong" />
        </div>
        <span className="text-body-02-m text-text-strong sm:text-[24px] sm:font-medium sm:leading-8">
          {backLabel}
        </span>
      </button>

      <CategoryDetailHeader
        category={category}
        onEdit={state.openCategoryEditModal}
      />

      <div className="absolute left-[72px] top-[392px] flex items-end gap-2 max-xl:static max-xl:mt-8">
        <h2 className="text-title-02-sb text-text-strong">마일스톤</h2>
        <span className="text-[20px] font-medium leading-6 text-text-teritary">
          {category.items.length}
        </span>
      </div>

      <CategoryDetailScheduleList
        category={category}
        expandedMilestones={state.expandedMilestones}
        onEditCategoryTask={state.openCategoryTaskEditor}
        onEditMilestone={state.openMilestoneEditor}
        onAddMilestoneTask={state.openMilestoneTaskCreator}
        onEditMilestoneTask={state.openMilestoneTaskEditor}
        onToggleMilestone={state.toggleMilestone}
        onToggleMilestoneCompleted={onToggleMilestoneCompleted}
        onToggleCategoryTaskCompleted={onToggleCategoryTaskCompleted}
        onToggleTaskCompleted={onToggleTaskCompleted}
      />

      <CategoryDetailModals
        category={category}
        categories={categories}
        currentUserId={currentUserId}
        state={state}
        onBack={onBack}
        onUpdateCategory={onUpdateCategory}
        onCreateTask={onCreateTask}
        onUpdateCategoryTask={onUpdateCategoryTask}
        onDeleteCategoryTask={onDeleteCategoryTask}
        onDeleteCategory={onDeleteCategory}
        onReloadCalendarData={onReloadCalendarData}
        onUpdateMilestone={onUpdateMilestone}
        onDeleteMilestone={onDeleteMilestone}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
      />
    </section>
  );
};
