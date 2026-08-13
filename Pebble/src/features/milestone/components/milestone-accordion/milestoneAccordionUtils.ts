import type { ScheduleItem } from '@/types';
import {
  formatScheduleDisplayDate,
  getScheduleDisplayLabels,
  parseIsoScheduleDate,
} from '@/utils/scheduleDate';

export const SCHEDULE_LEVEL_CLASS = {
  child: 'w-[320px]',
  grandchild: 'w-[308px]',
} as const;

const getScheduleSortTime = (item: ScheduleItem) => {
  const dateValues =
    'taskDates' in item && item.taskDates?.length
      ? item.taskDates.map((taskDate) => taskDate.date.slice(0, 10))
      : item.dates?.length
        ? item.dates
        : [item.start];
  const sortedTimes = dateValues
    .map((date) => parseIsoScheduleDate(date)?.getTime())
    .filter((time): time is number => time !== undefined)
    .sort((left, right) => left - right);

  return sortedTimes[0] ?? Number.MAX_SAFE_INTEGER;
};

export const sortScheduleItemsByDate = <T extends ScheduleItem>(items: T[]) =>
  [...items].sort((left, right) => {
    const dateDiff = getScheduleSortTime(left) - getScheduleSortTime(right);

    if (dateDiff !== 0) return dateDiff;

    return left.title.localeCompare(right.title, 'ko');
  });

export const getScheduleRows = (item: ScheduleItem, checked: boolean) => {
  if ('taskDates' in item && item.taskDates?.length) {
    return [...item.taskDates]
      .sort((left, right) => left.date.localeCompare(right.date))
      .map((taskDate) => ({
        key: String(taskDate.taskDateId),
        dateLabel: formatScheduleDisplayDate(taskDate.date.slice(0, 10)),
        checked: Boolean(taskDate.isCompleted),
        taskDateId: taskDate.taskDateId,
      }));
  }

  if (item.dates && item.dates.length > 0) {
    return [...item.dates]
      .sort((left, right) => left.localeCompare(right))
      .map((date) => ({
        key: date,
        dateLabel: formatScheduleDisplayDate(date),
        checked,
        taskDateId: undefined,
      }));
  }

  return getScheduleDisplayLabels(item).map((dateLabel) => ({
    key: dateLabel,
    dateLabel,
    checked,
    taskDateId: undefined,
  }));
};
