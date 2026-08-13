import { useState } from 'react';

import type { Category } from '@/types';

export const useCategoryDetailState = (category: Category) => {
  const [expandedMilestones, setExpandedMilestones] = useState<
    Record<string, boolean>
  >({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(
    null,
  );
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskMode, setTaskMode] = useState<'create' | 'edit'>('create');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingCategoryTaskId, setEditingCategoryTaskId] = useState<
    string | null
  >(null);
  const [selectedMilestoneForTask, setSelectedMilestoneForTask] = useState<
    string | null
  >(null);

  const editingCategoryTask =
    category.tasks?.find((task) => task.id === editingCategoryTaskId) ?? null;
  const editingMilestone =
    category.items.find((item) => item.id === editingMilestoneId) ?? null;
  const editingTask =
    category.items
      .find((item) => item.id === selectedMilestoneForTask)
      ?.tasks?.find((task) => task.id === editingTaskId) ?? null;

  const closeMilestoneTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTaskId(null);
    setSelectedMilestoneForTask(null);
    setTaskMode('create');
  };

  return {
    closeCategoryDeleteModal: () => setIsDeleteModalOpen(false),
    closeCategoryEditModal: () => setIsEditModalOpen(false),
    closeCategoryTaskEditor: () => setEditingCategoryTaskId(null),
    closeMilestoneEditor: () => setEditingMilestoneId(null),
    closeMilestoneTaskModal,
    editingCategoryTask,
    editingCategoryTaskId,
    editingMilestone,
    editingMilestoneId,
    editingTask,
    editingTaskId,
    expandedMilestones,
    isDeleteModalOpen,
    isEditModalOpen,
    isTaskModalOpen,
    openCategoryDeleteModal: () => setIsDeleteModalOpen(true),
    openCategoryEditModal: () => setIsEditModalOpen(true),
    openCategoryTaskEditor: (taskId: string) => setEditingCategoryTaskId(taskId),
    openMilestoneEditor: (milestoneId: string) =>
      setEditingMilestoneId(milestoneId),
    openMilestoneTaskCreator: (milestoneId: string) => {
      setTaskMode('create');
      setEditingTaskId(null);
      setSelectedMilestoneForTask(milestoneId);
      setIsTaskModalOpen(true);
    },
    openMilestoneTaskEditor: (milestoneId: string, taskId: string) => {
      setTaskMode('edit');
      setEditingTaskId(taskId);
      setSelectedMilestoneForTask(milestoneId);
      setIsTaskModalOpen(true);
    },
    selectedMilestoneForTask,
    taskMode,
    toggleMilestone: (milestoneId: string) => {
      setExpandedMilestones((previous) => ({
        ...previous,
        [milestoneId]: !previous[milestoneId],
      }));
    },
  };
};

export type CategoryDetailState = ReturnType<typeof useCategoryDetailState>;
