import { type CalendarDay } from "./types";
import type { MouseEvent } from "react";

type DateCellProps = {
  day: CalendarDay;
  columnIndex: number;
  isSelected: boolean;
  isToday: boolean;
  onSelect?: (event: MouseEvent<HTMLDivElement>) => void;
};

const getDayTextClass = (
  columnIndex: number,
  monthOffset: CalendarDay["monthOffset"],
  isSelected: boolean,
  isToday: boolean,
) => {
  if (isSelected) {
    return "text-text-onFill";
  }

  if (isToday) {
    return "text-text-onFill";
  }

  if (monthOffset === -1 || monthOffset === 1) {
    if (columnIndex === 0) return "text-text-sunday";
    if (columnIndex === 6) return "text-text-saturday";
    return "text-text-teritary";
  }

  if (columnIndex === 0) return "text-fill-danger";
  if (columnIndex === 6) return "text-fill-info";
  return "text-text-strong";
};

export const DateCell = ({
  day,
  columnIndex,
  isSelected,
  isToday,
  onSelect,
}: DateCellProps) => {
  const shouldHighlightDate = isSelected || isToday;

  return (
    <div
      className="relative flex-1 grow self-stretch cursor-pointer"
      role="gridcell"
      aria-selected={isSelected}
      onClick={onSelect}
    >
      {shouldHighlightDate ? (
        <div
          className={`absolute left-1/2 top-1.5 flex h-8 w-8 -translate-x-1/2 flex-col items-center justify-center rounded-[16px] ${
            isSelected ? "bg-fill-primary" : "bg-fill-secondary"
          }`}
        >
          <span className="text-body-01-sb text-text-onFill">
            {day.day}
          </span>
        </div>
      ) : (
        <div
          className={`absolute left-1/2 top-2 -translate-x-1/2 text-body-01-sb ${getDayTextClass(
            columnIndex,
            day.monthOffset,
            false,
            false,
          )}`}
        >
          {day.day}
        </div>
      )}
    </div>
  );
};
