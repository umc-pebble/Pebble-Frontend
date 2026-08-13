import { type Category, type ScheduleItem, type TaskItem } from "@/types";
import { getReadableCategoryTextColor } from "@/utils/categoryColorTheme";
import { type CalendarDay, type CalendarEvent, type CalendarWeek } from "./types";
import { parseScheduleDate } from "./scheduleDateUtils";

const DAY_COUNT_IN_WEEK = 7;
export const EVENT_START_TOP_OFFSET = 43;
export const EVENT_ROW_HEIGHT = 33;

type DatedScheduleItem = {
  item: ScheduleItem;
  category?: Category;
  variant: "milestone" | "task" | "standaloneTask";
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
};

const isTaskScheduleItem = (item: ScheduleItem): item is TaskItem =>
  item.itemType === "task" || "taskDates" in item;

const isSameScheduleDate = (
  firstDate: Date,
  secondDateValue: string,
  fallbackYear: number,
) => {
  const secondDate = parseScheduleDate(secondDateValue, fallbackYear);

  return Boolean(secondDate) && firstDate.toDateString() === secondDate.toDateString();
};

const getScheduleItemCompleted = (
  item: ScheduleItem,
  date: Date,
  fallbackYear: number,
) => {
  if (isTaskScheduleItem(item) && item.dateType === "MULTIPLE" && item.taskDates?.length) {
    const matchedTaskDate = item.taskDates.find((taskDate) =>
      isSameScheduleDate(date, taskDate.date, fallbackYear),
    );

    return Boolean(matchedTaskDate?.isCompleted);
  }

  return Boolean(item.isCompleted);
};

const normalizeScheduleItem = (
  item: ScheduleItem,
  category: Category | undefined,
  variant: DatedScheduleItem["variant"],
  fallbackYear: number,
): DatedScheduleItem[] => {
  if (item.dates && item.dates.length > 0) {
    return item.dates
      .map((date) => parseScheduleDate(date, fallbackYear))
      .filter((date): date is Date => Boolean(date))
      .map((date) => ({
        item,
        category,
        variant,
        startDate: date,
        endDate: date,
        isCompleted: getScheduleItemCompleted(item, date, fallbackYear),
      }));
  }

  const startDate = parseScheduleDate(item.start, fallbackYear);
  const endDate = item.end ? parseScheduleDate(item.end, fallbackYear) : startDate;

  if (!startDate || !endDate) {
    return [];
  }

  return [
    {
      item,
      category,
      variant,
      startDate: startDate.getTime() <= endDate.getTime() ? startDate : endDate,
      endDate: startDate.getTime() <= endDate.getTime() ? endDate : startDate,
      isCompleted: getScheduleItemCompleted(item, startDate, fallbackYear),
    },
  ];
};

const collectScheduleItems = (
  categories: Category[],
  standaloneTasks: TaskItem[],
  fallbackYear: number,
): DatedScheduleItem[] => {
  const categoryItems = categories.flatMap((category) =>
    [
      ...(category.tasks ?? []).map((task) =>
        normalizeScheduleItem(task, category, "task", fallbackYear),
      ),
      ...category.items.flatMap((item) => {
        const milestones = normalizeScheduleItem(
          item,
          category,
          "milestone",
          fallbackYear,
        );
        const tasks = (item.tasks ?? []).flatMap((task) =>
          normalizeScheduleItem(task, category, "task", fallbackYear),
        );

        return [...milestones, ...tasks];
      }),
    ].flat(),
  );
  const rootTasks = standaloneTasks.flatMap((task) =>
    normalizeScheduleItem(task, undefined, "standaloneTask", fallbackYear),
  );

  return [...categoryItems, ...rootTasks];
};

const createCalendarEvent = (
  datedItem: DatedScheduleItem,
  weekStartDate: Date,
  weekEndDate: Date,
  laneIndex: number,
): CalendarEvent | null => {
  const eventStartDate =
    datedItem.startDate.getTime() > weekStartDate.getTime()
      ? datedItem.startDate
      : weekStartDate;
  const eventEndDate =
    datedItem.endDate.getTime() < weekEndDate.getTime()
      ? datedItem.endDate
      : weekEndDate;

  if (eventStartDate.getTime() > eventEndDate.getTime()) {
    return null;
  }

  const startColumn = eventStartDate.getDay();
  const endColumn = eventEndDate.getDay();
  const columnSpan = endColumn - startColumn + 1;
  const backgroundColor =
    datedItem.variant === "milestone"
      ? datedItem.category?.themeMid ?? "#E9EAEB"
      : datedItem.category?.themeLight ?? "#F4F4F5";
  const accentColor =
    datedItem.category?.themeBase ?? datedItem.item.accent ?? "#171717";
  const textColor =
    datedItem.variant === "milestone"
      ? datedItem.category?.themeTextOnMid ??
        getReadableCategoryTextColor(accentColor, backgroundColor)
      : datedItem.category?.themeTextOnLight ??
        getReadableCategoryTextColor(accentColor, backgroundColor);

  return {
    id: [
      datedItem.variant,
      datedItem.item.id,
      datedItem.startDate.toISOString(),
      weekStartDate.toISOString(),
    ].join("-"),
    title: datedItem.item.title,
    leftPercent: (startColumn / DAY_COUNT_IN_WEEK) * 100,
    widthPercent: (columnSpan / DAY_COUNT_IN_WEEK) * 100,
    topOffset: EVENT_START_TOP_OFFSET + laneIndex * EVENT_ROW_HEIGHT,
    backgroundColor,
    accentColor,
    textColor,
    isCompleted: datedItem.isCompleted,
    variant: datedItem.variant,
  };
};

const getVisibleDayRangeInWeek = (
  scheduleItem: DatedScheduleItem,
  weekStartDate: Date,
  weekEndDate: Date,
) => {
  const eventStartDate =
    scheduleItem.startDate.getTime() > weekStartDate.getTime()
      ? scheduleItem.startDate
      : weekStartDate;
  const eventEndDate =
    scheduleItem.endDate.getTime() < weekEndDate.getTime()
      ? scheduleItem.endDate
      : weekEndDate;

  return {
    startColumn: eventStartDate.getDay(),
    endColumn: eventEndDate.getDay(),
  };
};

const isRangeScheduleItem = (scheduleItem: DatedScheduleItem) =>
  scheduleItem.item.dateType === "RANGE" ||
  scheduleItem.startDate.toDateString() !== scheduleItem.endDate.toDateString();

const rangesOverlap = (
  firstRange: { startColumn: number; endColumn: number },
  secondRange: { startColumn: number; endColumn: number },
) =>
  firstRange.startColumn <= secondRange.endColumn &&
  secondRange.startColumn <= firstRange.endColumn;

const getAvailableLaneIndex = (
  occupiedLanes: { startColumn: number; endColumn: number }[][],
  range: { startColumn: number; endColumn: number },
) => {
  const availableLaneIndex = occupiedLanes.findIndex((lane) =>
    lane.every((occupiedRange) => !rangesOverlap(occupiedRange, range)),
  );

  if (availableLaneIndex !== -1) {
    return availableLaneIndex;
  }

  occupiedLanes.push([]);
  return occupiedLanes.length - 1;
};

export const generateWeeks = (
  year: number,
  month: number,
  categories: Category[],
  standaloneTasks: TaskItem[] = [],
): CalendarWeek[] => {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
  const scheduleItems = collectScheduleItems(categories, standaloneTasks, year);

  const weeks: CalendarWeek[] = [];
  let currentDay = 1;
  let nextMonthDay = 1;

  for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
    const days: CalendarDay[] = [];

    for (let dayOfWeek = 0; dayOfWeek < DAY_COUNT_IN_WEEK; dayOfWeek++) {
      if (weekIndex === 0 && dayOfWeek < startDayOfWeek) {
        days.push({
          day: daysInPrevMonth - startDayOfWeek + dayOfWeek + 1,
          monthOffset: -1,
        });
      } else if (currentDay <= daysInMonth) {
        days.push({
          day: currentDay,
          monthOffset: 0,
        });
        currentDay++;
      } else {
        days.push({
          day: nextMonthDay,
          monthOffset: 1,
        });
        nextMonthDay++;
      }
    }

    const firstVisibleDay = days[0];
    const lastVisibleDay = days[days.length - 1];
    const weekStartDate = new Date(
      year,
      month - 1 + firstVisibleDay.monthOffset,
      firstVisibleDay.day,
    );
    const weekEndDate = new Date(
      year,
      month - 1 + lastVisibleDay.monthOffset,
      lastVisibleDay.day,
    );
    const occupiedLanes: { startColumn: number; endColumn: number }[][] = [];
    const visibleScheduleItems = scheduleItems
      .filter(
        (scheduleItem) =>
          scheduleItem.startDate.getTime() <= weekEndDate.getTime() &&
          scheduleItem.endDate.getTime() >= weekStartDate.getTime(),
      )
      .sort((a, b) => {
        const rangePriorityDiff =
          Number(isRangeScheduleItem(b)) - Number(isRangeScheduleItem(a));

        if (rangePriorityDiff !== 0) {
          return rangePriorityDiff;
        }

        const aRange = getVisibleDayRangeInWeek(a, weekStartDate, weekEndDate);
        const bRange = getVisibleDayRangeInWeek(b, weekStartDate, weekEndDate);
        const startColumnDiff = aRange.startColumn - bRange.startColumn;

        if (startColumnDiff !== 0) {
          return startColumnDiff;
        }

        return bRange.endColumn - bRange.startColumn - (aRange.endColumn - aRange.startColumn);
      });

    const events = visibleScheduleItems
      .map((scheduleItem) => {
        const range = getVisibleDayRangeInWeek(
          scheduleItem,
          weekStartDate,
          weekEndDate,
        );
        const laneIndex = getAvailableLaneIndex(occupiedLanes, range);

        occupiedLanes[laneIndex].push(range);

        return createCalendarEvent(
          scheduleItem,
          weekStartDate,
          weekEndDate,
          laneIndex,
        );
      })
      .filter((event): event is CalendarEvent => Boolean(event));

    weeks.push({ days, events });

    if (currentDay > daysInMonth) {
      break;
    }
  }

  return weeks;
};
