import { leaveSharedCategory } from '@/features/category/api/sharedCategoryApi';
import type { CategoryDetailState } from '@/features/category/hooks/useCategoryDetailState';
import type {
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from '@/features/calendar/types';
import { MilestoneFormModal } from '@/features/milestone/components/MilestoneFormModal';
import {
  TaskFormModal,
  type TaskFormSubmitInput,
} from '@/features/task/components/TaskFormModal';
import type { Category } from '@/types';

import { CategoryFormModal } from './CategoryFormModal';
import { DeleteCategoryModal } from './DeleteCategoryModal';

type CategoryDetailModalsProps = {
  category: Category;
  categories: Category[];
  currentUserId: number | null;
  state: CategoryDetailState;
  onBack: () => void;
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
};

export const CategoryDetailModals = ({
  category,
  categories,
  currentUserId,
  state,
  onBack,
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
}: CategoryDetailModalsProps) => {
  const canDeleteCategory =
    !category.isShared ||
    (currentUserId !== null &&
      category.userId !== undefined &&
      category.userId === currentUserId);

  return (
    <>
      <CategoryFormModal
        isOpen={state.isEditModalOpen}
        mode="edit"
        category={category}
        onSubmit={(input) => onUpdateCategory(category.id, input)}
        onClose={state.closeCategoryEditModal}
        onRequestDelete={
          canDeleteCategory
            ? () => {
                state.closeCategoryEditModal();
                state.openCategoryDeleteModal();
              }
            : undefined
        }
        currentUserId={currentUserId}
        onLeaveCategory={async () => {
          await leaveSharedCategory(category.id);
          await onReloadCalendarData();
          state.closeCategoryEditModal();
          onBack();
        }}
      />

      <DeleteCategoryModal
        isOpen={state.isDeleteModalOpen}
        category={category}
        onClose={state.closeCategoryDeleteModal}
        onDelete={async () => {
          await onDeleteCategory(category.id);
          state.closeCategoryDeleteModal();
        }}
      />

      <MilestoneFormModal
        isOpen={Boolean(state.editingMilestoneId)}
        onClose={state.closeMilestoneEditor}
        categories={categories}
        mode="edit"
        milestone={state.editingMilestone}
        defaultCategoryId={category.id}
        onSubmit={async (categoryId, input) => {
          if (!state.editingMilestoneId) return;

          await onUpdateMilestone(
            categoryId,
            state.editingMilestoneId,
            input,
          );
          state.closeMilestoneEditor();
        }}
        onRequestDelete={async () => {
          if (!state.editingMilestoneId) return;

          await onDeleteMilestone(category.id, state.editingMilestoneId);
          state.closeMilestoneEditor();
        }}
      />

      <TaskFormModal
        isOpen={state.isTaskModalOpen}
        onClose={state.closeMilestoneTaskModal}
        categories={categories}
        defaultCategoryId={category.id}
        defaultMilestoneId={state.selectedMilestoneForTask}
        task={state.editingTask}
        mode={state.taskMode}
        onSubmit={async (input) => {
          if (
            state.taskMode === 'edit' &&
            state.selectedMilestoneForTask &&
            state.editingTaskId
          ) {
            await onUpdateTask(
              category.id,
              state.selectedMilestoneForTask,
              state.editingTaskId,
              {
                ...input.task,
                categoryId: input.categoryId ?? undefined,
                milestoneId: input.milestoneId ?? undefined,
              },
            );
            return;
          }

          await onCreateTask(input);
        }}
        onRequestDelete={async () => {
          if (!state.selectedMilestoneForTask || !state.editingTaskId) return;

          await onDeleteTask(
            category.id,
            state.selectedMilestoneForTask,
            state.editingTaskId,
          );
          state.closeMilestoneTaskModal();
        }}
      />

      <TaskFormModal
        isOpen={Boolean(state.editingCategoryTask)}
        onClose={state.closeCategoryTaskEditor}
        categories={categories}
        defaultCategoryId={category.id}
        task={state.editingCategoryTask}
        mode="edit"
        onSubmit={async ({ categoryId, milestoneId, task }) => {
          if (!state.editingCategoryTaskId) return;

          await onUpdateCategoryTask(
            category.id,
            state.editingCategoryTaskId,
            {
              ...task,
              categoryId: categoryId ?? undefined,
              milestoneId: milestoneId ?? undefined,
            },
          );
        }}
        onRequestDelete={async () => {
          if (!state.editingCategoryTaskId) return;

          await onDeleteCategoryTask(
            category.id,
            state.editingCategoryTaskId,
          );
          state.closeCategoryTaskEditor();
        }}
      />
    </>
  );
};
