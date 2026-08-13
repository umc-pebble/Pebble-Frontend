import { type Category, type MilestoneItem, type ScheduleItem } from "@/types";

export const parseScheduleDate = (
  value: string,
  fallbackYear: number,
): Date | null => {
  const normalizedValue = value.trim();
  const isoMatch = normalizedValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const shortDateMatch = normalizedValue.match(/^(\d{1,2})\/(\d{1,2})$/);

  if (shortDateMatch) {
    const [, month, day] = shortDateMatch;
    return new Date(fallbackYear, Number(month) - 1, Number(day));
  }

  return null;
};

const getScheduleDateRange = (
  item: ScheduleItem,
  fallbackYear: number,
) => {
  if (item.dates && item.dates.length > 0) {
    const dates = item.dates
      .map((date) => parseScheduleDate(date, fallbackYear))
      .filter((date): date is Date => Boolean(date))
      .sort((a, b) => a.getTime() - b.getTime());

    if (dates.length === 0) {
      return null;
    }

    return {
      startDate: dates[0],
      endDate: dates[dates.length - 1],
    };
  }

  const startDate = parseScheduleDate(item.start, fallbackYear);
  const endDate = item.end ? parseScheduleDate(item.end, fallbackYear) : startDate;

  if (!startDate || !endDate) {
    return null;
  }

  return startDate.getTime() <= endDate.getTime()
    ? { startDate, endDate }
    : { startDate: endDate, endDate: startDate };
};

export const isScheduleItemInMonth = (
  item: ScheduleItem,
  year: number,
  month: number,
) => {
  if (item.dates && item.dates.length > 0) {
    return item.dates.some((date) => {
      const parsedDate = parseScheduleDate(date, year);

      return (
        parsedDate?.getFullYear() === year &&
        parsedDate.getMonth() + 1 === month
      );
    });
  }

  const dateRange = getScheduleDateRange(item, year);

  if (!dateRange) {
    return false;
  }

  const monthStartDate = new Date(year, month - 1, 1);
  const monthEndDate = new Date(year, month, 0);

  return (
    dateRange.startDate.getTime() <= monthEndDate.getTime() &&
    dateRange.endDate.getTime() >= monthStartDate.getTime()
  );
};

export const filterCategoriesByMonth = (
  categories: Category[],
  year: number,
  month: number,
): Category[] => {
  const filteredCategories: Array<
    Category & {
      hasAnySchedule: boolean;
      hasCurrentMonthSchedule: boolean;
    }
  > = categories.map((category) => {
      const hasAnyLoadedSchedule =
        category.items.length > 0 || (category.tasks?.length ?? 0) > 0;
      const hasAnyCountedSchedule =
        (category.milestoneCount ?? 0) > 0 ||
        (category.taskCount ?? 0) > 0 ||
        (category.sharedTaskCount ?? 0) > 0;
      const hasAnySchedule =
        Boolean(category.hasSchedules) ||
        hasAnyLoadedSchedule ||
        hasAnyCountedSchedule;
      const tasks = category.tasks?.filter((task) =>
        isScheduleItemInMonth(task, year, month),
      );
      const items = category.items
        .map((item): MilestoneItem | null => {
          const filteredTasks = item.tasks?.filter((task) =>
            isScheduleItemInMonth(task, year, month),
          );
          const shouldKeepMilestone = isScheduleItemInMonth(item, year, month);

          if (
            !shouldKeepMilestone &&
            (!filteredTasks || filteredTasks.length === 0)
          ) {
            return null;
          }

          return {
            ...item,
            tasks: filteredTasks,
          };
        })
        .filter((item): item is MilestoneItem => Boolean(item));
      const hasCurrentMonthSchedule =
        items.length > 0 || (tasks?.length ?? 0) > 0;

      return {
        ...category,
        tasks,
        items,
        hasAnySchedule,
        hasCurrentMonthSchedule,
      };
    });

  return filteredCategories
    .filter(
      (category) =>
        !category.hasAnySchedule || category.hasCurrentMonthSchedule,
    )
    .map((category) => {
      const {
        hasAnySchedule: _hasAnySchedule,
        hasCurrentMonthSchedule: _hasCurrentMonthSchedule,
        ...visibleCategory
      } = category;

      return visibleCategory;
    });
};
