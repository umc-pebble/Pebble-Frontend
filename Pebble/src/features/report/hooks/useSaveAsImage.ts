import { useCallback, useRef, useState } from 'react';
import { toPng } from 'html-to-image';

import { SAVE_IMAGE_BACKGROUND } from '../constants/reportTheme';

export type SaveImageStatus = 'idle' | 'saving' | 'success' | 'error';

interface UseSaveAsImageResult {
  /** 캡처할 DOM 에 붙이는 ref */
  targetRef: React.RefObject<HTMLDivElement>;
  /** 저장 실행 */
  save: () => Promise<void>;
  status: SaveImageStatus;
  /** 실패 시 사용자에게 보여줄 메시지 */
  errorMessage: string | null;
}

interface UseSaveAsImageOptions {
  /** PNG 생성 후 서버 업로드 등 추가 저장 작업을 실행합니다. */
  onImageCreated?: (file: File) => Promise<void>;
  /** 캡처 시 사용할 불투명 배경색. 지정하지 않으면 기존 라이트 배경을 사용합니다. */
  getBackgroundColor?: () => string;
}

/** dataURL -> File. Web Share API 는 File 객체를 요구합니다 */
async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], fileName, { type: 'image/png' });
}

/** <a download> 로 내려받기 */
function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/** iPadOS의 데스크톱 UA까지 포함한 모바일 환경 판별 */
function isMobileDevice() {
  const userAgent = navigator.userAgent;
  return (
    /Android|iPhone|iPad|iPod/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1)
  );
}

/**
 * DOM 을 PNG 로 저장합니다. (R007 "이미지로 저장하기")
 *
 * 데스크톱은 곧바로 다운로드하고, 모바일에서는 공유 시트를 띄웁니다.
 * iOS Safari 는 <a download> 가 동작하지 않아서 Web Share API 가 필요합니다.
 * 공유를 지원하지 않는 환경이면 다운로드로 되돌아갑니다.
 *
 * ▼ 캡처가 깨질 때 확인할 것
 *  1. 외부 이미지(친구 아바타)는 CORS 허용이 필요합니다. CDN 응답에
 *     Access-Control-Allow-Origin 이 없으면 그 자리가 비어서 저장됩니다.
 *     <img crossOrigin="anonymous"> 도 함께 붙여야 합니다. (FriendRow 참고)
 *  2. 웹폰트가 늦게 로드되면 글자가 기본 폰트로 굳습니다. document.fonts.ready
 *     를 기다린 뒤 캡처합니다.
 *  3. position: fixed 요소는 캡처에 안 잡힙니다. 카드 안에 두지 마세요.
 */
export function useSaveAsImage(
  fileName: string,
  options: UseSaveAsImageOptions = {},
): UseSaveAsImageResult {
  const { onImageCreated, getBackgroundColor } = options;
  const targetRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<SaveImageStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const save = useCallback(async () => {
    const node = targetRef.current;
    if (!node) return;

    setStatus('saving');
    setErrorMessage(null);

    try {
      // 웹폰트가 다 로드된 뒤에 캡처해야 글자가 제대로 굳습니다
      if (document.fonts?.ready) await document.fonts.ready;

      const dataUrl = await toPng(node, {
        // 2배로 구워야 고해상도 화면에서 흐릿하지 않습니다
        pixelRatio: 2,
        backgroundColor: getBackgroundColor?.() ?? SAVE_IMAGE_BACKGROUND,
        // 캐시된 이미지가 CORS 없이 잡히는 문제를 피합니다
        cacheBust: true,
        // Pretendard 외부 CSS를 다시 내려받으려 하면 CDN/CORS 환경에 따라
        // PNG 생성이 실패합니다. 화면에 이미 로드된 폰트를 그대로 사용합니다.
        skipFonts: true,
      });

      const file = await dataUrlToFile(dataUrl, fileName);

      // 모바일: 공유 시트에서 사진 앱 저장을 선택할 수 있습니다.
      // PC는 공유 API를 지원하더라도 바로 PNG 파일로 내려받습니다.
      if (
        isMobileDevice() &&
        navigator.canShare?.({ files: [file] }) &&
        navigator.share
      ) {
        await navigator.share({ files: [file] });
      } else {
        downloadDataUrl(dataUrl, fileName);
      }

      // 기기 저장을 먼저 완료한 뒤 서버에 합본 이미지 URL을 연결합니다.
      // 서버 저장이 느려도 모바일 공유 시트의 사용자 제스처가 끊기지 않습니다.
      await onImageCreated?.(file);
      setStatus('success');
    } catch (error) {
      // 사용자가 공유 시트를 직접 닫은 경우는 실패가 아닙니다
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStatus('idle');
        return;
      }

      console.error('[useSaveAsImage] 이미지 저장 실패', error);
      setStatus('error');
      setErrorMessage('이미지를 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
    }
  }, [fileName, getBackgroundColor, onImageCreated]);

  return { targetRef, save, status, errorMessage };
}
