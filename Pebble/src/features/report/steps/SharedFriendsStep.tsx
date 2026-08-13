import { useReport } from '../context/ReportContext';
import { useReportNavigation } from '../hooks/useReportNavigation';
import { ReportCard } from '../components/ReportCard';
import { StepFooter } from '../components/StepFooter';
import { SharedFriendsSection } from '../sections/SharedFriendsSection';

/** R006 — 공유 카테고리를 함께한 친구들 */
export function SharedFriendsStep() {
  const { report } = useReport();
  const { goPrev, goNext } = useReportNavigation();

  return (
    <>
      <ReportCard className="!h-[504px] !w-[404px] !bg-[rgba(250,250,250,0.25)] !p-[40px] dark:!bg-[rgba(23,23,23,0.4)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.25),inset_0_5px_8px_rgba(255,255,255,0.6),inset_0_-3px_4px_#242424]">
        <SharedFriendsSection
          sharedFriends={report.sharedFriends}
          month={report.reportMonth}
          darkTheme
        />
      </ReportCard>

      <StepFooter
        className="mt-[clamp(18px,calc(100vh-966px),40px)]"
        secondary={{ label: '이전으로', onClick: goPrev }}
        primary={{ label: '다음으로', onClick: goNext }}
        secondaryClassName="dark:border-border-secondary dark:bg-fill-inverse dark:text-text-strong dark:hover:bg-btn-quaternary dark:focus-visible:outline-text-strong"
        primaryClassName="dark:bg-btn-primary dark:text-text-onFill dark:hover:opacity-90 dark:focus-visible:outline-text-strong"
      />
    </>
  );
}
