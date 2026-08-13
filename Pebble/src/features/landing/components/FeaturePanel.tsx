
import type { ReactNode } from 'react';

interface FeaturePanelProps {
  title: string;
  description: string;
  children: ReactNode;
  isActive: boolean;
  hasPassed: boolean;
  isSectionVisible: boolean;
}

export function FeaturePanel({
  title,
  description,
  children,
  isActive,
  hasPassed,
  isSectionVisible,
}: FeaturePanelProps) {
  const isVisible = isActive && isSectionVisible;

  const transitionClassName = !isSectionVisible
    ? 'translate-y-12 opacity-0'
    : isVisible
      ? 'translate-y-0 opacity-100'
      : hasPassed
        ? '-translate-y-12 opacity-0'
        : 'translate-y-12 opacity-0';

  return (
    <div
      aria-hidden={!isVisible}
      className={[
        'pointer-events-none absolute inset-0',
        isVisible ? 'z-20' : 'z-10',
      ].join(' ')}
    >
      {/* 패널 텍스트 */}
      <div
        className={[
          'absolute left-[100px] top-[263px] flex w-[626px] flex-col gap-[20px]',
          'transition-[opacity,transform] duration-[800ms]',
          'ease-[cubic-bezier(0.22,1,0.36,1)]',
          'will-change-[opacity,transform]',
          'motion-reduce:translate-y-0',
          'motion-reduce:opacity-100',
          'motion-reduce:transition-none',
          transitionClassName,
        ].join(' ')}
      >
        <h3 className="text-[40px] font-semibold leading-[130%] tracking-[-0.01em] text-text-strong">
          {title}
        </h3>

        <p className="text-[20px] font-medium leading-[130%] tracking-[-0.01em] text-text-secondary">
          {description}
        </p>
      </div>

      {/* 오른쪽 미리보기 */}
      <div
        className={[
          'absolute inset-0',
          'transition-[opacity,transform] duration-[800ms]',
          'ease-[cubic-bezier(0.22,1,0.36,1)]',
          'will-change-[opacity,transform]',
          'motion-reduce:translate-y-0',
          'motion-reduce:opacity-100',
          'motion-reduce:transition-none',
          transitionClassName,
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  );
}