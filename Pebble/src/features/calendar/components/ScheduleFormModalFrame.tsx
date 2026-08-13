import type { ReactNode } from 'react';

import { ModalActionBar } from '@/components/ui/ModalActionBar';
import { ModalBackdrop } from '@/components/ui/ModalBackdrop';

type ScheduleFormModalFrameProps = {
  title: string;
  children: ReactNode;
  submitLabel: string;
  disabled: boolean;
  isBusy?: boolean;
  disabledReason?: string;
  onCancel: () => void;
  onSubmit: () => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  gapClassName?: string;
  titleClassName?: string;
};

export const ScheduleFormModalFrame = ({
  title,
  children,
  submitLabel,
  disabled,
  isBusy = false,
  disabledReason,
  onCancel,
  onSubmit,
  onDelete,
  gapClassName = 'gap-5',
  titleClassName = 'leading-[1.4]',
}: ScheduleFormModalFrameProps) => (
  <ModalBackdrop>
    <div
      className={[
        'relative flex w-[640px] flex-col max-sm:max-h-[calc(100dvh-32px)] max-sm:w-full max-sm:overflow-y-auto',
        'rounded-[32px] bg-fill-inverse p-8 shadow-shadow-m max-sm:rounded-token-m max-sm:p-4 dark:border-[0.5px] dark:border-border-secondary dark:shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)]',
        gapClassName,
      ].join(' ')}
    >
      <h2
        className={[
          'text-[24px] font-semibold tracking-[-0.24px] text-text-strong',
          titleClassName,
        ].join(' ')}
      >
        {title}
      </h2>

      {children}

      <div className="mt-4">
        <ModalActionBar
          submitLabel={submitLabel}
          disabled={disabled}
          isBusy={isBusy}
          disabledReason={disabledReason}
          onCancel={onCancel}
          onSubmit={onSubmit}
          onDelete={onDelete}
        />
      </div>
    </div>
  </ModalBackdrop>
);
