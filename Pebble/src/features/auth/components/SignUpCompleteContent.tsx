interface SignUpCompleteContentProps {
  nickname: string;
  profileSrc: string;
  onGoToSchedule: () => void;
}

export const SignUpCompleteContent = ({
  nickname,
  profileSrc,
  onGoToSchedule,
}: SignUpCompleteContentProps): JSX.Element => {
  return (
    <section
      className="w-full max-w-[570px] p-[32px] flex flex-col items-center gap-[40px] rounded-[20px] bg-transparent"
      style={{ fontFamily: "Pretendard, sans-serif" }}
    >
      <h1 className="text-[23px] leading-[130%] font-medium tracking-[-0.23px] text-text-primary">
        환영합니다!
      </h1>

      <div className="w-[200px] h-[200px] rounded-full overflow-hidden border border-border-secondary bg-fill-surface">
        <img src={profileSrc} alt={`${nickname}님의 프로필`} className="w-full h-full object-cover" />
      </div>

      <p className="text-center text-[15px] leading-[150%] font-normal tracking-[-0.15px]">
        <span className="text-text-strong">{nickname}</span>
        <span className="text-text-secondary">님 가입이 완료되었어요. 오늘의 조약돌을 차곡차곡 쌓아 보세요!</span>
      </p>

      <button
        type="button"
        onClick={onGoToSchedule}
        className="w-full h-[52px] rounded-[12px] bg-btn-primary text-center text-[15px] leading-[150%] font-normal tracking-[-0.15px] text-text-onFill hover:brightness-95 transition-colors"
      >
        내 일정 기록하러 가기
      </button>
    </section>
  );
};
