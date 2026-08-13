import { useEffect, useRef, useState } from "react";

import type { Category, TaskItem } from "@/types";

type UseSidebarButtonShadowParams = {
  displayedCategories: Category[];
  displayedStandaloneTasks: TaskItem[];
  expandedCategories: Record<string, boolean>;
  viewMode: "card" | "list";
};

export const useSidebarButtonShadow = ({
  displayedCategories,
  displayedStandaloneTasks,
  expandedCategories,
  viewMode,
}: UseSidebarButtonShadowParams) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasHiddenContentUnderButton, setHasHiddenContentUnderButton] =
    useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const updateButtonShadow = () => {
      const hasOverflow =
        scrollContainer.scrollHeight > scrollContainer.clientHeight;
      const isScrolledToBottom =
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 1;

      setHasHiddenContentUnderButton(hasOverflow && !isScrolledToBottom);
    };

    updateButtonShadow();
    scrollContainer.addEventListener("scroll", updateButtonShadow);

    const resizeObserver = new ResizeObserver(updateButtonShadow);
    resizeObserver.observe(scrollContainer);

    return () => {
      scrollContainer.removeEventListener("scroll", updateButtonShadow);
      resizeObserver.disconnect();
    };
  }, [displayedCategories, displayedStandaloneTasks, expandedCategories, viewMode]);

  return {
    scrollContainerRef,
    hasHiddenContentUnderButton,
  };
};
