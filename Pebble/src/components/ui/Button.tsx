import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'white' | 'cancel' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'dark-disabled-primary bg-btn-primary text-text-onFill before:bg-transparent hover:before:bg-[rgba(250,250,250,0.25)] active:before:bg-[rgba(250,250,250,0.4)] dark:disabled:opacity-100 dark:hover:before:bg-[rgba(23,23,23,0.05)] dark:active:before:bg-[rgba(23,23,23,0.1)]',
  secondary:
    'bg-btn-quaternary text-text-strong before:bg-transparent hover:before:bg-[rgba(23,23,23,0.05)] active:before:bg-[rgba(23,23,23,0.1)] dark:text-text-secondary dark:hover:before:bg-[rgba(250,250,250,0.08)] dark:active:before:bg-[rgba(250,250,250,0.14)]',
  white:
    'bg-fill-inverse text-text-strong before:bg-transparent hover:before:bg-[rgba(23,23,23,0.05)] active:before:bg-[rgba(23,23,23,0.1)] dark:border dark:border-border-secondary dark:hover:before:bg-[rgba(250,250,250,0.08)] dark:active:before:bg-[rgba(250,250,250,0.14)]',
  cancel:
    'bg-btn-pressed text-text-strong before:bg-transparent hover:before:bg-[rgba(250,250,250,0.18)] active:before:bg-[rgba(250,250,250,0.28)] dark:bg-btn-quaternary dark:text-text-strong dark:hover:before:bg-[rgba(23,23,23,0.15)] dark:active:before:bg-[rgba(23,23,23,0.25)]',
  danger:
    'bg-fill-danger text-text-onFill before:bg-transparent hover:before:bg-[rgba(250,250,250,0.25)] active:before:bg-[rgba(250,250,250,0.4)] dark:text-text-strong',
};

export function Button({
  children,
  variant = 'secondary',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'relative inline-flex h-11 shrink-0 items-center justify-center overflow-hidden',
        'rounded-token-s px-token-l',
        'text-body-02-m tracking-[-0.01em]',
        'transition-colors focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-border-primary',
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-token-s before:transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:before:bg-transparent',
        variantClassNames[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
