import { SidebarScheduleCheckbox } from '@/features/calendar/components/sidebar/SidebarScheduleCheckbox';
import { getScheduleTextColorClass } from '@/features/calendar/utils/scheduleCompletionStyle';

import { getScheduleRows } from './milestoneAccordionUtils';
import type { SidebarScheduleRowProps } from './types';

export const SidebarScheduleRow = ({
  item,
  checked,
  onToggle,
  onEdit,
  barColor,
  widthClassName,
}: SidebarScheduleRowProps) => {
  const rows = getScheduleRows(item, checked);

  return (
    <>
      {rows.map((row) => (
        <div
          key={`${item.id}-${row.key}`}
          className={`${widthClassName} flex shrink-0 items-center gap-2 overflow-hidden rounded-token-s bg-fill-inverse py-2 pr-2 transition-colors hover:bg-fill-surface dark:bg-[#222222]`}
        >
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
            onClick={onEdit}
          >
            <div
              className="h-8 w-2 shrink-0 rounded"
              style={{ backgroundColor: barColor }}
            />
            <span
              className={`min-w-0 max-w-[190px] flex-1 truncate text-body-02-m ${getScheduleTextColorClass(
                row.checked,
              )}`}
            >
              {item.title}
            </span>
          </button>

          <div
            role="button"
            tabIndex={0}
            className="flex shrink-0 cursor-pointer items-center justify-end gap-3"
            onClick={() => onToggle(row.taskDateId)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onToggle(row.taskDateId);
              }
            }}
          >
            <span className="whitespace-nowrap text-body-02-m text-text-teritary">
              {row.dateLabel}
            </span>
            <SidebarScheduleCheckbox
              checked={row.checked}
              ariaLabel={`${item.title} 일정 완료`}
              onChange={() => onToggle(row.taskDateId)}
              stopPropagation
            />
          </div>
        </div>
      ))}
    </>
  );
};
