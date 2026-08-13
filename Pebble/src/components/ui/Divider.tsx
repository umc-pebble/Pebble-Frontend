import type { HTMLAttributes } from 'react';

type DividerProps = HTMLAttributes<HTMLHRElement> & {
  thickness?: 1 | 2;
};

export function Divider({ className = '', thickness = 1, ...props }: DividerProps) {
  return (
    <hr
      aria-hidden="true"
      className={[
        'w-full shrink-0 rounded-token-infinite border-0',
        thickness === 1
          ? 'h-px bg-border-teritory'
          : 'h-0.5 bg-border-secondary',
        className,
      ].join(' ')}
      {...props}
    />
  );
}
