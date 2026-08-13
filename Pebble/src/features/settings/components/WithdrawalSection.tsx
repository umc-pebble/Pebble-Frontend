import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CautionIcon from '@/assets/icons/Caution.svg?react';

import { Button } from '@/components/ui/Button';
import { clearAuthTokens } from '@/services/api';

import { deleteMyAccount } from '../api/settingsApi';
import { SettingsRow } from './SettingsRow';
import { SettingsSection } from './SettingsSection';
import { SettingsSectionHeader } from './SettingsSectionHeader';
import { WithdrawalConfirmModal } from './WithdrawalConfirmModal';

export function WithdrawalSection() {
  const navigate = useNavigate();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleWithdraw = async () => {
    if (isSubmitting) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await deleteMyAccount();
      clearAuthTokens();

      setIsConfirmModalOpen(false);
      navigate('/landing', { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '회원탈퇴 요청에 실패했어요. 다시 시도해 주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SettingsSection className="min-h-[195px]">
        <SettingsSectionHeader icon={CautionIcon} title="회원 탈퇴" />

        <div className="mt-token-l flex flex-col gap-token-l">
          <SettingsRow
            title="회원 탈퇴"
            description="모든 데이터가 삭제되며, 복구할 수 없어요"
            actions={
              <Button
                variant="danger"
                aria-label="회원 탈퇴 확인 모달 열기"
                onClick={() => setIsConfirmModalOpen(true)}
              >
                탈퇴하기
              </Button>
            }
          />
        </div>

        {errorMessage ? (
          <p className="mt-token-m text-caption-01 text-fill-danger">
            {errorMessage}
          </p>
        ) : null}
      </SettingsSection>

      <WithdrawalConfirmModal
        open={isConfirmModalOpen}
        isSubmitting={isSubmitting}
        onOpenChange={setIsConfirmModalOpen}
        onConfirm={() => void handleWithdraw()}
      />
    </>
  );
}