// src/features/settings/components/PasswordChangeItem.tsx

import { Button } from '@/components/ui/Button';

import { SettingsRow } from './SettingsRow';

interface PasswordChangeItemProps {
  disabled?: boolean;
  onClick: () => void;
}

export function PasswordChangeItem({
  disabled = false,
  onClick,
}: PasswordChangeItemProps) {
  return (
    <SettingsRow
      title="비밀번호"
      description={
        disabled
          ? '소셜 로그인 계정은 비밀번호를 변경할 수 없어요'
          : '현재 비밀번호를 확인한 뒤 새 비밀번호를 설정해요'
      }
      actions={
        <Button
          type="button"
          disabled={disabled}
          className="text-text-teritary"
          aria-label={
            disabled
              ? '소셜 로그인 계정은 비밀번호를 변경할 수 없어요'
              : '비밀번호 변경'
          }
          onClick={onClick}
        >
          변경
        </Button>
      }
    />
  );
}
