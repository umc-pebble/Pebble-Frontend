import type { ReactNode } from "react";

type SidebarButtonAreaProps = {
  hasContent: boolean;
  hasHiddenContentUnderButton: boolean;
  children: ReactNode;
};

export const SidebarButtonArea = ({
  hasContent,
  hasHiddenContentUnderButton,
  children,
}: SidebarButtonAreaProps) => (
  <div
    className={`relative z-10 shrink-0 bg-fill-inverse transition-shadow ${
      hasContent ? "mt-2" : "mt-auto"
    } ${
      hasHiddenContentUnderButton
        ? "shadow-[0_-12px_24px_rgba(33,37,41,0.08)]"
        : "shadow-none"
    }`}
  >
    {children}
  </div>
);
