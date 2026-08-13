import type { MonthlyReportResponse } from '../types/report';
import { formatKoreanDate } from '../utils/formatDate';
import { RecentMonthsChart } from '../components/RecentMonthsChart';
import pebbleLarge from '@/assets/report/r003-pebble-large.svg';
import pebbleSmall from '@/assets/report/r003-pebble-small.svg';

interface MonthlyPebbleSectionProps {
  report: MonthlyReportResponse;
  darkTheme?: boolean;
}

/**
 * R003 — 이번 달 조약돌.
 *
 * 카드 껍데기는 포함하지 않습니다. 단계 페이지와 R007 요약이 각각 다른
 * 크기의 셸에 이 내용을 넣기 때문입니다.
 */
export function MonthlyPebbleSection({
  report,
  darkTheme = false,
}: MonthlyPebbleSectionProps) {
  const {
    reportYear,
    reportMonth,
    monthlyPebbleCount,
    recentMonths,
    totalPebbleCount,
    recordStartDate,
    recordEndDate,
  } = report;

  return (
    <div className="grid h-full grid-cols-[318px_350px_204px] items-center gap-x-[20px]">
      {/* ---------- 좌: 이번 달 개수 ---------- */}
      <section className="flex h-[262px] flex-col justify-center">
        {/* 리포트 연월 — 서버 값(reportYear, reportMonth) */}
        <p
          className={`text-[14px] font-medium leading-[150%] tracking-[-0.14px] text-[#737373] ${
            darkTheme ? 'dark:text-text-secondary' : ''
          }`}
        >
          {reportYear}년 {reportMonth}월 월말 리포트
        </p>

        <h2
          className={`mt-[12px] text-[40px] font-bold leading-[120%] tracking-[-0.4px] text-[#404040] ${
            darkTheme ? 'dark:text-text-primary' : ''
          }`}
        >
          저번 달에는
          <br />
          이만큼 쌓았어요!
        </h2>

        <p className="mt-[14px] flex items-end gap-[8px]">
          {/* 이번 달 개수 — 서버 값(monthlyPebbleCount) */}
          <span
            className={`bg-[linear-gradient(128deg,#D4D4D4_13.45%,#A3A3A3_37.1%,#737373_63.3%,#D4D4D4_89.14%)] bg-clip-text text-[88px] font-bold leading-none tracking-[-0.88px] text-transparent ${
              darkTheme
                ? 'dark:bg-[linear-gradient(120.92deg,#5C5C5C_13.45%,#8F8F8F_37.1%,#ADADAD_63.3%,#5C5C5C_89.14%)]'
                : ''
            }`}
          >
            {monthlyPebbleCount.toLocaleString('ko-KR')}
          </span>
          <span
            className={`pb-[8px] text-[24px] font-bold leading-[130%] tracking-[-0.24px] text-[#404040] ${
              darkTheme ? 'dark:text-text-primary' : ''
            }`}
          >
            개의 조약돌
          </span>
        </p>
      </section>

      {/* ---------- 중: 최근 3개월 차트 ---------- */}
      <section
        className={`flex h-[262px] flex-col rounded-[20px] bg-white p-[20px] ${
          darkTheme ? 'dark:bg-fill-inverse' : ''
        }`}
      >
        <h3
          className={`text-[14px] font-medium leading-[150%] tracking-[-0.14px] text-[#737373] ${
            darkTheme ? 'dark:text-text-secondary' : ''
          }`}
        >
          최근 3개월
        </h3>
        <div className="mt-[8px] flex flex-1 flex-col">
          {/* 서버 값(recentMonths) */}
          <RecentMonthsChart months={recentMonths} darkTheme={darkTheme} />
        </div>
      </section>

      {/* ---------- 우: 누적 ---------- */}
      <section
        className={`relative flex h-[262px] flex-col overflow-hidden rounded-[20px] bg-white p-[20px] ${
          darkTheme ? 'dark:bg-fill-inverse' : ''
        }`}
      >
        <h3
          className={`text-[14px] font-medium leading-[150%] tracking-[-0.14px] text-[#737373] ${
            darkTheme ? 'dark:text-text-secondary' : ''
          }`}
        >
          그리고 지금까지
        </h3>

        {/* 누적 개수 — 서버 값(totalPebbleCount) */}
        <p
          className={`mt-[5px] bg-[linear-gradient(138deg,#D4D4D4_13.45%,#A3A3A3_37.1%,#737373_63.3%,#D4D4D4_89.14%)] bg-clip-text text-[48px] font-bold leading-none tracking-[-0.48px] text-transparent ${
            darkTheme
              ? 'dark:bg-[linear-gradient(120.92deg,#5C5C5C_13.45%,#8F8F8F_37.1%,#ADADAD_63.3%,#5C5C5C_89.14%)]'
              : ''
          }`}
        >
          {totalPebbleCount.toLocaleString('ko-KR')}
        </p>
        <p
          className={`mt-[4px] text-[16px] font-bold leading-[130%] tracking-[-0.16px] text-[#404040] ${
            darkTheme ? 'dark:text-text-primary' : ''
          }`}
        >
          개의 조약돌을 쌓았어요
        </p>

        {/* 기록 기간 — 서버 값(recordStartDate ~ recordEndDate) */}
        <p
          className={`mt-[14px] text-[13px] font-normal leading-[130%] text-[#A3A3A3] ${
            darkTheme ? 'dark:text-text-teritary' : ''
          }`}
        >
          {formatKoreanDate(recordStartDate)}부터
          <br />
          {formatKoreanDate(recordEndDate)}까지의
          <br />
          기록이에요
        </p>

        <img
          src={pebbleLarge}
          alt=""
          className="pointer-events-none absolute bottom-[17px] right-[20px] h-[57px] w-[34px] rotate-90"
        />
        <img
          src={pebbleSmall}
          alt=""
          className="pointer-events-none absolute bottom-[35px] right-[28px] h-[35px] w-[25px] rotate-90"
        />
      </section>
    </div>
  );
}
