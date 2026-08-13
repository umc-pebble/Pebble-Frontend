
import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

interface UseLockedStepScrollParams {
  sectionRef: RefObject<HTMLElement>;
  stepCount: number;
  stepScrollDistance: number;
  transitionDuration: number;
}

const BLOCKED_SCROLL_KEYS = new Set([
  'ArrowDown',
  'ArrowUp',
  'PageDown',
  'PageUp',
  ' ',
]);

function clampStep(step: number, stepCount: number) {
  return Math.min(stepCount - 1, Math.max(0, step));
}

export function useLockedStepScroll({
  sectionRef,
  stepCount,
  stepScrollDistance,
  transitionDuration,
}: UseLockedStepScrollParams) {
  const [activeStep, setActiveStep] = useState(0);

  const activeStepRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const isInitializedRef = useRef(false);
  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let animationFrameId = 0;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const clearTransitionTimer = () => {
      if (transitionTimerRef.current === null) {
        return;
      }

      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    };

    const unlockTransition = () => {
      clearTransitionTimer();
      isTransitioningRef.current = false;
    };

    const lockTransition = () => {
      if (prefersReducedMotion || transitionDuration <= 0) {
        isTransitioningRef.current = false;
        return;
      }

      clearTransitionTimer();
      isTransitioningRef.current = true;

      transitionTimerRef.current = window.setTimeout(() => {
        isTransitioningRef.current = false;
        transitionTimerRef.current = null;
      }, transitionDuration);
    };

    const isSectionPinned = () => {
      const section = sectionRef.current;

      if (!section) {
        return false;
      }

      const sectionRect = section.getBoundingClientRect();

      // 브라우저의 소수점 단위 위치 오차를 고려합니다.
      return (
        sectionRect.top <= 1 &&
        sectionRect.bottom >= window.innerHeight - 1
      );
    };

    const moveToStep = (direction: 1 | -1) => {
      const section = sectionRef.current;

      if (!section || stepCount <= 0) {
        return false;
      }

      const previousStep = activeStepRef.current;

      const nextStep = clampStep(
        previousStep + direction,
        stepCount,
      );

      /*
       * 첫 카드에서 위로 이동하거나 마지막 카드에서 아래로 이동하면
       * 내부에서 이동할 단계가 없으므로 페이지 스크롤을 허용합니다.
       */
      if (nextStep === previousStep) {
        return false;
      }

      const sectionRect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + sectionRect.top;

      activeStepRef.current = nextStep;
      setActiveStep(nextStep);

      lockTransition();

      /*
       * wheel 기본 동작을 차단한 상태에서 실행되므로
       * 화면이 내려갔다가 다시 올라오는 현상이 발생하지 않습니다.
       */
      window.scrollTo({
        top: sectionTop + nextStep * stepScrollDistance,
        behavior: 'auto',
      });

      return true;
    };

    const updateActiveStep = () => {
      animationFrameId = 0;

      const section = sectionRef.current;

      if (!section || stepCount <= 0) {
        return;
      }

      if (isTransitioningRef.current) {
        return;
      }

      const sectionRect = section.getBoundingClientRect();

      const passedDistance = Math.max(-sectionRect.top, 0);

      const targetStep = clampStep(
        Math.floor(passedDistance / stepScrollDistance),
        stepCount,
      );

      /*
       * 새로고침 또는 스크롤바 직접 이동으로 섹션 중간에 진입했을 때
       * 현재 위치에 해당하는 단계를 즉시 적용합니다.
       */
      if (!isInitializedRef.current) {
        isInitializedRef.current = true;
        activeStepRef.current = targetStep;
        setActiveStep(targetStep);
        return;
      }

      /*
       * wheel과 키보드 입력은 각 입력 핸들러에서 단계 변경을 처리합니다.
       * 여기서는 스크롤바 드래그나 직접적인 위치 이동만 동기화합니다.
       */
      if (
        !isSectionPinned() &&
        targetStep !== activeStepRef.current
      ) {
        activeStepRef.current = targetStep;
        setActiveStep(targetStep);
      }
    };

    const requestStepUpdate = () => {
      if (animationFrameId !== 0) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(
        updateActiveStep,
      );
    };

    const handleWheel = (event: WheelEvent) => {
      if (!isSectionPinned()) {
        return;
      }

      /*
       * 카드 애니메이션이 진행 중이면
       * 위·아래 방향 모두 추가 스크롤을 차단합니다.
       */
      if (isTransitioningRef.current) {
        event.preventDefault();
        return;
      }

      if (event.deltaY === 0) {
        return;
      }

      const direction: 1 | -1 =
        event.deltaY > 0 ? 1 : -1;

      const previousStep = activeStepRef.current;

      const nextStep = clampStep(
        previousStep + direction,
        stepCount,
      );

      /*
       * 섹션 내부에서 이동할 카드가 있다면 브라우저가 먼저
       * 스크롤하지 않도록 막은 다음 단계를 변경합니다.
       */
      if (nextStep !== previousStep) {
        event.preventDefault();
        moveToStep(direction);
      }

      /*
       * 첫 카드에서 위로 이동하거나 마지막 카드에서 아래로 이동하면
       * preventDefault를 호출하지 않아 이전·다음 섹션으로 이동합니다.
       */
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (
        !isTransitioningRef.current ||
        !isSectionPinned()
      ) {
        return;
      }

      event.preventDefault();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !isSectionPinned() ||
        !BLOCKED_SCROLL_KEYS.has(event.key)
      ) {
        return;
      }

      if (isTransitioningRef.current) {
        event.preventDefault();
        return;
      }

      let direction: 1 | -1;

      if (
        event.key === 'ArrowUp' ||
        event.key === 'PageUp' ||
        (event.key === ' ' && event.shiftKey)
      ) {
        direction = -1;
      } else {
        direction = 1;
      }

      const previousStep = activeStepRef.current;

      const nextStep = clampStep(
        previousStep + direction,
        stepCount,
      );

      if (nextStep !== previousStep) {
        event.preventDefault();
        moveToStep(direction);
      }
    };

    updateActiveStep();

    window.addEventListener('scroll', requestStepUpdate, {
      passive: true,
    });

    window.addEventListener('resize', requestStepUpdate);

    window.addEventListener('wheel', handleWheel, {
      passive: false,
    });

    window.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', requestStepUpdate);
      window.removeEventListener('resize', requestStepUpdate);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);

      if (animationFrameId !== 0) {
        window.cancelAnimationFrame(animationFrameId);
      }

      unlockTransition();
    };
  }, [
    sectionRef,
    stepCount,
    stepScrollDistance,
    transitionDuration,
  ]);

  return activeStep;
}