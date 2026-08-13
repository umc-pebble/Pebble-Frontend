interface StepFooterProps {
  /** 좌측 보조 버튼. 없으면 다음 버튼만 가운데가 아닌 우측 자리에 놓입니다 */
  secondary?: { label: string; onClick: () => void };
  /** 우측 주요 버튼 */
  primary: { label: string; onClick: () => void; disabled?: boolean };
  /** 단계별 카드 높이에 따른 상단 여백 조정 */
  className?: string;
  /** 특정 단계에서 주요 버튼 색상만 추가로 덮어쓸 때 사용합니다. */
  primaryClassName?: string;
  /** 특정 단계에서 보조 버튼 색상만 추가로 덮어쓸 때 사용합니다. */
  secondaryClassName?: string;
}

const BASE =
  'h-[44px] rounded-[12px] px-[20px] text-[16px] font-medium leading-[150%] tracking-[-0.16px] transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#171717] disabled:cursor-not-allowed disabled:opacity-60';

/**
 * 단계 하단 버튼 묶음.
 *
 * R003 은 "다음으로" 하나, R004~R006 은 "이전으로 / 다음으로",
 * R007 은 "처음부터 다시 보기 / 이미지로 저장하기" 로 씁니다.
 */
export function StepFooter({
  secondary,
  primary,
  className = 'mt-[40px]',
  primaryClassName = '',
  secondaryClassName = '',
}: StepFooterProps) {
  return (
    <div
      className={`${className} flex gap-[20px] ${
        secondary ? 'w-[772px]' : 'w-[376px]'
      }`}
    >
      {secondary && (
        <button
          type="button"
          onClick={secondary.onClick}
          className={`${BASE} w-[376px] border border-[#D4D4D4] bg-white text-[#171717] hover:bg-[#FAFAFA] ${secondaryClassName}`}
        >
          {secondary.label}
        </button>
      )}

      <button
        type="button"
        onClick={primary.onClick}
        disabled={primary.disabled}
        className={`${BASE} w-[376px] bg-[#171717] text-white hover:opacity-90 ${primaryClassName}`}
      >
        {primary.label}
      </button>
    </div>
  );
}
