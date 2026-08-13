import { useEffect, useMemo, useState } from "react";

import { getCategory } from "@/features/category/api/categoryApi";
import type { Category } from "@/types";

const mergeCategoryProgress = (
  category: Category,
  detail: Category | null,
): Category => {
  if (!detail || detail.id !== category.id) {
    return category;
  }

  return {
    ...category,
    taskTotalCount: detail.taskTotalCount,
    taskCompletedCount: detail.taskCompletedCount,
    progressRate: detail.progressRate,
  };
};

export const useCategoryDetail = (category?: Category) => {
  const [detail, setDetail] = useState<Category | null>(null);

  useEffect(() => {
    if (!category) {
      setDetail(null);
      return;
    }

    let isActive = true;
    setDetail(null);

    void getCategory(category.id)
      .then((nextDetail) => {
        if (isActive) {
          setDetail(nextDetail);
        }
      })
      .catch(() => {
        if (isActive) {
          setDetail(null);
        }
      });

    return () => {
      isActive = false;
    };
  }, [category]);

  return useMemo(
    () => (category ? mergeCategoryProgress(category, detail) : undefined),
    [category, detail],
  );
};
