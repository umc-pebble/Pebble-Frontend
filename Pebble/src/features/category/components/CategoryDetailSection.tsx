import React from "react";
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import { CategoryFormModal } from "./CategoryFormModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";
import { CategoryDetailHeader } from "./CategoryDetailHeader";
import { MilestoneDetailItem } from "@/features/milestone/components/MilestoneDetailItem";
import { MilestoneFormModal } from "@/features/milestone/components/MilestoneFormModal";
import { TaskDetailRow } from "@/features/task/components/TaskDetailRow";
import {
  TaskFormModal,
  type TaskFormSubmitInput,
} from "@/features/task/components/TaskFormModal";
import { type Category } from "@/types";
import type {
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";
import { getReadableCategoryTextColor } from "@/utils/categoryColorTheme";

export const CategoryDetailSection = ({
  isSidebarOpen,
  category,
  onBack,
  categories,
  onUpdateCategory,
  onCreateTask,
  onUpdateCategoryTask,
  onDeleteCategoryTask,
  onDeleteCategory,
  onUpdateMilestone,
  onDeleteMilestone,
  onUpdateTask,
  onDeleteTask,
}: {
  isSidebarOpen: boolean;
  category: Category;
  onBack: () => void;
  categories: Category[];
  onUpdateCategory: (
    categoryId: string,
    input: UpdateCategoryInput,
  ) => Promise<void>;
  onCreateTask: (input: TaskFormSubmitInput) => Promise<void>;
  onUpdateCategoryTask: (
    categoryId: string,
    taskId: string,
    input: CreateScheduleItemInput,
  ) => Promise<void>;
  onDeleteCategoryTask: (categoryId: string, taskId: string) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
  onUpdateMilestone: (
    categoryId: string,
    milestoneId: string,
    input: CreateScheduleItemInput,
  ) => Promise<void>;
  onDeleteMilestone: (categoryId: string, milestoneId: string) => Promise<void>;
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
}) => {
  const [expandedMilestones, setExpandedMilestones] = React.useState<Record<string, boolean>>({});
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = React.useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [taskMode, setTaskMode] = React.useState<"create" | "edit">("create");
  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null);
  const [editingCategoryTaskId, setEditingCategoryTaskId] = React.useState<string | null>(null);
  const [selectedMilestoneForTask, setSelectedMilestoneForTask] = React.useState<string | null>(null);
  const editingCategoryTask =
    category.tasks?.find((task) => task.id === editingCategoryTaskId) ?? null;
  const editingMilestone =
    category.items.find((item) => item.id === editingMilestoneId) ?? null;
  const editingTask =
    category.items
      .find((item) => item.id === selectedMilestoneForTask)
      ?.tasks?.find((task) => task.id === editingTaskId) ?? null;
  const milestoneTextColor =
    category.themeTextOnMid ??
    getReadableCategoryTextColor(category.themeBase, category.themeMid);
  const taskTextColor =
    category.themeTextOnLight ??
    getReadableCategoryTextColor(category.themeBase, category.themeLight);

  const toggleMilestone = (id: string) => {
    setExpandedMilestones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      className={`relative h-[1000px] overflow-hidden rounded-[20px] bg-fill-inverse shadow-shadow-m transition-all duration-300 ${
        isSidebarOpen ? "w-[898px]" : "w-[1290px]"
      }`}
    >
      {/* 캘린더 돌아가기 버튼 */}
      <button
        onClick={onBack}
        className="absolute left-[20px] top-[36px] flex items-center gap-2 hover:opacity-80 transition-opacity"
        aria-label="캘린더로 돌아가기"
      >
        <div className="w-11 h-11 flex items-center justify-center rounded-xl relative">
          <ChevronLeftIcon className="w-6 h-6 text-text-strong" />
        </div>
        <span className="text-[24px] font-medium leading-8 text-text-strong">
          캘린더
        </span>
      </button>

      <CategoryDetailHeader 
        category={category} 
        onEdit={() => setIsEditModalOpen(true)} 
      />

      {/* 마일스톤 목록 섹션 */}
      <div className="absolute left-[72px] top-[392px] flex items-end gap-2">
        <h2 className="text-title-02-sb text-text-strong">마일스톤</h2>
        <span className="text-[20px] font-medium leading-6 text-text-teritary">
          {category.items.length}
        </span>
      </div>

      <div className="absolute left-[72px] top-[443px] flex flex-col gap-5 w-[780px]">
        {category.tasks && category.tasks.length > 0 && (
          <div className="w-full bg-fill-inverse rounded-[20px] shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)] flex flex-col gap-2 p-5">
            <div className="flex items-end gap-2">
              <h3 className="text-title-03-sb text-text-strong">태스크</h3>
              <span className="text-body-02-m text-text-teritary">
                {category.tasks.length}
              </span>
            </div>
            <div className="flex flex-col items-end gap-2">
              {category.tasks.map((task) => (
                <TaskDetailRow
                  key={task.id}
                  task={task}
                  themeLightColor={category.themeLight}
                  themeTextColor={taskTextColor}
                  onEdit={() => setEditingCategoryTaskId(task.id)}
                />
              ))}
            </div>
          </div>
        )}

        {category.items.map((item) => (
          <MilestoneDetailItem
            key={item.id}
            item={item}
            themeMidColor={category.themeMid}
            themeLightColor={category.themeLight}
            themeTextOnMidColor={milestoneTextColor}
            themeTextOnLightColor={taskTextColor}
            isExpanded={Boolean(expandedMilestones[item.id])}
            onToggle={() => toggleMilestone(item.id)}
            onEdit={() => setEditingMilestoneId(item.id)}
            onAddTask={() => {
              setTaskMode("create");
              setSelectedMilestoneForTask(item.id);
              setIsTaskModalOpen(true);
            }}
            onEditTask={(taskId) => {
              setTaskMode("edit");
              setEditingTaskId(taskId);
              setSelectedMilestoneForTask(item.id);
              setIsTaskModalOpen(true);
            }}
          />
        ))}
      </div>

      <CategoryFormModal 
        isOpen={isEditModalOpen} 
        mode="edit"
        category={category}
        onSubmit={async (input) => {
          await onUpdateCategory(category.id, input);
        }}
        onClose={() => setIsEditModalOpen(false)} 
        onRequestDelete={() => {
          setIsEditModalOpen(false);
          setIsDeleteModalOpen(true);
        }}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        category={category}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={async () => {
          await onDeleteCategory(category.id);
          setIsDeleteModalOpen(false);
        }}
      />

      <MilestoneFormModal 
        isOpen={!!editingMilestoneId}
        onClose={() => setEditingMilestoneId(null)}
        categories={categories}
        mode="edit"
        milestone={editingMilestone}
        defaultCategoryId={category.id}
        onSubmit={async (categoryId, input) => {
          if (!editingMilestoneId) {
            return;
          }

          await onUpdateMilestone(categoryId, editingMilestoneId, input);
          setEditingMilestoneId(null);
        }}
        onRequestDelete={async () => {
          if (editingMilestoneId) {
            await onDeleteMilestone(category.id, editingMilestoneId);
          }
          setEditingMilestoneId(null);
        }}
      />

      <TaskFormModal 
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTaskId(null);
        }}
        categories={categories}
        defaultCategoryId={category.id}
        defaultMilestoneId={selectedMilestoneForTask}
        task={editingTask}
        mode={taskMode}
        onSubmit={async (input) => {
          if (
            taskMode === "edit" &&
            selectedMilestoneForTask &&
            editingTaskId
          ) {
            await onUpdateTask(
              category.id,
              selectedMilestoneForTask,
              editingTaskId,
              input.task,
            );
            return;
          }

          await onCreateTask(input);
        }}
        onRequestDelete={async () => {
          if (selectedMilestoneForTask && editingTaskId) {
            await onDeleteTask(category.id, selectedMilestoneForTask, editingTaskId);
          }
          setIsTaskModalOpen(false);
          setEditingTaskId(null);
        }}
      />

      <TaskFormModal
        isOpen={Boolean(editingCategoryTask)}
        onClose={() => setEditingCategoryTaskId(null)}
        categories={categories}
        defaultCategoryId={category.id}
        task={editingCategoryTask}
        mode="edit"
        onSubmit={async ({ task }) => {
          if (!editingCategoryTaskId) {
            return;
          }

          await onUpdateCategoryTask(category.id, editingCategoryTaskId, task);
          setEditingCategoryTaskId(null);
        }}
        onRequestDelete={async () => {
          if (!editingCategoryTaskId) {
            return;
          }

          await onDeleteCategoryTask(category.id, editingCategoryTaskId);
          setEditingCategoryTaskId(null);
        }}
      />
    </section>
  );
};
