import { useMemo, useState } from "react";

import type { TaskItem } from "@/types";

type CreateModalType = "category" | "milestone" | "task";

type UseCalendarSidebarModalsParams = {
  standaloneTasks: TaskItem[];
};

export const useCalendarSidebarModals = ({
  standaloneTasks,
}: UseCalendarSidebarModalsParams) => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [createModalType, setCreateModalType] =
    useState<CreateModalType | null>(null);
  const [createDefaultCategoryId, setCreateDefaultCategoryId] = useState<
    string | null
  >(null);
  const [editingStandaloneTaskId, setEditingStandaloneTaskId] = useState<
    string | null
  >(null);

  const editingStandaloneTask = useMemo(
    () =>
      standaloneTasks.find((task) => task.id === editingStandaloneTaskId) ??
      null,
    [standaloneTasks, editingStandaloneTaskId],
  );

  const closeCreateModal = () => {
    setCreateModalType(null);
    setCreateDefaultCategoryId(null);
  };

  const closeStandaloneTaskEditor = () => {
    setEditingStandaloneTaskId(null);
  };

  return {
    isAddMenuOpen,
    openAddMenu: (categoryId: string | null = null) => {
      setCreateDefaultCategoryId(categoryId);
      setIsAddMenuOpen(true);
    },
    closeAddMenu: () => setIsAddMenuOpen(false),
    createDefaultCategoryId,
    isCategoryModalOpen: createModalType === "category",
    isMilestoneModalOpen: createModalType === "milestone",
    isTaskModalOpen: createModalType === "task",
    openCategoryModal: () => {
      setCreateDefaultCategoryId(null);
      setCreateModalType("category");
    },
    openMilestoneModal: (categoryId: string | null = null) => {
      setCreateDefaultCategoryId(categoryId);
      setCreateModalType("milestone");
    },
    openTaskModal: (categoryId: string | null = null) => {
      setCreateDefaultCategoryId(categoryId);
      setCreateModalType("task");
    },
    closeCreateModal,
    editingStandaloneTaskId,
    editingStandaloneTask,
    openStandaloneTaskEditor: setEditingStandaloneTaskId,
    closeStandaloneTaskEditor,
  };
};
