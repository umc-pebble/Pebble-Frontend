import { CategoryFormModal } from "@/features/category/components/CategoryFormModal";
import type {
  CreateCategoryInput,
  CreateScheduleItemInput,
} from "@/features/calendar/types";
import { MilestoneFormModal } from "@/features/milestone/components/MilestoneFormModal";
import {
  TaskFormModal,
  type TaskFormSubmitInput,
} from "@/features/task/components/TaskFormModal";
import type { Category, MilestoneItem, TaskItem } from "@/types";

import { AddMenuModal } from "./AddMenuModal";

type MilestoneTarget = {
  categoryId: string;
  milestoneId: string;
};

type CategoryTaskTarget = {
  categoryId: string;
  taskId: string;
};

type MilestoneTaskTarget = MilestoneTarget & {
  taskId: string;
};

type CalendarSidebarModalsProps = {
  categories: Category[];
  createDefaultCategoryId: string | null;
  editingCategoryTask: TaskItem | null;
  editingCategoryTaskTarget: CategoryTaskTarget | null;
  editingMilestone: MilestoneItem | null;
  editingMilestoneTarget: MilestoneTarget | null;
  editingStandaloneTask: TaskItem | null;
  editingStandaloneTaskId: string | null;
  editingTask: TaskItem | null;
  editingTaskTarget: MilestoneTaskTarget | null;
  isAddMenuOpen: boolean;
  isCategoryModalOpen: boolean;
  isMilestoneModalOpen: boolean;
  isTaskModalOpen: boolean;
  closeAddMenu: () => void;
  closeCategoryTaskEditor: () => void;
  closeCreateModal: () => void;
  closeMilestoneEditor: () => void;
  closeMilestoneTaskEditor: () => void;
  closeStandaloneTaskEditor: () => void;
  openCategoryModal: () => void;
  openMilestoneModal: (categoryId?: string | null) => void;
  openTaskModal: (categoryId?: string | null) => void;
  onCreateCategory?: (input: CreateCategoryInput) => void | Promise<void>;
  onCreateMilestone?: (
    categoryId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<MilestoneItem[]>;
  onCreateTask?: (input: TaskFormSubmitInput) => void | Promise<void>;
  onDeleteCategoryTask?: (
    categoryId: string,
    taskId: string,
  ) => void | Promise<void>;
  onDeleteMilestone?: (
    categoryId: string,
    milestoneId: string,
  ) => void | Promise<void>;
  onDeleteStandaloneTask?: (taskId: string) => void | Promise<void>;
  onDeleteTask?: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
  ) => void | Promise<void>;
  onUpdateCategoryTask?: (
    categoryId: string,
    taskId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<void>;
  onUpdateMilestone?: (
    categoryId: string,
    milestoneId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<void>;
  onUpdateStandaloneTask?: (
    taskId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<void>;
  onUpdateTask?: (
    categoryId: string,
    milestoneId: string,
    taskId: string,
    input: CreateScheduleItemInput,
  ) => void | Promise<void>;
};

export const CalendarSidebarModals = ({
  categories,
  createDefaultCategoryId,
  editingCategoryTask,
  editingCategoryTaskTarget,
  editingMilestone,
  editingMilestoneTarget,
  editingStandaloneTask,
  editingStandaloneTaskId,
  editingTask,
  editingTaskTarget,
  isAddMenuOpen,
  isCategoryModalOpen,
  isMilestoneModalOpen,
  isTaskModalOpen,
  closeAddMenu,
  closeCategoryTaskEditor,
  closeCreateModal,
  closeMilestoneEditor,
  closeMilestoneTaskEditor,
  closeStandaloneTaskEditor,
  openCategoryModal,
  openMilestoneModal,
  openTaskModal,
  onCreateCategory,
  onCreateMilestone,
  onCreateTask,
  onDeleteCategoryTask,
  onDeleteMilestone,
  onDeleteStandaloneTask,
  onDeleteTask,
  onUpdateCategoryTask,
  onUpdateMilestone,
  onUpdateStandaloneTask,
  onUpdateTask,
}: CalendarSidebarModalsProps) => (
  <>
    <AddMenuModal
      isOpen={isAddMenuOpen}
      onClose={closeAddMenu}
      variant={createDefaultCategoryId ? "category" : "global"}
      onSelectCategory={openCategoryModal}
      onSelectMilestone={() => openMilestoneModal(createDefaultCategoryId)}
      onSelectTask={() => openTaskModal(createDefaultCategoryId)}
    />

    <CategoryFormModal
      isOpen={isCategoryModalOpen}
      mode="create"
      onSubmit={onCreateCategory}
      onClose={closeCreateModal}
    />

    <MilestoneFormModal
      isOpen={isMilestoneModalOpen}
      onClose={closeCreateModal}
      categories={categories}
      defaultCategoryId={createDefaultCategoryId}
      onSubmit={async (categoryId, input) => {
        await onCreateMilestone?.(categoryId, input);
      }}
    />

    <TaskFormModal
      isOpen={isTaskModalOpen}
      onClose={closeCreateModal}
      categories={categories}
      defaultCategoryId={createDefaultCategoryId}
      onSubmit={onCreateTask}
    />

    <TaskFormModal
      isOpen={Boolean(editingStandaloneTask)}
      onClose={closeStandaloneTaskEditor}
      categories={categories}
      task={editingStandaloneTask}
      mode="edit"
      onSubmit={async ({ categoryId, milestoneId, task }) => {
        if (!editingStandaloneTaskId) {
          return;
        }

        await onUpdateStandaloneTask?.(editingStandaloneTaskId, {
          ...task,
          categoryId: categoryId ?? undefined,
          milestoneId: milestoneId ?? undefined,
        });
        closeStandaloneTaskEditor();
      }}
      onRequestDelete={async () => {
        if (!editingStandaloneTaskId) {
          return;
        }

        await onDeleteStandaloneTask?.(editingStandaloneTaskId);
        closeStandaloneTaskEditor();
      }}
    />

    <MilestoneFormModal
      isOpen={Boolean(editingMilestone)}
      onClose={closeMilestoneEditor}
      categories={categories}
      mode="edit"
      milestone={editingMilestone}
      defaultCategoryId={editingMilestoneTarget?.categoryId ?? null}
      onSubmit={async (categoryId, input) => {
        if (!editingMilestoneTarget) {
          return;
        }

        await onUpdateMilestone?.(
          categoryId,
          editingMilestoneTarget.milestoneId,
          input,
        );
        closeMilestoneEditor();
      }}
      onRequestDelete={async () => {
        if (!editingMilestoneTarget) {
          return;
        }

        await onDeleteMilestone?.(
          editingMilestoneTarget.categoryId,
          editingMilestoneTarget.milestoneId,
        );
        closeMilestoneEditor();
      }}
    />

    <TaskFormModal
      isOpen={Boolean(editingCategoryTask)}
      onClose={closeCategoryTaskEditor}
      categories={categories}
      defaultCategoryId={editingCategoryTaskTarget?.categoryId ?? null}
      task={editingCategoryTask}
      mode="edit"
      onSubmit={async ({ categoryId, milestoneId, task }) => {
        if (!editingCategoryTaskTarget) {
          return;
        }

        await onUpdateCategoryTask?.(
          editingCategoryTaskTarget.categoryId,
          editingCategoryTaskTarget.taskId,
          {
            ...task,
            categoryId: categoryId ?? undefined,
            milestoneId: milestoneId ?? undefined,
          },
        );
        closeCategoryTaskEditor();
      }}
      onRequestDelete={async () => {
        if (!editingCategoryTaskTarget) {
          return;
        }

        await onDeleteCategoryTask?.(
          editingCategoryTaskTarget.categoryId,
          editingCategoryTaskTarget.taskId,
        );
        closeCategoryTaskEditor();
      }}
    />

    <TaskFormModal
      isOpen={Boolean(editingTask)}
      onClose={closeMilestoneTaskEditor}
      categories={categories}
      defaultCategoryId={editingTaskTarget?.categoryId ?? null}
      defaultMilestoneId={editingTaskTarget?.milestoneId ?? null}
      task={editingTask}
      mode="edit"
      onSubmit={async ({ categoryId, milestoneId, task }) => {
        if (!editingTaskTarget) {
          return;
        }

        await onUpdateTask?.(
          editingTaskTarget.categoryId,
          editingTaskTarget.milestoneId,
          editingTaskTarget.taskId,
          {
            ...task,
            categoryId: categoryId ?? undefined,
            milestoneId: milestoneId ?? undefined,
          },
        );
        closeMilestoneTaskEditor();
      }}
      onRequestDelete={async () => {
        if (!editingTaskTarget) {
          return;
        }

        await onDeleteTask?.(
          editingTaskTarget.categoryId,
          editingTaskTarget.milestoneId,
          editingTaskTarget.taskId,
        );
        closeMilestoneTaskEditor();
      }}
    />
  </>
);
