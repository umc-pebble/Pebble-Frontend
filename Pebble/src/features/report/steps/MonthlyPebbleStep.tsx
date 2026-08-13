import { useReport } from '../context/ReportContext';
import { useReportNavigation } from '../hooks/useReportNavigation';
import { ReportCard } from '../components/ReportCard';
import { StepFooter } from '../components/StepFooter';
import { MonthlyPebbleSection } from '../sections/MonthlyPebbleSection';

/** R003 — 이번 달 조약돌 (리포트 첫 화면) */
export function MonthlyPebbleStep() {
  const { report } = useReport();
  const { goNext } = useReportNavigation();

  return (
    <>
      <ReportCard className="dark:bg-[rgba(23,23,23,0.7)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.25),inset_0_5px_8px_rgba(255,255,255,0.6),inset_0_-3px_4px_#242424]">
        <MonthlyPebbleSection report={report} darkTheme />
      </ReportCard>

      {/* 첫 단계라 "이전으로"가 없습니다 */}
      <StepFooter
        primary={{ label: '다음으로', onClick: goNext }}
        primaryClassName="dark:bg-btn-primary dark:text-text-onFill dark:hover:opacity-90 dark:focus-visible:outline-[#F8F8F8]"
      />
    </>
  );
}
