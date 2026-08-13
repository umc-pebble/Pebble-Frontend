import type { Category } from '@/types';

import { MilestoneDetailItem } from '@/features/milestone/components/MilestoneDetailItem';
import { TaskDetailRow } from '@/features/task/components/TaskDetailRow';

type CategoryDetailScheduleListProps = {
  category: Category;
  expandedMilestones: Record<string, boolean>;
  onEditCategoryTask: (taskId: string) => void;
  onEditMilestone: (milestoneId: string) => void;
  onAddMilestoneTask: (milestoneId: string) => void;
  onEditMilestoneTask: (milestoneId: string, taskId: string) => void;
  onToggleMilestone: (milestoneId: string) => void;
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

export const CategoryDetailScheduleList = ({
  category,
  expandedMilestones,
  onEditCategoryTask,
  onEditMilestone,
  onAddMilestoneTask,
  onEditMilestoneTask,
  onToggleMilestone,
  onToggleMilestoneCompleted,
  onToggleCategoryTaskCompleted,
  onToggleTaskCompleted,
}: CategoryDetailScheduleListProps) => (
  <div className="absolute left-[72px] top-[443px] flex w-[780px] flex-col gap-5 max-xl:static max-xl:mt-4 max-xl:w-full">
    {category.tasks && category.tasks.length > 0 ? (
      <div className="flex w-full flex-col gap-2 rounded-[20px] bg-fill-inverse p-5 shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)]">
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
              onToggleCompleted={(taskDateId) =>
                onToggleCategoryTaskCompleted(
                  category.id,
                  task.id,
                  taskDateId,
                )
              }
              onEdit={() => onEditCategoryTask(task.id)}
            />
          ))}
        </div>
      </div>
    ) : null}

    {category.items.map((item) => (
      <MilestoneDetailItem
        key={item.id}
        item={item}
        themeMidColor={category.themeMid}
        themeLightColor={category.themeLight}
        isExpanded={Boolean(expandedMilestones[item.id])}
        onToggle={() => onToggleMilestone(item.id)}
        onToggleCompleted={() =>
          onToggleMilestoneCompleted(category.id, item.id)
        }
        onEdit={() => onEditMilestone(item.id)}
        onAddTask={() => onAddMilestoneTask(item.id)}
        onEditTask={(taskId) => onEditMilestoneTask(item.id, taskId)}
        onToggleTaskCompleted={(taskId) =>
          onToggleTaskCompleted(category.id, item.id, taskId)
        }
      />
    ))}
  </div>
);
