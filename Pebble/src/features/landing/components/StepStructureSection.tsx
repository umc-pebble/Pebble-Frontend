
import { STEP_STRUCTURE_STAGES } from '@/features/landing/constants/stepStructureData';

interface StepStructureSectionProps {
  activeStep?: number;
  isTextVisible?: boolean;
}

export function StepStructureSection({
  activeStep = 0,
  isTextVisible = false,
}: StepStructureSectionProps) {
  const normalizedActiveStep = Math.min(
    Math.max(activeStep, 0),
    STEP_STRUCTURE_STAGES.length - 1,
  );

  return (
    <div className="relative h-[1024px] w-[1440px] overflow-visible bg-transparent">
      {/* 두 번째 섹션 상단 텍스트 등장 애니메이션 */}
      <div
        aria-hidden={!isTextVisible}
        className={[
          'pointer-events-none absolute inset-0 z-40',
          'transition-[opacity,transform] duration-[1300ms]',
          'ease-[cubic-bezier(0.22,1,0.36,1)]',
          'will-change-[opacity,transform]',
          'motion-reduce:translate-y-0',
          'motion-reduce:opacity-100',
          'motion-reduce:transition-none',
          isTextVisible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-12 opacity-0',
        ].join(' ')}
      >
        <p className="absolute left-[510px] top-[240px] w-[421px] text-center text-[32px] font-medium leading-[130%] tracking-[-0.01em] text-text-secondary">
          목표를 놓치지 않는 가장 쉬운 방법
        </p>

        <h2 className="absolute left-[274px] top-[298px] w-[893px] text-center text-[64px] font-bold leading-[130%] tracking-[-0.01em] text-text-strong">
          큰 목표부터 오늘 할 일까지, 3단계로
        </h2>
      </div>

      {STEP_STRUCTURE_STAGES.map((stage, stageIndex) => {
        const isActive = stageIndex === normalizedActiveStep;
        const hasPassed = stageIndex < normalizedActiveStep;

        const transitionClassName = isActive
          ? 'translate-y-0 scale-100 opacity-100'
          : hasPassed
            ? '-translate-y-8 scale-[0.98] opacity-0'
            : 'translate-y-8 scale-[0.98] opacity-0';

        return (
          <div
            key={stage.id}
            aria-hidden={!isActive}
            className={[
              'pointer-events-none absolute inset-0',
              /*
               * 단계 간 스크롤 거리는 늘리고 전환 시간은 줄여
               * 이전 단계와 다음 단계의 애니메이션이 겹치는 현상을 줄입니다.
               */
              'transition-[opacity,transform] duration-[800ms]',
              'ease-[cubic-bezier(0.22,1,0.36,1)]',
              'will-change-[opacity,transform]',
              'motion-reduce:translate-y-0',
              'motion-reduce:scale-100',
              'motion-reduce:opacity-100',
              'motion-reduce:transition-none',
              transitionClassName,
            ].join(' ')}
          >
            {stage.cards.map((card) => (
              <div
                key={card.id}
                className="absolute flex h-[200px] items-center overflow-hidden rounded-token-l bg-fill-inverse shadow-[0_0_50px_rgba(23,23,23,0.1)]"
                style={{
                  left: card.left,
                  top: card.top,
                  width: card.width,
                  zIndex: card.zIndex,
                }}
              >
                {card.title && card.description ? (
                  <div className="flex w-full min-w-0 items-center">
                    <strong
                      className={[
                        'ml-[137px] shrink-0 font-semibold leading-[130%] tracking-[-0.01em] text-text-strong',
                        card.titleClassName,
                      ].join(' ')}
                    >
                      {card.title}
                    </strong>

                    <span
                      className={[
                        'ml-[140px] min-w-0 truncate whitespace-nowrap font-semibold leading-[130%] tracking-[-0.01em] text-text-secondary',
                        card.descriptionClassName,
                      ].join(' ')}
                    >
                      {card.description}
                    </span>
                  </div>
                ) : null}
              </div>
            ))}

            <span className="absolute left-1/2 top-[622px] z-0 w-[max(1560px,100vw)] -translate-x-1/2 select-none whitespace-nowrap text-center text-[300px] font-semibold leading-[130%] tracking-[-0.01em] text-[#242424]/[0.02]">
              {stage.backgroundText}
            </span>
          </div>
        );
      })}

      <div
        aria-hidden="true"
        className="absolute bottom-[42px] left-1/2 z-50 flex -translate-x-1/2 gap-3"
      >
        {STEP_STRUCTURE_STAGES.map((stage, index) => (
          <span
            key={stage.id}
            className={[
              'h-2 rounded-full transition-[width,background-color] duration-[600ms]',
              index === normalizedActiveStep
                ? 'w-8 bg-text-strong'
                : 'w-2 bg-border-secondary',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}
