import { describe, expect, it } from 'vitest';

import {
  mapScheduleInputToCreateTaskRequest,
  mapScheduleInputToUpdateTaskRequest,
  mapTaskResponseToTask,
} from './taskMapper';

describe('taskMapper', () => {
  it('다중 태스크 회차를 정규화하고 날짜순으로 정렬한다', () => {
    const task = mapTaskResponseToTask({
      id: 4,
      name: '다중 태스크',
      dateType: 'MULTIPLE',
      taskDates: [
        { taskDateId: 2, date: '2026-08-11T00:00:00.000Z' },
        { taskDateId: 1, date: '2026-08-07' },
      ],
    });

    expect(task.start).toBe('2026-08-07');
    expect(task.dates).toEqual(['2026-08-07', '2026-08-11']);
    expect(task.taskDates?.map(({ taskDateId }) => taskDateId)).toEqual([1, 2]);
  });

  it('단일 태스크는 검정색으로, 카테고리 하위 태스크는 색상 없이 생성한다', () => {
    const input = {
      title: '할 일',
      start: '2026-08-13',
      accent: '#ff0000',
    };

    expect(
      mapScheduleInputToCreateTaskRequest({ input }),
    ).toMatchObject({
      categoryId: null,
      milestoneId: null,
      color: '#ff0000',
    });
    expect(
      mapScheduleInputToCreateTaskRequest({ categoryId: '3', input }),
    ).toMatchObject({
      categoryId: 3,
      milestoneId: null,
      color: undefined,
    });
  });

  it('카테고리 선택 해제 시 마일스톤도 제거해 단일 태스크로 수정한다', () => {
    expect(
      mapScheduleInputToUpdateTaskRequest({
        input: {
          title: '단일 일정',
          start: '2026-08-13',
          categoryId: '3',
          milestoneId: '5',
        },
        categoryId: null,
      }),
    ).toEqual({
      categoryId: null,
      milestoneId: null,
      name: '단일 일정',
      dateType: 'SINGLE',
      startDate: '2026-08-13',
      endDate: null,
      dates: null,
      color: '#171717',
    });
  });
});
