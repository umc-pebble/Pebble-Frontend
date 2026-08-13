import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  type ChartOptions,
  type ScriptableContext,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import type { RecentMonthPebble } from '../types/report';
import { REPORT_COLORS } from '../constants/reportTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

/** 값이 모두 같을 때(예: 전부 0) 선이 납작해 보이지 않도록 주는 최소 여백 */
const MIN_Y_PADDING = 12;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface RecentMonthsChartProps {
  /** 서버 값: recentMonths — 과거→현재 순 3개 (정규화 후라 항상 3개) */
  months: RecentMonthPebble[];
  /** R007 축소 표시용. 애니메이션을 끄고 높이를 줄입니다 */
  compact?: boolean;
  /** R003 첫 화면에서만 다크 차트 색상을 활성화합니다. */
  darkTheme?: boolean;
}

/**
 * 최근 3개월 조약돌 추이 차트.
 *
 * 월 라벨(4월/5월/6월)과 수치(46/36/64)는 디자인상 차트 위아래에 따로 놓여
 * 있어서 Chart.js 축을 모두 끄고 JSX 로 직접 렌더링합니다.
 *
 * 값이 전부 0이어도 안전합니다. 평평한 선이 카드 가운데에 그려집니다.
 */
export function RecentMonthsChart({
  months,
  compact = false,
  darkTheme = false,
}: RecentMonthsChartProps) {
  const isDarkMode =
    darkTheme &&
    typeof document !== 'undefined' &&
    document.documentElement.dataset.theme === 'dark';
  const values = useMemo(() => months.map((month) => month.count), [months]);
  const labels = useMemo(
    () => months.map((month) => `${month.month}월`),
    [months],
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: values,
          borderColor: (context: ScriptableContext<'line'>) => {
            if (!isDarkMode) return REPORT_COLORS.chartLine;

            const { ctx: canvas, chartArea } = context.chart;
            if (!chartArea) return '#3D3D3D';

            const gradient = canvas.createLinearGradient(
              chartArea.left,
              0,
              chartArea.right,
              0,
            );
            gradient.addColorStop(0, '#3D3D3D');
            gradient.addColorStop(0.5, '#3D3D3D');
            gradient.addColorStop(0.9, '#C9C9C9');
            gradient.addColorStop(1, '#C9C9C9');
            return gradient;
          },
          borderWidth: compact ? 1.5 : isDarkMode ? 3 : 2,
          tension: 0.35,
          fill: true,
          backgroundColor: (ctx: ScriptableContext<'line'>) => {
            const { ctx: canvas, chartArea } = ctx.chart;
            if (!chartArea) return REPORT_COLORS.chartFillBottom;
            const gradient = canvas.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            );
            gradient.addColorStop(
              0,
              isDarkMode
                ? 'rgba(61, 61, 61, 0.28)'
                : REPORT_COLORS.chartFillTop,
            );
            gradient.addColorStop(
              1,
              isDarkMode
                ? 'rgba(61, 61, 61, 0)'
                : REPORT_COLORS.chartFillBottom,
            );
            return gradient;
          },
          pointBackgroundColor: values.map((_, index) => {
            if (isDarkMode) {
              return index === values.length - 1 ? '#C9C9C9' : '#3D3D3D';
            }

            return index === values.length - 1 ? '#737373' : '#E5E5E5';
          }),
          pointBorderWidth: 0,
          // 마지막 점(이번 달)만 크게 강조
          pointRadius: values.map((_, i) =>
            i === values.length - 1 ? (compact ? 3 : 5) : compact ? 2 : 3.5,
          ),
          pointHoverRadius: values.map((_, i) =>
            i === values.length - 1 ? (compact ? 3 : 5) : compact ? 2 : 3.5,
          ),
        },
      ],
    }),
    [labels, values, compact, isDarkMode],
  );

  const options: ChartOptions<'line'> = useMemo(() => {
    // 정규화 덕에 빌 일은 없지만 방어적으로 한 번 더 막습니다
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 0;

    return {
      responsive: true,
      maintainAspectRatio: false,
      // 점이 가장자리에서 잘리지 않도록 여백 확보
      layout: { padding: { top: 8, bottom: 0, left: 0, right: 0 } },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false },
        y: {
          display: false,
          suggestedMin: min - MIN_Y_PADDING,
          suggestedMax: max + MIN_Y_PADDING,
        },
      },
      // R007 캡처 시 애니메이션 중간 상태가 찍히지 않도록 compact 는 항상 끕니다
      animation: compact || prefersReducedMotion() ? false : { duration: 600 },
    };
  }, [values, compact]);

  return (
    <div className="flex flex-1 flex-col">
      {/* 월 라벨 — 서버 값(recentMonths[].month) */}
      <div
        className={`flex justify-between font-medium leading-[150%] tracking-[-0.14px] text-[#A3A3A3] ${compact ? 'text-[6px]' : 'text-[14px]'} ${
          darkTheme ? 'dark:text-text-teritary' : ''
        }`}
      >
        {labels.map((label, index) => (
          <span
            key={label}
            className={
              darkTheme && index === labels.length - 1
                ? 'dark:text-text-secondary'
                : ''
            }
          >
            {label}
          </span>
        ))}
      </div>

      {/* 라인 차트 — 서버 값(recentMonths[].count) */}
      <div className={compact ? 'h-10 w-full' : 'h-[132px] w-full'}>
        <Line data={data} options={options} aria-hidden="true" />
      </div>

      {/* 수치 — 서버 값(recentMonths[].count) */}
      <div
        className={`flex justify-between font-semibold leading-[150%] tracking-[-0.16px] text-[#A3A3A3] ${compact ? 'text-[6px]' : 'text-[16px]'} ${
          darkTheme ? 'dark:text-text-teritary' : ''
        }`}
      >
        {months.map((m, index) => (
          <span
            key={`${m.year}-${m.month}`}
            className={
              darkTheme && index === months.length - 1
                ? 'dark:text-text-secondary'
                : ''
            }
          >
            {m.count}
          </span>
        ))}
      </div>

      {/* 차트를 볼 수 없는 사용자를 위한 텍스트 대체 */}
      <p className="sr-only">
        최근 3개월 조약돌 개수:{' '}
        {months.map((m) => `${m.month}월 ${m.count}개`).join(', ')}
      </p>
    </div>
  );
}
