import { describe, expect, it } from 'vitest';

import type { TaskItem } from '@/types';

import {
  getScheduleRows,
  sortScheduleItemsByDate,
} from './milestoneAccordionUtils';

const createTask = (
  id: string,
  title: string,
  start: string,
  extra: Partial<TaskItem> = {},
): TaskItem => ({
  id,
  title,
  start,
  itemType: 'task',
  ...extra,
});

describe('milestoneAccordionUtils', () => {
  it('일정의 가장 빠른 날짜를 기준으로 정렬한다', () => {
    const tasks = [
      createTask('late', '나중', '2026-08-20'),
      createTask('multiple', '다중', '2026-08-15', {
        dates: ['2026-08-15', '2026-08-03'],
      }),
      createTask('task-date', '회차', '2026-08-10', {
        taskDates: [
          { taskDateId: 2, date: '2026-08-10' },
          { taskDateId: 1, date: '2026-08-01' },
        ],
      }),
    ];

    expect(sortScheduleItemsByDate(tasks).map((task) => task.id)).toEqual([
      'task-date',
      'multiple',
      'late',
    ]);
  });

  it('다중 태스크 회차를 날짜순으로 분리하고 완료 상태를 유지한다', () => {
    const task = createTask('task', '다중 태스크', '2026-08-10', {
      taskDates: [
        {
          taskDateId: 2,
          date: '2026-08-11T00:00:00.000Z',
          isCompleted: true,
        },
        {
          taskDateId: 1,
          date: '2026-08-07T00:00:00.000Z',
          isCompleted: false,
        },
      ],
    });

    expect(getScheduleRows(task, false)).toEqual([
      {
        key: '1',
        dateLabel: '8/7',
        checked: false,
        taskDateId: 1,
      },
      {
        key: '2',
        dateLabel: '8/11',
        checked: true,
        taskDateId: 2,
      },
    ]);
  });
});
