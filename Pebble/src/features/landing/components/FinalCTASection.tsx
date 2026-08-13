import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import ellipse7 from '@/assets/images/landing/final-cta-ellipse-7.svg';
import ellipse8 from '@/assets/images/landing/final-cta-ellipse-8.svg';

import { Button } from '@/components/ui/Button';
import { useInView } from '@/features/landing/hooks/useInView';

function FinalCTABackgroundShapes() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 z-0 h-full w-[max(1440px,100vw)] -translate-x-1/2 overflow-hidden"
    >
      <img
        src={ellipse8}
        alt=""
        className="absolute left-[-7.5%] top-[-277px] h-[max(1281px,88.9583vw)] w-[71.5972%] rotate-180 object-contain opacity-[65%] blur-[60px]"
      />

      <img
        src={ellipse7}
        alt=""
        className="absolute left-[43.6111%] top-[201px] h-[max(1260px,87.5vw)] w-[55.0694%] -rotate-180 object-contain"
      />
    </div>
  );
}

export function FinalCTASection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);

  const hasEntered = useInView(sectionRef, {
    threshold: 0.45,
  });

  const handleStartClick = () => {
    navigate('/signup');
  };

  return (
    <div
      ref={sectionRef}
      className="relative h-full w-full overflow-visible bg-transparent"
    >
      <FinalCTABackgroundShapes />

      <div className="relative z-10 h-full w-full">
        <div
          className={[
            'pointer-events-none absolute inset-0',
            'transition-[opacity,transform] duration-[1100ms]',
            'ease-in-out',
            'will-change-[opacity,transform]',
            'motion-reduce:translate-y-0',
            'motion-reduce:opacity-100',
            'motion-reduce:transition-none',
            hasEntered
              ? 'translate-y-0 opacity-100'
              : 'translate-y-[80px] opacity-0',
          ].join(' ')}
        >
          <h2 className="absolute left-[346px] top-[376px] h-[83px] w-[749px] text-center text-[64px] font-bold leading-[130%] tracking-[-0.01em] text-text-onFill">
            이제, 첫 조약돌을 놓아볼까요?
          </h2>

          <p className="absolute left-[474px] top-[487px] h-[31px] w-[491px] text-center text-[24px] font-medium leading-[130%] tracking-[-0.01em] text-text-quaternary">
            오늘의 작은 할 일이 목표까지 이어지는 첫걸음이 돼요
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="absolute left-[625px] top-[582px] h-[66px] w-[189px] rounded-token-s bg-fill-inverse px-token-xl py-0 font-sans !text-[20px] !font-semibold !leading-[130%] tracking-[-0.01em] text-text-strong shadow-[0_2px_10px_rgba(23,23,23,0.1)] hover:bg-fill-inverse"
          onClick={handleStartClick}
        >
          무료로 시작하기
        </Button>
      </div>
    </div>
  );
}
