import { Button } from '@/components/ui/Button';

import { SettingsRow } from './SettingsRow';

interface EmailChangeItemProps {
  currentEmail: string;
  onOpen: () => void;
}

export function EmailChangeItem({
  currentEmail,
  onOpen,
}: EmailChangeItemProps) {
  return (
    <SettingsRow
      title="이메일"
      description="새 이메일로 변경하고 인증을 완료해야 적용돼요"
      actions={
        <>
          <span
            className="max-w-[185px] truncate text-body-02-m tracking-[-0.01em] text-text-primary"
            title={currentEmail}
          >
            {currentEmail}
          </span>
          <Button
            aria-label="이메일 변경"
            className="text-text-teritary"
            onClick={onOpen}
          >
            변경
          </Button>
        </>
      }
    />
  );
}
