import { describe, expect, it } from 'vitest';

import {
  mapMilestoneResponseToMilestone,
  mapScheduleInputToCreateMilestoneRequest,
  mapScheduleInputToUpdateMilestoneRequest,
} from './milestoneMapper';

describe('milestoneMapper', () => {
  it('다중 마일스톤 응답 날짜를 정규화하고 시간순으로 정렬한다', () => {
    const milestone = mapMilestoneResponseToMilestone({
      id: 3,
      categoryId: 2,
      name: '발표 준비',
      dateType: 'MULTIPLE',
      dates: ['2026-08-15T00:00:00.000Z', '2026-08-03'],
    });

    expect(milestone).toMatchObject({
      id: '3',
      categoryId: '2',
      title: '발표 준비',
      start: '2026-08-03',
      dates: ['2026-08-03', '2026-08-15'],
      isCompleted: false,
      tasks: [],
    });
  });

  it('기간 선택을 생성 API 형식으로 변환한다', () => {
    expect(
      mapScheduleInputToCreateMilestoneRequest({
        title: '개발 기간',
        start: '2026-08-01',
        end: '2026-08-10',
      }),
    ).toEqual({
      name: '개발 기간',
      dateType: 'RANGE',
      startDate: '2026-08-01',
      endDate: '2026-08-10',
      dates: null,
    });
  });

  it('다중 선택 수정 시 카테고리와 정렬된 날짜 필드를 전달한다', () => {
    expect(
      mapScheduleInputToUpdateMilestoneRequest(
        {
          title: '회의',
          start: '2026-08-03',
          dates: ['2026-08-03', '2026-08-17'],
        },
        '12',
      ),
    ).toEqual({
      name: '회의',
      categoryId: 12,
      dateType: 'MULTIPLE',
      startDate: undefined,
      endDate: null,
      dates: ['2026-08-03', '2026-08-17'],
    });
  });
});
