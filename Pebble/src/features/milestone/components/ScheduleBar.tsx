import CheckIcon from "@/assets/icons/Check.svg?react";

import { type CalendarEvent } from "./types";

type ScheduleBarProps = {
  event: CalendarEvent;
};

export const ScheduleBar = ({ event }: ScheduleBarProps) => {
  const hoverOverlayClass =
    event.variant === "milestone"
      ? "group-hover:bg-[rgba(23,23,23,0.1)]"
      : "group-hover:bg-[rgba(23,23,23,0.05)]";

  return (
    <div
      className="group pointer-events-auto absolute z-10 h-[29px]"
      style={{
        left: `calc(${event.leftPercent}% + 4px)`,
        top: event.topOffset,
        width: `calc(${event.widthPercent}% - 8px)`,
      }}
      title={event.title}
    >
      <div
        className="relative z-10 flex h-full w-full items-center gap-[10px] overflow-hidden rounded-[4px] px-3 py-1 shadow-none transition-[width,box-shadow] duration-150 group-hover:w-max group-hover:min-w-full group-hover:shadow-shadow-s"
        style={{ backgroundColor: event.backgroundColor }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-1 group-hover:min-w-max">
          {event.isCompleted && (
            <CheckIcon
              className="size-4 shrink-0"
              style={{ color: event.textColor }}
              aria-hidden="true"
            />
          )}
          <span
            className="min-w-0 flex-1 truncate text-body-04-m group-hover:min-w-max group-hover:overflow-visible group-hover:whitespace-nowrap"
            style={{ color: event.textColor }}
          >
            {event.title}
          </span>
        </div>
        <div
          className="absolute bottom-[3px] left-0 top-[3px] w-1 rounded-[4px]"
          style={{ backgroundColor: event.accentColor }}
        />
        <div
          className={`pointer-events-none absolute inset-0 transition-colors ${hoverOverlayClass}`}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
