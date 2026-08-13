import type { BusiestCategory, ReportMilestone } from '../types/report';
import { EmptyState } from '../components/EmptyState';
import activeMilestoneIcon from '@/assets/report/Ellipse 14.svg';
import inactiveMilestoneIcon from '@/assets/report/Ellipse 12.svg';
import checkIcon from '@/assets/report/Ic/Check.svg';
import closeIcon from '@/assets/report/Ic/Close.svg';

/** 하단에 펼칠 마일스톤 카드 최대 개수 (디자인 기준 3열) */
const MAX_FEATURED = 3;

interface BusiestCategorySectionProps {
  /** 서버 값: busiestCategory. null 이면 빈 상태 */
  category: BusiestCategory | null;
  darkTheme?: boolean;
}

/* ------------------------------- 하위 조각 ------------------------------- */

/** 상단 마일스톤 타임라인 */
function MilestoneTimeline({
  milestones,
  darkTheme = false,
}: {
  milestones: ReportMilestone[];
  darkTheme?: boolean;
}) {
  if (milestones.length === 0) return null;

  return (
    <div className="relative mt-[16px] h-[34px]">
      {/* 점들을 잇는 선. 첫 점과 마지막 점 중심 사이만 그리도록 좌우를 줄입니다 */}
      <div
        className="absolute left-0 right-0 top-[5px] mx-auto h-[2px] bg-[#DAF4FF]"
        style={{ width: `calc(100% - ${100 / milestones.length}%)` }}
        aria-hidden="true"
      />

      <ol className="relative flex">
        {milestones.map((milestone) => (
          <li
            key={milestone.id}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <span className="relative h-[12px] w-[12px]" aria-hidden="true">
              {milestone.featured ? (
                <img
                  src={activeMilestoneIcon}
                  alt=""
                  className="absolute left-1/2 top-1/2 h-[20px] w-[20px] max-w-none -translate-x-1/2 -translate-y-1/2"
                />
              ) : (
                <>
                  <img
                    src={inactiveMilestoneIcon}
                    alt=""
                    className={`h-[12px] w-[12px] ${
                      darkTheme ? 'dark:hidden' : ''
                    }`}
                  />
                  {darkTheme ? (
                    <span className="hidden h-[12px] w-[12px] rounded-full bg-text-teritary dark:block" />
                  ) : null}
                </>
              )}
            </span>
            {/* 마일스톤 이름 — 서버 값(busiestCategory.milestones[].name) */}
            <span
              className={`whitespace-nowrap text-[12px] font-normal leading-[150%] tracking-[-0.12px] ${
                milestone.featured
                  ? 'text-[#00CEF5]'
                  : `text-[#A3A3A3] ${
                      darkTheme ? 'dark:text-text-teritary' : ''
                    }`
              }`}
            >
              {milestone.name}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 하단 마일스톤별 태스크 카드 한 열 */
function MilestoneTaskColumn({
  milestone,
  darkTheme = false,
}: {
  milestone: ReportMilestone;
  darkTheme?: boolean;
}) {
  return (
    <div className="relative flex h-[162px] min-w-0 flex-1 flex-col overflow-hidden rounded-[12px] bg-[rgba(255,255,255,0.05)] p-[20px]">
      <p
        className={`flex items-center gap-[8px] text-[16px] font-medium leading-[150%] tracking-[-0.16px] text-[#171717] ${
          darkTheme ? 'dark:text-text-primary' : ''
        }`}
      >
        <span
          className="h-[20px] w-[4px] rounded-full"
          style={{ backgroundColor: '#9CE7FF' }}
          aria-hidden="true"
        />
        {/* 마일스톤 이름 — 서버 값 */}
        {milestone.name}
      </p>

      <ul className="mt-[8px] flex flex-col gap-[4px]">
        {milestone.tasks.map((task) => (
          <li key={task.id} className="flex items-center gap-[4px]">
            {/* 완료 여부 — 서버 값(tasks[].completed) */}
            {task.completed ? (
              <>
                <img
                  src={checkIcon}
                  alt=""
                  className={`h-[24px] w-[24px] shrink-0 ${
                    darkTheme ? 'dark:hidden' : ''
                  }`}
                />
                {darkTheme ? (
                  <span
                    className="hidden h-[24px] w-[24px] shrink-0 bg-text-primary dark:block"
                    style={{
                      WebkitMaskImage: `url(${checkIcon})`,
                      WebkitMaskPosition: 'center',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskSize: '24px 24px',
                      maskImage: `url(${checkIcon})`,
                      maskPosition: 'center',
                      maskRepeat: 'no-repeat',
                      maskSize: '24px 24px',
                    }}
                  />
                ) : null}
              </>
            ) : (
              <img
                src={closeIcon}
                alt=""
                className="h-[24px] w-[24px] shrink-0"
              />
            )}
            {/* 태스크 이름 — 서버 값(tasks[].name) */}
            <span
              className={`truncate text-[14px] font-normal leading-[150%] tracking-[-0.14px] ${
                task.completed ? 'text-[#404040]' : 'text-[#A3A3A3]'
              } ${darkTheme ? 'dark:text-text-primary' : ''}`}
            >
              {task.name}
            </span>
          </li>
        ))}
      </ul>

      {/* 나머지 태스크 개수 — 서버 값(remainingTaskCount).
          현재는 표시 전용입니다. 클릭 시 목록으로 보내야 하면 button 으로 바꾸세요. */}
      <p
        className={`absolute bottom-[11px] left-1/2 flex h-[30px] w-[130px] -translate-x-1/2 items-center justify-center rounded-[999px] bg-[#DAF4FF] text-center text-[13px] font-normal leading-[130%] text-[#A3A3A3] ${
          darkTheme ? 'dark:text-text-teritary' : ''
        }`}
      >
        + {milestone.remainingTaskCount}개
      </p>
    </div>
  );
}

/* -------------------------------- 본체 -------------------------------- */

/** R004 — 이번 달 가장 바빴던 카테고리 */
export function BusiestCategorySection({
  category,
  darkTheme = false,
}: BusiestCategorySectionProps) {
  if (!category) {
    return (
      <EmptyState
        message="저번 달에는 기록한 카테고리가 없어요."
        darkTheme={darkTheme}
      />
    );
  }

  const { name, colorHex, milestoneCount, taskCount, milestones } = category;

  // featured 인 마일스톤만 하단에 펼칩니다. 4개 이상 와도 3개까지만.
  const featured = milestones
    .filter((m) => m.featured)
    .slice(0, MAX_FEATURED);

  return (
    <div className="flex h-full items-center gap-[20px]">
      {/* ---------- 좌: 카테고리 요약 ---------- */}
      <section className="w-[318px] shrink-0">
        <p
          className={`text-[14px] font-medium leading-[150%] tracking-[-0.14px] text-[#A3A3A3] ${
            darkTheme ? 'dark:text-text-teritary' : ''
          }`}
        >
          저번 달 가장 바빴던 카테고리
        </p>

        <h2
          className={`mt-[12px] flex items-center gap-[12px] text-[40px] font-bold leading-[120%] tracking-[-0.4px] text-[#404040] ${
            darkTheme ? 'dark:text-text-primary' : ''
          }`}
        >
          {/* 카테고리 색 — 서버 값(busiestCategory.colorHex) */}
          <span
            className="h-[40px] w-[8px] rounded-[4px]"
            style={{ backgroundColor: colorHex }}
            aria-hidden="true"
          />
          {/* 카테고리 이름 — 서버 값(busiestCategory.name) */}
          {name}
        </h2>

        <div className="mt-[32px] flex gap-[12px]">
          {/* 마일스톤 수 — 서버 값(milestoneCount) */}
          <div
            className={`flex h-[134px] flex-1 flex-col justify-between rounded-[20px] bg-white p-[20px] ${
              darkTheme ? 'dark:bg-fill-inverse' : ''
            }`}
          >
            <span
              className={`text-[54px] font-bold leading-none tracking-[-0.54px] text-[#404040] ${
                darkTheme ? 'dark:text-text-primary' : ''
              }`}
            >
              {milestoneCount.toLocaleString('ko-KR')}
            </span>
            <span
              className={`whitespace-nowrap text-[18px] font-medium leading-[150%] tracking-[-0.18px] text-[#A3A3A3] ${
                darkTheme ? 'dark:text-text-teritary' : ''
              }`}
            >
              등록한 마일스톤
            </span>
          </div>

          {/* 태스크 수 — 서버 값(taskCount) */}
          <div
            className={`flex h-[134px] flex-1 flex-col justify-between rounded-[20px] bg-white p-[20px] ${
              darkTheme ? 'dark:bg-fill-inverse' : ''
            }`}
          >
            <span
              className={`text-[54px] font-bold leading-none tracking-[-0.54px] text-[#737373] ${
                darkTheme ? 'dark:text-text-secondary' : ''
              }`}
            >
              {taskCount.toLocaleString('ko-KR')}
            </span>
            <span
              className={`whitespace-nowrap text-[18px] font-medium leading-[150%] tracking-[-0.18px] text-[#A3A3A3] ${
                darkTheme ? 'dark:text-text-teritary' : ''
              }`}
            >
              등록한 태스크
            </span>
          </div>
        </div>
      </section>

      {/* ---------- 우: 타임라인 + 태스크 ---------- */}
      <section
        className={`flex h-[300px] w-[574px] shrink-0 flex-col rounded-[20px] bg-white p-[20px] ${
          darkTheme ? 'dark:bg-fill-inverse' : ''
        }`}
      >
        <h3
          className={`text-[14px] font-medium leading-[150%] tracking-[-0.14px] text-[#A3A3A3] ${
            darkTheme ? 'dark:text-text-teritary' : ''
          }`}
        >
          {name}에서 쌓은 저번 달의 기록
        </h3>

        <MilestoneTimeline milestones={milestones} darkTheme={darkTheme} />

        {featured.length > 0 && (
          <div className="mt-[16px] flex gap-[12px]">
            {featured.map((milestone) => (
              <MilestoneTaskColumn
                key={milestone.id}
                milestone={milestone}
                darkTheme={darkTheme}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
