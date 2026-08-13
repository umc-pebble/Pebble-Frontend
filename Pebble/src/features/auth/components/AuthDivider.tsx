export const AuthDivider = (): JSX.Element => {
  return (
    <div className="flex w-full items-center justify-center gap-[16px]">
      <div className="h-px flex-1 bg-border-secondary" />
      <span className="text-[14px] font-medium leading-[150%] tracking-[-0.14px] text-text-teritary">
        또는
      </span>
      <div className="h-px flex-1 bg-border-secondary" />
    </div>
  );
};
