interface FallbackNoticeProps {
  onRetry?: () => void;
}

/**
 * 서버 값을 못 받아 기본값(0)으로 그린 상태임을 알리는 안내.
 *
 * 화면에 0이 떠 있는데 아무 설명이 없으면 사용자는 그게 자기 기록이라고 믿습니다.
 * 이 컴포넌트가 그 오해를 막습니다. 지우실 거라면 토스트나 에러 화면 같은
 * 다른 안내 수단을 반드시 두세요.
 *
 * "기록이 0건인 정상 응답"에는 뜨지 않습니다. 그 경우는 EmptyState 가 담당합니다.
 */
export function FallbackNotice({ onRetry }: FallbackNoticeProps) {
  return (
    <div
      role="status"
      className="mx-auto mb-4 flex w-full max-w-3xl items-center justify-between gap-4 rounded-xl bg-[#F4F4F4] px-4 py-3"
    >
      <p className="text-sm text-[#8E8E8E]">
        기록을 불러오지 못했어요. 아래 숫자는 실제 기록이 아닙니다.
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-md text-sm font-semibold text-[#1A1A1A] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1A1A1A]"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
