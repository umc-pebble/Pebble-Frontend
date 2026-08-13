import { Button } from '@/components/ui/Button';
import { useActivityLogs } from '@/features/activity';
import { useCalendarLayoutContext } from '@/features/calendar/context/useCalendarLayoutContext';
import { useRetryableAction } from '@/hooks/useRetryableAction';

import {
  getBridgePaletteByActivityColor,
  getBridgePaletteById,
} from '../constants/bridgeColorPalettes';
import { useSettings } from '../hooks/useSettings';
import type { SettingsTheme } from '../types/settings';
import { AccountSettingsSection } from './AccountSettingsSection';
import { DisplaySettingsSection } from './DisplaySettingsSection';
import { NotificationSettingsSection } from './NotificationSettingsSection';
import { SettingsContent } from './SettingsContent';
import { WithdrawalSection } from './WithdrawalSection';

export function SettingsView() {
  const { isSidebarOpen } =
    useCalendarLayoutContext();

  const {
    currentUser,
    settings,

    isLoading,
    loadError,
    updatingField,

    reload,
    changeTheme,
    changeNotification,
    changeActivityColor,
    markPasswordChanged,
  } = useSettings();

  const {
    logs: activityLogs,
    isLoading: isActivityLoading,
    isError: isActivityError,
    error: activityError,
    refetch: refetchActivityLogs,
  } = useActivityLogs({
    userId: currentUser?.id,
    enabled: Boolean(currentUser),
  });

  const { run } = useRetryableAction();

  if (isLoading) {
    return (
      <SettingsContent
        isSidebarOpen={isSidebarOpen}
      >
        <div className="flex min-h-[284px] items-center justify-center rounded-token-m bg-fill-surface shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)] dark:bg-[#141414]">
          <p className="text-body-02-m text-text-secondary">
            설정을 불러오는 중이에요.
          </p>
        </div>
      </SettingsContent>
    );
  }

  if (!currentUser || !settings) {
    return (
      <SettingsContent
        isSidebarOpen={isSidebarOpen}
      >
        <div className="flex min-h-[284px] flex-col items-center justify-center gap-token-l rounded-token-m bg-fill-surface shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)] dark:bg-[#141414]">
          <p
            role="alert"
            className="text-body-02-m text-fill-danger"
          >
            {loadError ||
              '설정 정보를 불러오지 못했어요.'}
          </p>

          <Button
            type="button"
            variant="primary"
            onClick={() => void reload()}
          >
            다시 시도
          </Button>
        </div>
      </SettingsContent>
    );
  }

  const selectedPalette =
    getBridgePaletteByActivityColor(
      settings.activityColor,
    );

  /*
   * 설정 전용 재시도 상태를 별도로 만들지 않고
   * 공통 전역 오류 토스트의 다시 시도 흐름을 사용합니다.
   */
  const executeRetryableChange = async (
    action: () => Promise<void>,
  ) => {
    const result = await run(action);

    /*
     * 하위 설정 컴포넌트에서도 요청 실패를 확인해야
     * 현재 선택값과 오류 상태를 유지할 수 있습니다.
     */
    if ('error' in result) {
      throw result.error;
    }
  };

  const handleThemeChange = async (
    nextTheme: SettingsTheme,
  ) => {
    await executeRetryableChange(
      async () => {
        await changeTheme(nextTheme);
      },
    );
  };

  const handleNotificationChange = async (
    nextEnabled: boolean,
  ) => {
    await executeRetryableChange(
      async () => {
        await changeNotification(nextEnabled);
      },
    );
  };

  const handleBridgePaletteChange = async (
    paletteId: string,
  ) => {
    const palette = getBridgePaletteById(paletteId);

    await executeRetryableChange(
      async () => {
        await changeActivityColor(
          palette.activityColor,
        );

        /*
         * 색상 변경 성공 후 활동기록을 다시 조회해
         * 미리보기와 서버 상태를 동기화합니다.
         */
        void refetchActivityLogs();
      },
    );
  };

  return (
    <SettingsContent
      isSidebarOpen={isSidebarOpen}
    >
      <DisplaySettingsSection
        theme={settings.theme}
        selectedBridgePaletteId={selectedPalette.id}
        activityLogs={activityLogs}
        isActivityLoading={isActivityLoading}
        isActivityError={isActivityError}
        activityErrorMessage={activityError?.message}
        isThemeUpdating={updatingField === 'theme'}
        isBridgeColorUpdating={
          updatingField === 'activityColor'
        }
        onThemeChange={handleThemeChange}
        onBridgePaletteChange={
          handleBridgePaletteChange
        }
        onActivityRetry={() =>
          void refetchActivityLogs()
        }
      />

      <NotificationSettingsSection
        enabled={settings.notifyTaskDue}
        isUpdating={updatingField === 'notification'}
        onChange={handleNotificationChange}
      />

      <AccountSettingsSection
        currentEmail={currentUser.email}
        isSocialAccount={settings.isSocialOnly}
        isTempPassword={settings.isTempPassword}
        onPasswordChanged={markPasswordChanged}
      />

      <WithdrawalSection />
    </SettingsContent>
  );
}
