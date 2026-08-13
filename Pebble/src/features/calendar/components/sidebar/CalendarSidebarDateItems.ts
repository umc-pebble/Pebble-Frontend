import type { Category, ScheduleItem, TaskItem } from "@/types";
import { parseScheduleDate } from "@/features/milestone/components/scheduleDateUtils";

type CalendarSidebarDateItemsParams = {
  categories: Category[];
  standaloneTasks: TaskItem[];
  currentYear: number;
  currentMonth: number;
};

export type DatedSidebarItem = {
  item: ScheduleItem;
  date: Date;
  barColor: string;
  isCompleted?: boolean;
} & (
  | { type: "standaloneTask"; taskId: string; taskDateId?: number }
  | {
      type: "categoryTask";
      categoryId: string;
      taskId: string;
      taskDateId?: number;
    }
  | { type: "milestone"; categoryId: string; milestoneId: string }
  | {
      type: "milestoneTask";
      categoryId: string;
      milestoneId: string;
      taskId: string;
      taskDateId?: number;
    }
);

type TaskDateOccurrence = {
  date: Date;
  taskDateId?: number;
  isCompleted?: boolean;
};

const getDatesInRange = (startDate: Date, endDate: Date) => {
  const dates: Date[] = [];
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const cursor = new Date(startTime <= endTime ? startDate : endDate);
  const lastDate = new Date(startTime <= endTime ? endDate : startDate);

  while (cursor.getTime() <= lastDate.getTime()) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
};

const sortDatesAscending = (dates: Date[]) =>
  [...dates].sort((a, b) => a.getTime() - b.getTime());

const sortTaskDateOccurrencesAscending = (
  occurrences: TaskDateOccurrence[],
) => [...occurrences].sort((a, b) => a.date.getTime() - b.date.getTime());

const getItemDates = (item: ScheduleItem, fallbackYear: number) => {
  if (item.dates && item.dates.length > 0) {
    return sortDatesAscending(
      item.dates
        .map((date) => parseScheduleDate(date, fallbackYear))
        .filter((date): date is Date => Boolean(date)),
    );
  }

  const startDate = parseScheduleDate(item.start, fallbackYear);
  const endDate = item.end ? parseScheduleDate(item.end, fallbackYear) : startDate;

  if (!startDate || !endDate) {
    return [];
  }

  return sortDatesAscending(getDatesInRange(startDate, endDate));
};

const getTaskDateOccurrences = (
  task: TaskItem,
  fallbackYear: number,
): TaskDateOccurrence[] => {
  if (task.taskDates?.length) {
    const occurrences: TaskDateOccurrence[] = [];

    task.taskDates.forEach((taskDate) => {
      const date = parseScheduleDate(taskDate.date, fallbackYear);

      if (date) {
        occurrences.push({
          date,
          taskDateId: taskDate.taskDateId,
          isCompleted: taskDate.isCompleted,
        });
      }
    });

    return sortTaskDateOccurrencesAscending(occurrences);
  }

  return sortTaskDateOccurrencesAscending(
    getItemDates(task, fallbackYear).map((date) => ({
      date,
      isCompleted: task.isCompleted,
    })),
  );
};

const isSameMonth = (date: Date, year: number, month: number) =>
  date.getFullYear() === year && date.getMonth() + 1 === month;

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

const formatGroupTitle = (date: Date) =>
  `${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAY_LABELS[date.getDay()]})`;

export const getDatedItemKey = (
  groupKey: string,
  datedItem: DatedSidebarItem,
) => {
  const baseKey = [
    groupKey,
    datedItem.type,
    datedItem.item.id,
    datedItem.date.toISOString(),
  ];

  if ("categoryId" in datedItem) {
    baseKey.push(datedItem.categoryId);
  }

  if ("milestoneId" in datedItem) {
    baseKey.push(datedItem.milestoneId);
  }

  if ("taskDateId" in datedItem && datedItem.taskDateId) {
    baseKey.push(String(datedItem.taskDateId));
  }

  return baseKey.join("-");
};

export const collectSidebarItemsByDate = ({
  categories,
  standaloneTasks,
  currentYear,
  currentMonth,
}: CalendarSidebarDateItemsParams) => {
  const datedItems: DatedSidebarItem[] = [];

  standaloneTasks.forEach((task) => {
    const barColor = task.accent ?? "#171717";

    getTaskDateOccurrences(task, currentYear)
      .filter(({ date }) => isSameMonth(date, currentYear, currentMonth))
      .forEach(({ date, taskDateId, isCompleted }) => {
        datedItems.push({
          item: task,
          date,
          barColor,
          isCompleted,
          type: "standaloneTask",
          taskId: task.id,
          taskDateId,
        });
      });
  });

  categories.forEach((category) => {
    category.tasks?.forEach((task) => {
      getTaskDateOccurrences(task, currentYear)
        .filter(({ date }) => isSameMonth(date, currentYear, currentMonth))
        .forEach(({ date, taskDateId, isCompleted }) => {
          datedItems.push({
            item: task,
            date,
            barColor: category.themeLight,
            isCompleted,
            type: "categoryTask",
            categoryId: category.id,
            taskId: task.id,
            taskDateId,
          });
        });
    });

    category.items.forEach((milestone) => {
      getItemDates(milestone, currentYear)
        .filter((date) => isSameMonth(date, currentYear, currentMonth))
        .forEach((date) => {
          datedItems.push({
            item: milestone,
            date,
            barColor: category.themeMid,
            isCompleted: Boolean(milestone.isCompleted),
            type: "milestone",
            categoryId: category.id,
            milestoneId: milestone.id,
          });
      });

      milestone.tasks?.forEach((task) => {
        getTaskDateOccurrences(task, currentYear)
          .filter(({ date }) => isSameMonth(date, currentYear, currentMonth))
          .forEach(({ date, taskDateId, isCompleted }) => {
            datedItems.push({
              item: task,
              date,
              barColor: category.themeLight,
              isCompleted,
              type: "milestoneTask",
              categoryId: category.id,
              milestoneId: milestone.id,
              taskId: task.id,
              taskDateId,
            });
          });
      });
    });
  });

  const sortedItems = datedItems.sort((a, b) => {
    const dateDiff = a.date.getTime() - b.date.getTime();

    if (dateDiff !== 0) {
      return dateDiff;
    }

    return a.item.title.localeCompare(b.item.title, "ko");
  });

  return sortedItems.reduce<{ key: string; title: string; items: DatedSidebarItem[] }[]>(
    (groups, item) => {
      const key = [
        item.date.getFullYear(),
        item.date.getMonth() + 1,
        item.date.getDate(),
      ].join("-");
      const previousGroup = groups.at(-1);

      if (previousGroup?.key === key) {
        previousGroup.items.push(item);
        return groups;
      }

      groups.push({
        key,
        title: formatGroupTitle(item.date),
        items: [item],
      });

      return groups;
    },
    [],
  );
};

export const collectSidebarItemsForDate = ({
  categories,
  standaloneTasks,
  selectedDate,
}: CalendarSidebarDateItemsParams & {
  selectedDate: Date;
}) => {
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth() + 1;
  const selectedKey = [
    selectedYear,
    selectedMonth,
    selectedDate.getDate(),
  ].join("-");
  const selectedGroup = collectSidebarItemsByDate({
    categories,
    standaloneTasks,
    currentYear: selectedYear,
    currentMonth: selectedMonth,
  }).find((group) => group.key === selectedKey);

  return selectedGroup?.items ?? [];
};
