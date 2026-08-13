import type { ComponentType, SVGProps } from 'react';

interface SettingsSectionHeaderProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
}

export function SettingsSectionHeader({
  icon: Icon,
  title,
}: SettingsSectionHeaderProps) {
  return (
    <div className="flex h-[31px] items-center gap-token-s">
      <span
        aria-hidden="true"
        className="flex size-6 shrink-0 items-center justify-center text-text-strong"
      >
        <Icon className="size-6" />
      </span>
      <h2 className="text-title-02-sb tracking-[-0.01em] text-text-strong">
        {title}
      </h2>
    </div>
  );
}