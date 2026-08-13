import { useEffect } from "react";

import type { ScheduleItem } from "@/types";
import type { useScheduleDatePicker } from "@/hooks/useScheduleDatePicker";
import { parseIsoScheduleDate } from "@/utils/scheduleDate";

type ScheduleDatePickerModel = ReturnType<typeof useScheduleDatePicker>;

type UseScheduleFormDateInitializerParams = {
  isOpen: boolean;
  task?: ScheduleItem | null;
  datePicker: ScheduleDatePickerModel;
};

export const useScheduleFormDateInitializer = ({
  isOpen,
  task,
  datePicker,
}: UseScheduleFormDateInitializerParams) => {
  const {
    reset,
    setCurrentYear,
    setCurrentMonth,
    setDateType,
    setDateRange,
    setSelectedDate,
    setMultiDates,
  } = datePicker;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset();

    if (!task) {
      return;
    }

    const startDate = parseIsoScheduleDate(task.start);
    const endDate = task.end ? parseIsoScheduleDate(task.end) : null;
    const multiDates =
      task.dates
        ?.map(parseIsoScheduleDate)
        .filter((date): date is Date => Boolean(date)) ?? [];

    if (!startDate && multiDates.length === 0) {
      return;
    }

    const initialVisibleDate = startDate ?? multiDates[0];
    setCurrentYear(initialVisibleDate.getFullYear());
    setCurrentMonth(initialVisibleDate.getMonth());

    if (multiDates.length > 0) {
      setDateType("다중");
      setMultiDates(multiDates);
      return;
    }

    if (startDate && endDate) {
      setDateType("기간");
      setDateRange({ start: startDate, end: endDate });
      return;
    }

    if (startDate) {
      setSelectedDate(startDate);
    }
  }, [
    isOpen,
    task,
    reset,
    setCurrentYear,
    setCurrentMonth,
    setDateType,
    setDateRange,
    setSelectedDate,
    setMultiDates,
  ]);
};
