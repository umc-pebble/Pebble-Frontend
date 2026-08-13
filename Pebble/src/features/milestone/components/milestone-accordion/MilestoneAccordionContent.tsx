import { AddButton } from '@/components/ui/AddButton';
import { isTaskCompleted } from '@/features/task/utils/taskCompletion';

import {
  SCHEDULE_LEVEL_CLASS,
  sortScheduleItemsByDate,
} from './milestoneAccordionUtils';
import { SidebarScheduleRow } from './SidebarScheduleRow';
import type { MilestoneAccordionProps } from './types';

type MilestoneAccordionContentProps = Pick<
  MilestoneAccordionProps,
  | 'category'
  | 'onAddSchedule'
  | 'onEditCategoryTask'
  | 'onEditMilestone'
  | 'onEditTask'
  | 'onToggleCategoryTaskCompleted'
  | 'onToggleMilestoneCompleted'
  | 'onToggleTaskCompleted'
>;

export const MilestoneAccordionContent = ({
  category,
  onAddSchedule,
  onEditCategoryTask,
  onEditMilestone,
  onEditTask,
  onToggleCategoryTaskCompleted,
  onToggleMilestoneCompleted,
  onToggleTaskCompleted,
}: MilestoneAccordionContentProps) => (
  <div className="flex w-full flex-col items-center">
    <div className="custom-scrollbar flex max-h-[216px] w-full flex-col items-end justify-start gap-2 overflow-y-auto pl-5 pr-3">
      {sortScheduleItemsByDate(category.items).map((item) => (
        <div key={item.id} className="flex w-full flex-col items-end gap-2">
          <div className={SCHEDULE_LEVEL_CLASS.child}>
            <SidebarScheduleRow
              item={item}
              checked={Boolean(item.isCompleted)}
              onToggle={() =>
                onToggleMilestoneCompleted?.(category.id, item.id)
              }
              onEdit={() => onEditMilestone?.(category.id, item.id)}
              barColor={category.themeMid}
              widthClassName="w-full"
            />
          </div>

          {item.tasks?.length ? (
            <div className="flex w-full flex-col items-end gap-2">
              {sortScheduleItemsByDate(item.tasks).map((task) => (
                <div key={task.id} className={SCHEDULE_LEVEL_CLASS.grandchild}>
                  <SidebarScheduleRow
                    item={task}
                    checked={isTaskCompleted(task)}
                    onToggle={(taskDateId) =>
                      onToggleTaskCompleted?.(
                        category.id,
                        item.id,
                        task.id,
                        taskDateId,
                      )
                    }
                    onEdit={() =>
                      onEditTask?.(category.id, item.id, task.id)
                    }
                    barColor={category.themeLight}
                    widthClassName="w-full"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}

      {sortScheduleItemsByDate(category.tasks ?? []).map((task) => (
        <div key={task.id} className={SCHEDULE_LEVEL_CLASS.child}>
          <SidebarScheduleRow
            item={task}
            checked={isTaskCompleted(task)}
            onToggle={(taskDateId) =>
              onToggleCategoryTaskCompleted?.(
                category.id,
                task.id,
                taskDateId,
              )
            }
            onEdit={() => onEditCategoryTask?.(category.id, task.id)}
            barColor={category.themeLight}
            widthClassName="w-full"
          />
        </div>
      ))}
    </div>

    {onAddSchedule ? (
      <div className="flex w-full flex-col items-start px-5 py-3">
        <AddButton
          label="일정 추가하기"
          variant="secondary"
          className="w-[312px]"
          onClick={() => onAddSchedule(category.id)}
        />
      </div>
    ) : null}
  </div>
);
