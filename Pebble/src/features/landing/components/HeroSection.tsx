// src/features/landing/components/HeroSection.tsx

import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';

import { HeroBackgroundShapes } from './HeroBackgroundShapes';
import { LandingCalendarPreview } from './LandingCalendarPreview';

import '../styles/heroAnimation.css';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative h-[1474px] w-[1440px] overflow-visible bg-transparent">
      <HeroBackgroundShapes />

      <div
        className="landing-hero-text-up absolute left-[257px] top-[268px] z-10 w-[926px] text-center"
        style={{ animationDelay: '100ms' }}
      >
        <h1 className="text-[72px] font-bold leading-[130%] tracking-[-0.01em] text-text-strong">
          큰 목표를 작은 조약돌처럼 하나씩
        </h1>
      </div>

      <p
        className="landing-hero-text-up absolute left-[433px] top-[394px] z-10 w-[573px] text-center text-[28px] font-medium leading-[160%] tracking-[-0.01em] text-text-secondary"
        style={{ animationDelay: '250ms' }}
      >
        흩어진 목표를 카테고리, 마일스톤, 태스크로 담고
        <br />
        오늘 할 일부터 오래 남을 성취까지 한눈에 관리하세요
      </p>

      {/* 버튼은 애니메이션 없이 항상 표시 */}
      <Button
        type="button"
        variant="primary"
        className="absolute left-[624px] top-[548px] z-20 h-[66px] w-[189px] rounded-token-s px-token-xl py-token-l font-sans !text-[20px] !font-semibold !leading-[130%] tracking-[-0.01em] shadow-[0_2px_10px_rgba(23,23,23,0.1)]"
        onClick={() => navigate('/signup')}
      >
        무료로 시작하기
      </Button>

      <LandingCalendarPreview
        className="landing-hero-pop-in"
        style={{ animationDelay: '1350ms' }}
      />
    </div>
  );
}
