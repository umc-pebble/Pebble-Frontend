type SidebarDividerProps = {
  visible: boolean;
};

export const SidebarDivider = ({ visible }: SidebarDividerProps): JSX.Element | null => {
  if (!visible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="absolute bottom-3 left-[84px] top-[100px] z-20 w-px bg-btn-quaternary dark:bottom-0 dark:top-0 dark:bg-border-teritory"
    />
  );
};
