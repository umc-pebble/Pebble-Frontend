import { useCallback, useState } from "react";

export type DateType = "하루" | "기간" | "다중";

export type DayStatus = "selected" | "range-start" | "range-end" | "in-range" | "today" | "none";

export const useScheduleDatePicker = () => {
  const today = new Date();
  const [dateType, setDateType] = useState<DateType>("하루");
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [multiDates, setMultiDates] = useState<Date[]>([]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
      return;
    }

    setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
      return;
    }

    setCurrentMonth(currentMonth + 1);
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);

    if (dateType === "하루") {
      setSelectedDate(clickedDate);
      return;
    }

    if (dateType === "다중") {
      setMultiDates((prev) => {
        const exists = prev.some((date) => date.getTime() === clickedDate.getTime());
        return exists
          ? prev.filter((date) => date.getTime() !== clickedDate.getTime())
          : [...prev, clickedDate];
      });
      return;
    }

    setDateRange((prev) => {
      if (!prev.start || prev.end) {
        return { start: clickedDate, end: null };
      }

      if (clickedDate.getTime() < prev.start.getTime()) {
        return { start: clickedDate, end: prev.start };
      }

      return { start: prev.start, end: clickedDate };
    });
  };

  const getDayStatus = (day: number): DayStatus => {
    const dayTime = new Date(currentYear, currentMonth, day).getTime();

    if (dateType === "하루" && selectedDate?.getTime() === dayTime) {
      return "selected";
    }

    if (dateType === "다중" && multiDates.some((date) => date.getTime() === dayTime)) {
      return "selected";
    }

    if (dateType === "기간") {
      if (dateRange.start && dateRange.end) {
        const start = dateRange.start.getTime();
        const end = dateRange.end.getTime();

        if (dayTime === start && dayTime === end) return "selected";
        if (dayTime === start) return "range-start";
        if (dayTime === end) return "range-end";
        if (dayTime > start && dayTime < end) return "in-range";
      }

      if (dateRange.start?.getTime() === dayTime) {
        return "selected";
      }
    }

    const isToday =
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear;

    return isToday ? "today" : "none";
  };

  const reset = useCallback(() => {
    const nextToday = new Date();

    setDateType("하루");
    setCurrentYear(nextToday.getFullYear());
    setCurrentMonth(nextToday.getMonth());
    setSelectedDate(nextToday);
    setDateRange({ start: null, end: null });
    setMultiDates([]);
  }, []);

  const isDateSelectionComplete =
    (dateType === "하루" && Boolean(selectedDate)) ||
    (dateType === "기간" && Boolean(dateRange.start && dateRange.end)) ||
    (dateType === "다중" && multiDates.length > 0);

  return {
    dateType,
    setDateType,
    currentYear,
    setCurrentYear,
    currentMonth,
    setCurrentMonth,
    daysInMonth,
    firstDay,
    handlePrevMonth,
    handleNextMonth,
    handleDateClick,
    getDayStatus,
    reset,
    isDateSelectionComplete,
    selectedDate,
    setSelectedDate,
    dateRange,
    setDateRange,
    multiDates,
    setMultiDates,
  };
};
