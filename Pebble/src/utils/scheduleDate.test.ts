import { describe, expect, it } from 'vitest';

import {
  formatScheduleDisplayDate,
  getScheduleRangeFromSelection,
  parseIsoScheduleDate,
} from './scheduleDate';

describe('scheduleDate', () => {
  it('ISO 날짜 문자열을 로컬 날짜로 파싱한다', () => {
    const date = parseIsoScheduleDate('2026-08-13');

    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(7);
    expect(date?.getDate()).toBe(13);
    expect(parseIsoScheduleDate('2026/08/13')).toBeNull();
  });

  it('표시 날짜에서 앞자리 0을 제거한다', () => {
    expect(formatScheduleDisplayDate('2026-08-03')).toBe('8/3');
    expect(formatScheduleDisplayDate('invalid')).toBe('invalid');
  });

  it('기간 선택을 시작일과 종료일로 변환한다', () => {
    expect(
      getScheduleRangeFromSelection({
        dateType: '기간',
        selectedDate: null,
        dateRange: {
          start: new Date(2026, 6, 15),
          end: new Date(2026, 6, 22),
        },
        multiDates: [],
      }),
    ).toEqual({
      start: '2026-07-15',
      end: '2026-07-22',
    });
  });

  it('다중 날짜를 시간순으로 정렬해 변환한다', () => {
    expect(
      getScheduleRangeFromSelection({
        dateType: '다중',
        selectedDate: null,
        dateRange: { start: null, end: null },
        multiDates: [
          new Date(2026, 7, 11),
          new Date(2026, 7, 7),
        ],
      }),
    ).toEqual({
      start: '2026-08-07',
      end: undefined,
      dates: ['2026-08-07', '2026-08-11'],
    });
  });
});
