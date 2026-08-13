import type { HTMLAttributes, ReactNode } from 'react';

interface SettingsRowProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function SettingsRow({
  title,
  description,
  actions,
  className = '',
  ...props
}: SettingsRowProps) {
  return (
    <div
      className={[
        'flex min-h-12 items-center justify-between gap-token-l',
        'max-sm:flex-col max-sm:items-start',
        className,
      ].join(' ')}
      {...props}
    >
      <div className="min-w-0">
        <h3 className="text-[18px] font-semibold leading-[150%] tracking-[-0.01em] text-text-strong">
          {title}
        </h3>
        {description ? (
          <p className="mt-token-xs text-caption-01 text-text-secondary">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 items-center gap-token-m max-sm:self-end">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
