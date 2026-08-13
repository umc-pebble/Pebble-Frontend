import type { ReactNode } from 'react';

interface SettingsContentProps {
  children: ReactNode;
  isSidebarOpen: boolean;
}

export function SettingsContent({
  children,
  isSidebarOpen,
}: SettingsContentProps) {
  return (
    <main
      className={`relative h-[1000px] shrink-0 overflow-visible bg-transparent transition-all duration-300 ${
        isSidebarOpen ? "w-[924px]" : "w-[1316px]"
      } max-xl:h-auto max-xl:min-h-[calc(100vh-116px)] max-xl:w-full`}
    >
      <div className="flex h-full w-full flex-col gap-token-m overflow-y-auto p-0 max-xl:pb-6 xl:-m-[28px] xl:h-[calc(100%+56px)] xl:w-[calc(100%+56px)] xl:p-[28px] custom-scrollbar">
        {children}
      </div>
    </main>
  );
}
