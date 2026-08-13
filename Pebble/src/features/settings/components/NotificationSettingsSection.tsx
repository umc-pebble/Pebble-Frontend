import { useState } from 'react';

import BellIcon from '@/assets/icons/bell-outline no-dot.svg?react';

import { ToggleSwitch } from '@/components/ui/ToggleSwitch';

import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionHeader } from './SettingsSectionHeader';

interface NotificationSettingsSectionProps {
  enabled: boolean;
  isUpdating: boolean;
  onChange: (enabled: boolean) => Promise<void>;
}

export function NotificationSettingsSection({
  enabled,
  isUpdating,
  onChange,
}: NotificationSettingsSectionProps) {
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = async (nextEnabled: boolean) => {
    setErrorMessage('');

    try {
      await onChange(nextEnabled);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '알림 설정을 변경하지 못했어요.',
      );
    }
  };

  return (
    <SettingsSection className="min-h-[192px]">
      <SettingsSectionHeader icon={BellIcon} title="알림" />

      <div className="mt-token-l flex flex-col gap-token-l">
        <SettingsRow
          title="당일 일정 알림"
          description="오늘 예정된 일정을 아침에 알려드려요"
          actions={
            <ToggleSwitch
              checked={enabled}
              disabled={isUpdating}
              aria-label="당일 일정 알림"
              onCheckedChange={(checked) => void handleChange(checked)}
            />
          }
        />

        {errorMessage ? (
          <p className="text-caption-01 text-fill-danger">{errorMessage}</p>
        ) : null}
      </div>
    </SettingsSection>
  );
}
