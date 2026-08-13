
import { useEffect, useRef, useState } from 'react';

import CheckIcon from '@/assets/icons/Check.svg?react';

import {
  BUSIEST_CATEGORY,
  BUSIEST_DAY,
  MONTHLY_PEBBLE_COUNT,
  REPORT_SCHEDULE_ITEMS,
  REPORT_SECTION_COPY,
  type ReportScheduleItem,
} from '@/features/landing/constants/reportSectionData';
import { useInView } from '@/features/landing/hooks/useInView';

import '../styles/reportAnimation.css';

interface ReportRevealProps {
  isVisible: boolean;
  revealDelay: number;
}

const CARD_REVEAL_DELAY = {
  left: 150,
  right: 400,
  center: 650,
} as const;

function getTextRevealClassName(isVisible: boolean) {
  return [
    'landing-report-text-reveal',
    isVisible ? 'is-visible' : '',
  ].join(' ');
}

function getCardRevealClassName(isVisible: boolean) {
  return [
    'landing-report-card-reveal',
    isVisible ? 'is-visible' : '',
  ].join(' ');
}

function getCardRevealStyle(
  isVisible: boolean,
  revealDelay: number,
) {
  return {
    transitionDelay: isVisible
      ? `${revealDelay}ms`
      : '0ms',
  };
}

function MonthlyPebbleCountCard({
  isVisible,
  revealDelay,
}: ReportRevealProps) {
  return (
    <article
      className={[
        'absolute left-[130px] top-[359px]',
        'flex h-[242.36px] w-[311px] items-center justify-center',
        'rounded-token-m bg-fill-surface px-[64px] py-[54px]',
        'shadow-shadow-m',
        getCardRevealClassName(isVisible),
      ].join(' ')}
      style={getCardRevealStyle(isVisible, revealDelay)}
    >
      <div className="flex h-[134.36px] w-[183px] flex-col gap-[6.36px]">
        <p className="h-[68px] w-[183px] text-[28px] font-bold leading-[120%] tracking-[-0.01em] text-text-primary">
          이번 달에는
          <br />
          이만큼 쌓았어요!
        </p>

        <div className="flex items-end gap-[8px]">
          <span className="bg-[linear-gradient(120.92deg,#D4D4D4_13.45%,#A3A3A3_37.1%,#737373_63.3%,#D4D4D4_89.14%)] bg-clip-text text-[60px] font-bold leading-none tracking-[-0.01em] text-transparent">
            {MONTHLY_PEBBLE_COUNT}
          </span>

          <span className="mb-[8px] text-[16px] font-bold leading-[130%] tracking-[-0.01em] text-text-primary">
            개의 조약돌
          </span>
        </div>
      </div>
    </article>
  );
}

function BusiestCategoryCard({
  isVisible,
  revealDelay,
}: ReportRevealProps) {
  return (
    <article
      className={[
        'absolute left-[485px] top-[540px]',
        'flex h-[316px] w-[386px] flex-col gap-[24px]',
        'rounded-token-m bg-fill-surface px-[40px] py-[32px]',
        'shadow-shadow-m',
        getCardRevealClassName(isVisible),
      ].join(' ')}
      style={getCardRevealStyle(isVisible, revealDelay)}
    >
      <div className="flex h-[69px] w-[219px] flex-col gap-[8px]">
        <p className="text-[14px] font-medium leading-[150%] tracking-[-0.01em] text-text-teritary">
          {BUSIEST_CATEGORY.label}
        </p>

        <div className="flex h-[40px] items-center gap-[12px]">
          <span
            aria-hidden="true"
            className="h-[40px] w-[8px] rounded-token-s"
            style={{
              backgroundColor: BUSIEST_CATEGORY.color,
            }}
          />

          <h3 className="text-[32px] font-bold leading-[120%] tracking-[-0.01em] text-text-primary">
            {BUSIEST_CATEGORY.name}
          </h3>
        </div>
      </div>

      <div className="flex h-[159px] w-[306px] gap-[16px]">
        <div className="flex h-[159px] w-[153px] flex-col justify-between rounded-token-m px-token-l py-[24px]">
          <strong className="text-[54px] font-bold leading-none tracking-[-0.01em] text-text-primary">
            {BUSIEST_CATEGORY.milestoneCount}
          </strong>

          <span className="text-[18px] font-medium leading-[150%] tracking-[-0.01em] text-text-teritary">
            등록한 마일스톤
          </span>
        </div>

        <div className="flex h-[159px] w-[137px] flex-col justify-between rounded-token-m px-token-l py-[24px]">
          <strong className="text-[54px] font-bold leading-none tracking-[-0.01em] text-text-primary">
            {BUSIEST_CATEGORY.taskCount}
          </strong>

          <span className="text-[18px] font-medium leading-[150%] tracking-[-0.01em] text-text-teritary">
            등록한 태스크
          </span>
        </div>
      </div>
    </article>
  );
}

function ReportScheduleRow({
  item,
}: {
  item: ReportScheduleItem;
}) {
  return (
    <li className="flex h-[62.5px] w-[314px] flex-col gap-[2.93px] rounded-[14.64px] bg-fill-inverse px-[14.64px] py-[8.79px]">
      <p className="text-[12px] font-medium leading-[150%] tracking-[-0.01em] text-text-teritary">
        {item.categoryName}
      </p>

      <div className="flex h-[24px] w-full items-center justify-between">
        <div className="flex items-center gap-[5.86px]">
          <span
            aria-hidden="true"
            className="h-[24px] w-[5.86px] rounded-[2.93px]"
            style={{
              backgroundColor: item.barColor,
            }}
          />

          <span className="text-[16px] font-medium leading-[150%] tracking-[-0.01em] text-text-primary">
            {item.title}
          </span>
        </div>

        <span className="flex size-5 items-center justify-center rounded-full bg-btn-primary text-text-onFill">
          <CheckIcon
            aria-hidden="true"
            className="size-[12px]"
          />
        </span>
      </div>
    </li>
  );
}

function BusiestDayCard({
  isVisible,
  revealDelay,
}: ReportRevealProps) {
  return (
    <article
      className={[
        'absolute left-[916px] top-[394px]',
        'flex h-[377.5px] w-[394px] flex-col gap-[12px]',
        'rounded-token-m bg-fill-surface px-[40px] py-[32px]',
        'shadow-shadow-m',
        getCardRevealClassName(isVisible),
      ].join(' ')}
      style={getCardRevealStyle(isVisible, revealDelay)}
    >
      <div className="flex h-[60px] w-[314px] flex-col gap-[6px]">
        <p className="text-[12px] font-medium leading-[150%] tracking-[-0.01em] text-text-teritary">
          {BUSIEST_DAY.label}
        </p>

        <h3 className="h-[36px] text-text-primary">
          <span className="text-[30px] font-bold leading-[120%] tracking-[-0.01em]">
            {BUSIEST_DAY.date}
          </span>

          <span className="text-[20px] font-medium leading-[130%] tracking-[-0.01em]">
            {BUSIEST_DAY.suffix}
          </span>
        </h3>
      </div>

      <div className="flex h-[26px] w-[314px] gap-[12px]">
        <span className="flex h-[26px] w-[151px] items-center rounded-full bg-fill-surface py-[4px] text-[12px] font-semibold leading-[150%] tracking-[-0.01em] text-text-teritary">
          {BUSIEST_DAY.dayOfWeek}
        </span>

        <span className="flex h-[26px] w-[151px] items-center rounded-full bg-fill-surface py-[4px] text-[12px] font-semibold leading-[150%] tracking-[-0.01em] text-text-teritary">
          {BUSIEST_DAY.totalScheduleCount}
        </span>
      </div>

      <ul className="flex h-[203.5px] w-[314px] flex-col gap-[8px]">
        {REPORT_SCHEDULE_ITEMS.map((item) => (
          <ReportScheduleRow
            key={item.id}
            item={item}
          />
        ))}
      </ul>
    </article>
  );
}

export function ReportSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, {
    threshold: 0.45,
  });
  const [hasEntered, setHasEntered] = useState(false);

  const lastScrollYRef = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('down');

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollYRef.current) {
        scrollDirectionRef.current = 'down';
      } else if (currentScrollY < lastScrollYRef.current) {
        scrollDirectionRef.current = 'up';
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      /*
       * 아래로 처음 진입하면 false → true로 변경되어
       * 등장 애니메이션이 실행됩니다.
       *
       * 아래쪽에서 위로 재진입할 때는 이미 true 상태이므로
       * 애니메이션 없이 기존 콘텐츠가 그대로 표시됩니다.
       */
      setHasEntered(true);
      return;
    }

    /*
     * 위로 스크롤하며 섹션의 위쪽으로 완전히 벗어났을 때만
     * 다음 하향 진입을 위해 애니메이션 상태를 초기화합니다.
     *
     * 아래로 섹션을 벗어날 때는 true 상태를 유지하므로
     * 다시 위로 올라와도 퇴장·재등장 애니메이션이 없습니다.
     */
    if (scrollDirectionRef.current === 'up') {
      setHasEntered(false);
    }
  }, [isInView]);

  return (
    <div
      ref={sectionRef}
      className="relative h-full w-full overflow-hidden bg-transparent"
    >
      <div
        className={[
          'absolute left-[100px] top-[160px]',
          getTextRevealClassName(hasEntered),
        ].join(' ')}
      >
        <h2 className="h-[70px] w-[662px] text-[54px] font-bold leading-[130%] tracking-[-0.01em] text-text-strong">
          {REPORT_SECTION_COPY.title}
        </h2>

        <p className="mt-[20px] h-[31px] w-[398px] text-[24px] font-medium leading-[130%] tracking-[-0.01em] text-text-secondary">
          {REPORT_SECTION_COPY.description}
        </p>
      </div>

      {/* 왼쪽 → 오른쪽 → 가운데 순서로 등장합니다. */}
      <MonthlyPebbleCountCard
        isVisible={hasEntered}
        revealDelay={CARD_REVEAL_DELAY.left}
      />

      <BusiestCategoryCard
        isVisible={hasEntered}
        revealDelay={CARD_REVEAL_DELAY.center}
      />

      <BusiestDayCard
        isVisible={hasEntered}
        revealDelay={CARD_REVEAL_DELAY.right}
      />
    </div>
  );
}
