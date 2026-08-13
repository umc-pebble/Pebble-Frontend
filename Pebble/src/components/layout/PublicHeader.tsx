// src/components/layout/PublicHeader.tsx

import { Link, useNavigate } from 'react-router-dom';

import pebbleLogo from '@/assets/icons/Logo_Pebble 3.svg';
import { Button } from '@/components/ui/Button';

type PublicHeaderVariant = 'landing' | 'auth';

interface PublicHeaderProps {
  variant?: PublicHeaderVariant;
  /** 인증 폼처럼 헤더 높이를 64px로 줄여야 하는 화면에서만 사용합니다. */
  compact?: boolean;
}

export function PublicHeader({
  variant = 'auth',
  compact = false,
}: PublicHeaderProps) {
  const navigate = useNavigate();
  const showActions = variant === 'landing';

  return (
    <header
      className={`${compact ? 'h-[64px]' : 'h-[84px]'} w-full bg-transparent [font-family:'Pretendard',sans-serif]`}
    >
      <div
        className={`flex h-full w-full items-center justify-between px-[64px] ${compact ? '' : 'py-[20px]'}`}
      >
        <Link
          to="/landing"
          aria-label="Pebble 랜딩 페이지로 이동"
          className="flex h-[44px] w-[122px] shrink-0 cursor-pointer select-none items-center gap-[4px]"
        >
          <img
            src={pebbleLogo}
            alt=""
            className="h-[44px] w-[44px] shrink-0 object-contain"
          />

          <span
            className={[
              "h-[23px] w-[74px] shrink-0 text-[20px] font-bold leading-none tracking-normal [font-family:'LaundryGothic',sans-serif]",
              variant === 'auth' ? 'text-text-strong' : 'text-[#171717]',
            ].join(' ')}
          >
            Pebble
          </span>
        </Link>

        {showActions ? (
          <div className="flex h-[44px] w-[252px] shrink-0 items-center gap-[12px]">
            <Button
              variant="secondary"
              className="h-[44px] w-[87px] shrink-0 whitespace-nowrap rounded-token-s px-token-l py-0 text-[18px] font-medium leading-[150%] text-[#171717] [font-family:'Pretendard',sans-serif]"
              onClick={() => navigate('/login')}
            >
              로그인
            </Button>

            <Button
              variant="primary"
              className="h-[44px] w-[153px] shrink-0 whitespace-nowrap rounded-token-s px-token-l py-0 text-[18px] font-medium leading-[150%] text-white [font-family:'Pretendard',sans-serif]"
              onClick={() => navigate('/signup')}
            >
              무료로 시작하기
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
