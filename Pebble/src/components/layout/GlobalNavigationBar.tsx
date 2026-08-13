// src/components/layout/GlobalNavigationBar.tsx

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import BellOutlineIcon from '@/assets/icons/bell-outline no-dot.svg?react';
import CalendarOutlineIcon from '@/assets/icons/calendar-nav-default.svg?react';
import LogOutIcon from '@/assets/icons/Logout.svg?react';
import MyOutlineIcon from '@/assets/icons/user-outline.svg?react';
import SettingsOutlineIcon from '@/assets/icons/settings-outline.svg?react';
import SidebarCloseIcon from '@/assets/icons/sidebar-close.svg?react';
import SidebarOpenIcon from '@/assets/icons/sidebar-open.svg?react';
import SocialOutlineIcon from '@/assets/icons/social-outline.svg?react';
import SocialSolidIcon from '@/assets/icons/social-solid.svg?react';

import { AlarmPopover } from '@/features/alarm/components/AlarmPopover';
import { useAlarms } from '@/features/alarm/hooks/useAlarm';
import { logout } from '@/features/auth/api/authApi';
import { clearAuthTokens, getAccessToken } from '@/services/api';
import { LogoutConfirmModal } from './LogoutConfirmModal';

type GlobalNavigationBarProps = {
  variant?: 'embedded' | 'collapsed';
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
};

export const GlobalNavigationBar = ({
  variant = 'embedded',
  isSidebarOpen = true,
  onToggleSidebar,
}: GlobalNavigationBarProps) => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
  });

  const alarmButtonRef = useRef<HTMLButtonElement>(null);
  const {
    alarms,
    unreadCount,
    refreshAlarms,
    handleReadVisibleUnreadAlarms,
    handleDeleteAlarm,
    handleDeleteAllAlarms,
    handleRespondFollowRequest,
    handleRespondCategoryInvite,
  } = useAlarms();

  const navigateIfNeeded = (targetPath: string) => {
    if (pathname !== targetPath || search) {
      navigate(targetPath);
    }
  };

  const openAlarmPopover = async () => {
    try {
      await refreshAlarms();
    } catch {
      // 이전에 불러온 알림이 있다면 팝오버는 그대로 열어 접근 가능하게 둡니다.
    }
    const rect = alarmButtonRef.current?.getBoundingClientRect();

    if (rect) {
      setPopoverPosition({
        top: rect.top,
        left: rect.right + 24,
      });
    }

    setIsAlarmOpen(true);
  };

  const closeAlarmPopover = useCallback(async () => {
    try {
      await handleReadVisibleUnreadAlarms();
    } finally {
      setIsAlarmOpen(false);
    }
  }, [handleReadVisibleUnreadAlarms]);

  const toggleAlarmPopover = async () => {
    if (isAlarmOpen) {
      await closeAlarmPopover();
      return;
    }

    await openAlarmPopover();
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    // 서버 요청을 보내기 전에 로컬 세션부터 종료해 진행 중인 재발급 응답을 무효화합니다.
    const accessToken = getAccessToken();
    clearAuthTokens();

    try {
      await logout(accessToken);
    } finally {
      setIsLogoutModalOpen(false);
      setIsLoggingOut(false);
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      const target = event.target as Node;

      const isInsideButton = alarmButtonRef.current?.contains(target);
      const isInsidePopover =
        target instanceof Element && target.closest('[data-alarm-popover]');

      if (!isInsideButton && !isInsidePopover) {
        await closeAlarmPopover();
      }
    };

    if (isAlarmOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAlarmOpen, closeAlarmPopover]);

  const getNavigationButtonClassName = (active: boolean) =>
    [
      'size-11 relative flex items-center justify-center rounded-token-s',
      'cursor-pointer transition-colors',
      active
        ? 'bg-fill-primary text-text-onFill shadow-sm'
        : 'text-text-secondary hover:bg-fill-surface hover:text-text-strong dark:text-btn-primary dark:hover:text-btn-primary',
    ].join(' ');

  const isCalendarActive = pathname.startsWith('/calendar');
  const isHomeActive = pathname === '/' || pathname.startsWith('/home');
  const isMyPageActive = pathname.startsWith('/my');
  const isSettingsActive = pathname.startsWith('/settings');

  return (
    <nav
      className={[
        'relative z-50 h-full w-[84px] shrink-0 px-5 py-8',
        'bg-fill-inverse inline-flex flex-col justify-start items-center gap-10',
        'overflow-visible',
        variant === 'collapsed' ? 'rounded-token-m shadow-shadow-m' : '',
      ].join(' ')}
    >
      <div className="flex-1 flex flex-col justify-between items-center w-full">
        {/* 상단: 알림 그룹 */}
        <div className="flex flex-col justify-start items-center gap-5 w-full">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="size-11 relative flex items-center justify-center rounded-token-s cursor-pointer text-text-secondary transition-colors hover:bg-fill-surface hover:text-text-strong dark:text-btn-primary dark:hover:text-btn-primary"
              aria-label={isSidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
            >
              {isSidebarOpen ? (
                <SidebarCloseIcon className="size-6" />
              ) : (
                <SidebarOpenIcon className="size-6" />
              )}
            </button>
          )}

          <div className="size-11 relative flex items-center justify-center rounded-token-s">
            <button
              ref={alarmButtonRef}
              type="button"
              onClick={toggleAlarmPopover}
              className={`size-11 relative flex items-center justify-center rounded-token-s cursor-pointer transition-colors duration-[450ms] ease-in-out ${
                isAlarmOpen
                  ? 'bg-btn-primary text-text-onFill'
                  : 'text-text-secondary hover:bg-fill-surface hover:text-text-strong dark:text-btn-primary dark:hover:text-btn-primary'
              }`}
              aria-label="알림 목록 열기"
              aria-expanded={isAlarmOpen}
            >
              <BellOutlineIcon className="size-6" />

              {unreadCount > 0 && (
                <div className="size-1 absolute right-[10px] top-[10px] bg-fill-danger rounded-full" />
              )}
            </button>

            {isAlarmOpen && (
              <AlarmPopover
                top={popoverPosition.top}
                left={popoverPosition.left}
                alarms={alarms}
                onDelete={handleDeleteAlarm}
                onDeleteAll={handleDeleteAllAlarms}
                onRespondFollowRequest={handleRespondFollowRequest}
                onRespondCategoryInvite={handleRespondCategoryInvite}
              />
            )}
          </div>
        </div>

        {/* 중앙: 메뉴 그룹 */}
        <div className="flex flex-col justify-start items-center gap-10 w-full">
          <button
            type="button"
            onClick={() => navigateIfNeeded('/')}
            className={getNavigationButtonClassName(isHomeActive)}
            aria-label="홈 페이지로 이동"
            aria-current={isHomeActive ? 'page' : undefined}
          >
            {isHomeActive ? (
              <SocialSolidIcon className="size-6" />
            ) : (
              <SocialOutlineIcon className="size-6" />
            )}
          </button>

          <button
            type="button"
            onClick={() => navigateIfNeeded('/calendar')}
            className={getNavigationButtonClassName(isCalendarActive)}
            aria-label="캘린더 페이지로 이동"
            aria-current={isCalendarActive ? 'page' : undefined}
          >
            <CalendarOutlineIcon className="size-6" />
          </button>

          <button
            type="button"
            onClick={() => navigateIfNeeded('/my')}
            className={getNavigationButtonClassName(isMyPageActive)}
            aria-label="마이페이지로 이동"
            aria-current={isMyPageActive ? 'page' : undefined}
          >
            <MyOutlineIcon className="size-6" />
          </button>
        </div>

        {/* 하단: 설정 그룹 */}
        <div className="flex flex-col justify-start items-center gap-10 w-full">
          <button
            type="button"
            onClick={() => navigateIfNeeded('/settings')}
            className={getNavigationButtonClassName(isSettingsActive)}
            aria-label="설정 페이지로 이동"
            aria-current={isSettingsActive ? 'page' : undefined}
          >
            <SettingsOutlineIcon className="size-6" />
          </button>

          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className={getNavigationButtonClassName(false)}
            aria-label="로그아웃"
          >
            <LogOutIcon className="size-6" />
          </button>
        </div>
      </div>
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        isSubmitting={isLoggingOut}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </nav>
  );
};
