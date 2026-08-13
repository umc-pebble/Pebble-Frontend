/* --------------------------------------------------------------------------
 *  리포트에서 쓰는 아이콘
 *
 *  전부 인라인 SVG 입니다. 아이콘 폰트나 외부 이미지를 쓰면 R007 이미지 저장
 *  시 깨질 수 있어서 의도적으로 인라인으로 둡니다.
 * ------------------------------------------------------------------------ */

interface IconProps {
  className?: string;
}

/** 완료 체크 */
export function CheckIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 8.5l3.2 3.2L13 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 미완료 엑스 */
export function CrossIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 리포트 닫기 */
export function CloseIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 2l12 12M14 2L2 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 아바타를 못 받았을 때 쓰는 기본 프로필 */
export function DefaultAvatarIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="16" fill="#EDEDED" />
      <circle cx="16" cy="13" r="5" fill="#C4C4C4" />
      <path
        d="M6 29c1.8-5.3 5.5-8 10-8s8.2 2.7 10 8"
        fill="#C4C4C4"
      />
    </svg>
  );
}

/**
 * 조약돌 일러스트 (임시 SVG)
 *
 * Figma 에서 해당 에셋을 SVG 로 export 한 뒤 이 함수 내용을 교체하세요.
 * <img> 로 바꾸실 거면 CORS 문제 때문에 같은 오리진에서 서빙해야 합니다.
 */
export function PebbleStackIllustration({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="40" cy="54" rx="26" ry="10" fill="#C4C4C4" />
      <ellipse cx="40" cy="38" rx="19" ry="9" fill="#B5B5B5" />
      <ellipse cx="40" cy="24" rx="11" ry="8" fill="#A6A6A6" />
    </svg>
  );
}
