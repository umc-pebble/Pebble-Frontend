import type { ReactNode } from 'react';

interface LandingShellProps {
  children?: ReactNode;
}

export function LandingShell({ children }: LandingShellProps) {
  return (
    <div className="min-h-screen bg-fill-inverse font-sans text-text-strong">
      {children}
    </div>
  );
}