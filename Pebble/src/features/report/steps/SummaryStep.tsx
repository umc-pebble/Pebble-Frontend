import { useCallback, useEffect, useState, type ReactNode } from 'react';

import {
  updateReportImage,
  uploadReportImage,
} from '../api/reportApi';
import { useReport } from '../context/ReportContext';
import { useReportNavigation } from '../hooks/useReportNavigation';
import { useSaveAsImage } from '../hooks/useSaveAsImage';
import { ScaledPreview } from '../components/ScaledPreview';
import { StepFooter } from '../components/StepFooter';
import { MonthlyPebbleSection } from '../sections/MonthlyPebbleSection';
import { BusiestCategorySection } from '../sections/BusiestCategorySection';
import { BusiestDaySection } from '../sections/BusiestDaySection';
import { SharedFriendsSection } from '../sections/SharedFriendsSection';
import reportBgTop from '@/assets/report/r003-bg-top.svg';
import reportBgBottom from '@/assets/report/r003-bg-bottom.svg';

/** Figma R007 저장 이미지 원본 크기 */
const COMPOSITE_WIDTH = 1120;
const COMPOSITE_HEIGHT = 1620;
/** 화면에서는 원본을 480px 너비로 축소해 미리 봅니다. PNG는 원본 크기로 저장됩니다. */
const MAX_PREVIEW_SCALE = 480 / COMPOSITE_WIDTH;

const pad2 = (value: number) => String(value).padStart(2, '0');

interface MiniReportProps {
  width: number;
  height: number;
  children: ReactNode;
  className?: string;
}

/**
 * 원본 R003~R006 카드 크기를 유지합니다.
 * 합본 전체의 화면 축소는 ScaledPreview 한 곳에서만 처리해 모든 간격의 비율을 보존합니다.
 */
function MiniReport({
  width,
  height,
  children,
  className = '',
}: MiniReportProps) {
  return (
    <div
      className={`shrink-0 overflow-hidden rounded-[20px] shadow-[0_30px_100px_rgba(23,23,23,0.05),inset_0_-3px_4px_#fff,inset_0_5px_8px_rgba(255,255,255,0.6)] ${className}`}
      style={{ width, height }}
    >
      {children}
    </div>
  );
}

/** 작은 높이의 브라우저에서도 버튼까지 한 화면에 담기 위한 화면 표시 배율 */
function useSummaryPreviewScale() {
  const getScale = () => {
    const viewportHeight = window.innerHeight;
    const topSpace = Math.min(127, Math.max(64, viewportHeight * 0.124));
    const footerGap = Math.min(55, Math.max(24, viewportHeight * 0.0534));
    const availableHeight =
      viewportHeight - topSpace - footerGap - 44 - 40;

    return Math.min(
      MAX_PREVIEW_SCALE,
      Math.max(0.28, availableHeight / COMPOSITE_HEIGHT),
    );
  };
  const [scale, setScale] = useState(getScale);

  useEffect(() => {
    const handleResize = () => setScale(getScale());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return scale;
}

/** R007 — 전체 리포트 합본 + PNG 저장 */
export function SummaryStep() {
  const { report } = useReport();
  const { goFirst } = useReportNavigation();
  const previewScale = useSummaryPreviewScale();
  const [isCaptureMode, setIsCaptureMode] = useState(false);

  const fileName = `pebble-report-${report.reportYear}-${pad2(report.reportMonth)}.png`;
  const persistReportImage = useCallback(
    async (file: File) => {
      if (!report.reportId) return;

      const reportImageUrl = await uploadReportImage(file);
      await updateReportImage(report.reportId, reportImageUrl);
    },
    [report.reportId],
  );
  const getSaveBackgroundColor = useCallback(
    () =>
      document.documentElement.classList.contains('dark')
        ? '#171717'
        : '#FFFFFF',
    [],
  );
  const {
    targetRef,
    save: saveImage,
    status,
    errorMessage,
  } = useSaveAsImage(fileName, {
    onImageCreated: persistReportImage,
    getBackgroundColor: getSaveBackgroundColor,
  });
  const isSaving = isCaptureMode || status === 'saving';

  const save = useCallback(async () => {
    if (isSaving) return;

    setIsCaptureMode(true);

    // 캡처 전용 배경과 조약돌이 DOM에 반영된 다음 PNG를 생성합니다.
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });

    try {
      await saveImage();
    } finally {
      setIsCaptureMode(false);
    }
  }, [isSaving, saveImage]);

  return (
    <div className="absolute inset-0 flex flex-col items-center pt-[clamp(64px,12.4vh,127px)]">
      <ScaledPreview width={COMPOSITE_WIDTH} scale={previewScale}>
        {/* 이 노드는 화면 표시 배율과 무관한 원본 크기로 PNG에 저장됩니다. */}
        <div
          ref={targetRef}
          className={`relative isolate flex h-[1620px] w-[1120px] flex-col gap-[36px] overflow-hidden rounded-[20px] bg-white p-[40px] dark:shadow-[0_0_28px_0_rgba(255,255,255,0.08)] ${
            isCaptureMode ? 'dark:bg-fill-surface' : 'dark:bg-fill-inverse'
          }`}
          style={
            isCaptureMode
              ? { backgroundColor: getSaveBackgroundColor() }
              : undefined
          }
        >
          {/* 화면 미리보기에서는 숨기고, 저장 이미지에만 포함하는 조약돌 배경 */}
          <img
            src={reportBgTop}
            alt=""
            aria-hidden="true"
            className={`pointer-events-none absolute left-[-225px] top-[-96px] z-0 h-[664px] w-[1164px] object-fill dark:brightness-[0.094] ${
              isCaptureMode ? 'visible' : 'invisible'
            }`}
          />
          <img
            src={reportBgBottom}
            alt=""
            aria-hidden="true"
            className={`pointer-events-none absolute left-[55px] top-[968px] z-0 h-[824px] w-[1428px] object-fill dark:brightness-[0.132] ${
              isCaptureMode ? 'visible' : 'invisible'
            }`}
          />

          {/* R003 — 이번 달 조약돌 */}
          <MiniReport
            width={1040}
            height={482}
            className="relative z-10 bg-[rgba(250,250,250,0.4)] px-[64px] dark:bg-[rgba(23,23,23,0.7)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.25),inset_0_5px_8px_rgba(255,255,255,0.6),inset_0_-3px_4px_#242424]"
          >
            <MonthlyPebbleSection report={report} darkTheme />
          </MiniReport>

          {/* R004 — 가장 바빴던 카테고리 */}
          <MiniReport
            width={1040}
            height={482}
            className="relative z-10 bg-[rgba(250,250,250,0.4)] px-[64px] dark:bg-[rgba(23,23,23,0.7)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.25),inset_0_5px_8px_rgba(255,255,255,0.6),inset_0_-3px_4px_#242424]"
          >
            <BusiestCategorySection
              category={report.busiestCategory}
              darkTheme
            />
          </MiniReport>

          {/* R005 + R006 — 가장 바빴던 하루와 함께한 친구 */}
          <div className="relative z-10 flex items-start gap-[36px]">
            <MiniReport
              width={600}
              height={504}
              className="bg-[rgba(250,250,250,0.25)] p-[40px] dark:bg-[rgba(23,23,23,0.4)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.25),inset_0_5px_8px_rgba(255,255,255,0.6),inset_0_-3px_4px_#242424]"
            >
              <BusiestDaySection day={report.busiestDay} darkTheme />
            </MiniReport>

            <MiniReport
              width={404}
              height={504}
              className="bg-[rgba(250,250,250,0.25)] p-[40px] dark:bg-[rgba(23,23,23,0.4)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.25),inset_0_5px_8px_rgba(255,255,255,0.6),inset_0_-3px_4px_#242424]"
            >
              <SharedFriendsSection
                sharedFriends={report.sharedFriends}
                month={report.reportMonth}
                darkTheme
              />
            </MiniReport>
          </div>
        </div>
      </ScaledPreview>

      {errorMessage && (
        <p
          role="alert"
          className="absolute left-1/2 top-[calc(100%-136px)] -translate-x-1/2 text-[14px] text-[#D9534F]"
        >
          {errorMessage}
        </p>
      )}

      <StepFooter
        className="mt-[clamp(24px,5.34vh,55px)]"
        secondary={{ label: '처음부터 다시 보기', onClick: goFirst }}
        primary={{
          label: isSaving ? '저장 중…' : '이미지로 저장하기',
          onClick: () => void save(),
          disabled: isSaving,
        }}
        secondaryClassName="dark:border-border-secondary dark:bg-fill-inverse dark:text-text-strong dark:hover:bg-btn-quaternary dark:focus-visible:outline-text-strong"
        primaryClassName="dark:bg-btn-primary dark:text-text-onFill dark:hover:opacity-90 dark:focus-visible:outline-text-strong"
      />
    </div>
  );
}
