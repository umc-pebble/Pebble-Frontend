import { useReport } from '../context/ReportContext';
import { useReportNavigation } from '../hooks/useReportNavigation';
import { ReportCard } from '../components/ReportCard';
import { StepFooter } from '../components/StepFooter';
import { BusiestDaySection } from '../sections/BusiestDaySection';

/** R005 — 저번 달 가장 바빴던 하루 */
export function BusiestDayStep() {
  const { report } = useReport();
  const { goPrev, goNext } = useReportNavigation();

  return (
    <>
      <ReportCard className="!w-[600px] !bg-[rgba(250,250,250,0.25)] !px-[40px] !py-[40px] dark:!bg-[rgba(23,23,23,0.4)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.25),inset_0_5px_8px_rgba(255,255,255,0.6),inset_0_-3px_4px_#242424]">
        <BusiestDaySection day={report.busiestDay} darkTheme />
      </ReportCard>

      <StepFooter
        secondary={{ label: '이전으로', onClick: goPrev }}
        primary={{ label: '다음으로', onClick: goNext }}
        secondaryClassName="dark:border-border-secondary dark:bg-fill-inverse dark:text-text-strong dark:hover:bg-btn-quaternary dark:focus-visible:outline-text-strong"
        primaryClassName="dark:bg-btn-primary dark:text-text-onFill dark:hover:opacity-90 dark:focus-visible:outline-text-strong"
      />
    </>
  );
}
