import { useEffect, useState } from 'react';

import UserIcon from '@/assets/icons/user-outline.svg?react';

import { Divider } from '@/components/ui/Divider';

import { EmailChangeItem } from './EmailChangeItem';
import { EmailChangeModal } from './EmailChangeModal';
import { PasswordChangeItem } from './PasswordChangeItem';
import { PasswordChangeModal } from './PasswordChangeModal';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionHeader } from './SettingsSectionHeader';

interface AccountSettingsSectionProps {
  currentEmail: string;
  isSocialAccount?: boolean;
  isTempPassword?: boolean;
  onPasswordChanged: () => void;
}

export function AccountSettingsSection({
  currentEmail,
  isSocialAccount = false,
  isTempPassword = false,
  onPasswordChanged,
}: AccountSettingsSectionProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (isTempPassword && !isSocialAccount) {
      setIsPasswordModalOpen(true);
    }
  }, [isSocialAccount, isTempPassword]);

  const handleOpenPasswordModal = () => {
    if (isSocialAccount) return;

    setIsPasswordModalOpen(true);
  };

  return (
    <>
      <SettingsSection className="min-h-[284px]">
        <SettingsSectionHeader icon={UserIcon} title="계정 관리" />

        {isTempPassword && !isSocialAccount ? (
          <p className="mt-token-m rounded-token-s bg-fill-danger-bg p-token-m text-body-02-m text-fill-danger">
            임시 비밀번호를 사용 중이에요. 새 비밀번호로 변경해 주세요.
          </p>
        ) : null}

        <div className="mt-token-l flex flex-col gap-token-l">
          <EmailChangeItem
            currentEmail={currentEmail}
            onOpen={() => setIsEmailModalOpen(true)}
          />

          <Divider />

          <PasswordChangeItem
            disabled={isSocialAccount}
            onClick={handleOpenPasswordModal}
          />
        </div>
      </SettingsSection>

      <EmailChangeModal
        open={isEmailModalOpen}
        currentEmail={currentEmail}
        onOpenChange={setIsEmailModalOpen}
      />

      <PasswordChangeModal
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
        onSuccess={onPasswordChanged}
      />
    </>
  );
}
