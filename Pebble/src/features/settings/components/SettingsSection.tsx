import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface SettingsSectionProps extends ComponentPropsWithoutRef<'section'> {
  children: ReactNode;
}

export function SettingsSection({
  children,
  className = '',
  ...props
}: SettingsSectionProps) {
  return (
    <section
      className={[
        'w-full rounded-token-m bg-fill-surface dark:bg-[#141414]',
        'px-4 py-6 sm:px-8 sm:py-token-xl lg:px-[58px] lg:py-token-xxl',
        'shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)]',
        'transition-colors duration-200',
        className,
      ].join(' ')}
      {...props}
    >
      <div className="mx-auto w-full max-w-[808px]">{children}</div>
    </section>
  );
}
