// src/features/landing/hooks/useInView.ts

import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useInView<T extends Element>(
  targetRef: RefObject<T | null>,
  {
    threshold = 0.25,
    rootMargin = '0px',
  }: UseInViewOptions = {},
) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const target = targetRef.current;

    if (!target) return;

    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, targetRef, threshold]);

  return isInView;
}