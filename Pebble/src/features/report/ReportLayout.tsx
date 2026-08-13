import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { ReportProvider } from './context/ReportContext';
import { useMonthlyReport } from './hooks/useMonthlyReport';
import { FallbackNotice } from './components/FallbackNotice';
import reportCloseIcon from '@/assets/report/report-close.svg';
import reportBgTop from '@/assets/report/r003-bg-top.svg';
import reportBgBottom from '@/assets/report/r003-bg-bottom.svg';

/** 모든 리포트 화면의 닫기 버튼이 돌아갈 실제 마이페이지 경로 */
const EXIT_PATH = '/my';

interface ReportLayoutProps {
  /** 리포트가 아직 없을 때 빈 상태에 표시할 연도. 없으면 전월 */
  year?: number;
  /** 리포트가 아직 없을 때 빈 상태에 표시할 월. 없으면 전월 */
  month?: number;
  /** "리포트 닫기" 동작. 없으면 EXIT_PATH 로 이동 */
  onClose?: () => void;
}

/**
 * 리포트 5단계가 공유하는 껍데기.
 *
 * - API 를 여기서 한 번만 호출합니다. 단계를 넘겨도 재요청이 없습니다.
 * - "리포트 닫기" 버튼과 오류 안내를 한 곳에서 관리합니다.
 * - 각 단계 내용은 <Outlet /> 자리에 들어갑니다.
 *
 * 단계별 하단 버튼("이전으로/다음으로")은 단계마다 구성이 달라서
 * 각 step 컴포넌트가 직접 렌더링합니다.
 */
export function ReportLayout({ year, month, onClose }: ReportLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMonthlyStep = location.pathname.endsWith('/monthly');
  const isBusiestCategoryStep = location.pathname.endsWith('/category');
  const isBusiestDayStep = location.pathname.endsWith('/day');
  const isSharedFriendsStep = location.pathname.endsWith('/friends');
  const isSummaryStep = location.pathname.endsWith('/summary');
  const usesDarkReportCanvas =
    isMonthlyStep ||
    isBusiestCategoryStep ||
    isBusiestDayStep ||
    isSharedFriendsStep ||
    isSummaryStep;

  const now = useMemo(() => new Date(), []);
  const previousMonth = useMemo(
    () => new Date(now.getFullYear(), now.getMonth() - 1, 1),
    [now],
  );
  const targetYear = year ?? previousMonth.getFullYear();
  const targetMonth = month ?? previousMonth.getMonth() + 1;

  const { report, usedFallback, isLoading, refetch } = useMonthlyReport(
    targetYear,
    targetMonth,
  );

  const handleClose = onClose ?? (() => navigate(EXIT_PATH));

  const contextValue = useMemo(
    () => ({ report, usedFallback, isLoading, refetch }),
    [report, usedFallback, isLoading, refetch],
  );

  return (
    <div
      className={`relative isolate h-[100dvh] w-full overflow-hidden bg-white [font-family:'Pretendard',sans-serif] ${
        usesDarkReportCanvas ? 'dark:bg-fill-surface' : ''
      }`}
    >
      {/* R003~R007 공통 배경 장식 */}
      <img
        src={reportBgTop}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[-182px] top-[-182px] z-0 h-[731px] w-[1281px] object-fill dark:brightness-[0.094]"
      />
      <img
        src={reportBgBottom}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[332px] top-[489px] z-0 h-[702px] w-[1491px] object-fill dark:brightness-[0.132]"
      />

      <header className="absolute right-[clamp(32px,6.94vw,100px)] top-[clamp(32px,9.76vh,100px)] z-20">
        <button
          type="button"
          onClick={handleClose}
          className={`flex items-center gap-[8px] text-[24px] font-medium leading-[130%] tracking-[-0.24px] text-[#171717] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717] ${
            usesDarkReportCanvas
              ? 'dark:text-text-strong dark:focus-visible:outline-[#F8F8F8]'
              : ''
          }`}
        >
          리포트 닫기
          <span className="flex size-[44px] items-center justify-center rounded-[12px]">
            <img
              src={reportCloseIcon}
              alt=""
              className={`size-[24px] ${
                usesDarkReportCanvas ? 'dark:invert' : ''
              }`}
            />
          </span>
        </button>
      </header>

      <main className="relative z-10 flex h-full min-h-0 flex-col items-center pt-[clamp(150px,calc(50vh-258px),254px)]">
        {/* 로딩 중에도 레이아웃이 튀지 않도록 살짝 흐리게만 처리합니다 */}
        <div
          className={`flex w-full flex-col items-center transition-opacity ${
            isLoading ? 'opacity-50' : 'opacity-100'
          }`}
          aria-busy={isLoading}
        >
          {usedFallback && !isLoading && <FallbackNotice onRetry={refetch} />}

          <ReportProvider value={contextValue}>
            <Outlet />
          </ReportProvider>
        </div>
      </main>
    </div>
  );
}
