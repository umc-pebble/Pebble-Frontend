import { useEffect, useId, useMemo, useState, type CSSProperties } from 'react';

import CloseIcon from '@/assets/icons/Close.svg?react';

import { Button } from '@/components/ui/Button';
import { ModalBackdrop } from '@/components/ui/ModalBackdrop';
import type { ActivityIntensity, NormalizedActivityLog } from '@/features/activity';

import {
  BRIDGE_COLOR_PALETTES,
  getBridgePaletteById,
  getBridgePaletteColors,
} from '../constants/bridgeColorPalettes';

interface BridgeColorModalProps {
  open: boolean;
  selectedPaletteId: string;
  activityLogs: NormalizedActivityLog[];
  isActivityLoading: boolean;
  isActivityError: boolean;
  activityErrorMessage?: string;
  onActivityRetry: () => void;
  onOpenChange: (open: boolean) => void;
  onConfirm: (paletteId: string) => Promise<void>;
}

interface ColorChipProps {
  color: string;
  darkColor?: string;
  size?: 'preview' | 'card';
}

function ColorChip({ color, darkColor = color, size = 'card' }: ColorChipProps) {
  const hasBorder = [color, darkColor].some((chipColor) =>
    ['#FAFAFA', '#1F1F1F'].includes(chipColor.toUpperCase()),
  );
  const chipStyle = {
    '--bridge-chip-color': color,
    '--bridge-chip-dark-color': darkColor,
  } as CSSProperties;

  return (
    <span
      className={[
        'shrink-0 rounded-token-s bg-[var(--bridge-chip-color)] dark:bg-[var(--bridge-chip-dark-color)]',
        size === 'preview' ? 'h-12 w-[75.43px]' : 'h-8 w-[33px]',
        hasBorder ? 'border border-border-secondary' : '',
      ].join(' ')}
      style={chipStyle}
      aria-hidden="true"
    />
  );
}

function PreviewSkeleton() {
  return (
    <div className="flex h-12 w-full gap-token-xs" aria-hidden="true">
      {Array.from({ length: 7 }, (_, index) => (
        <span
          key={index}
          className="h-12 w-[75.43px] shrink-0 animate-pulse rounded-token-s bg-fill-surface"
        />
      ))}
    </div>
  );
}

function getDarkActivityIntensity(intensity: ActivityIntensity) {
  if (intensity === 'level1') return 'level3';
  if (intensity === 'level3') return 'level1';

  return intensity;
}

function getActivityChipColors(
  colors: Record<ActivityIntensity, string>,
  intensity: ActivityIntensity,
  paletteId?: string,
) {
  const pebbleDarkColors: Record<ActivityIntensity, string> = {
    empty: '#1F1F1F',
    level1: '#5C5C5C',
    level2: '#ADADAD',
    level3: '#F8F8F8',
  };

  if (paletteId === 'pebble') {
    return {
      color: colors[intensity],
      darkColor: pebbleDarkColors[intensity],
    };
  }

  return {
    color: colors[intensity],
    darkColor:
      intensity === 'empty'
        ? '#1F1F1F'
        : colors[getDarkActivityIntensity(intensity)],
  };
}

function ActivityColorInfoTooltip() {
  const levels = [
    {
      label: '0개',
      className: 'bg-[#FAFAFA] dark:border dark:border-border-secondary dark:bg-[#1F1F1F]',
    },
    {
      label: '1~2개',
      className: 'bg-[#E3E3E3] dark:bg-[#666666]',
    },
    {
      label: '3~4개',
      className: 'bg-[#ADADAD]',
    },
    {
      label: '5개 이상',
      className: 'border border-border-secondary bg-fill-primary',
    },
  ];

  return (
    <span className="group relative inline-flex size-6 shrink-0 items-center justify-center">
      <button
        type="button"
        aria-label="완료 수별 징검다리 색상 설명 보기"
        className="flex size-6 items-center justify-center rounded-token-infinite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary"
      >
        <span className="flex size-[18px] items-center justify-center rounded-token-infinite border-[1.5px] border-[#D4D4D4] text-[12px] font-semibold leading-none text-[#D4D4D4] dark:border-btn-teritary dark:text-btn-teritary">
          !
        </span>
      </button>

      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-[30px] z-20 flex h-[173px] w-[214px] -translate-x-1/2 flex-col gap-token-m rounded-token-s bg-fill-primary px-token-l py-token-m text-left text-text-onFill opacity-0 shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)] transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
      >
        <span className="text-[13px] font-normal leading-[130%] tracking-normal text-text-onFill">
          완료한 일 수에 따라 색이 달라져요
        </span>

        <span className="flex h-[120px] w-[174px] flex-col gap-token-s">
          {levels.map((level) => (
            <span
              key={level.label}
              className="flex h-6 w-full items-center gap-token-s"
            >
              <span
                className={[
                  'h-6 w-8 shrink-0 rounded-token-xs',
                  level.className,
                ].join(' ')}
                aria-hidden="true"
              />
              <span className="h-[17px] whitespace-nowrap text-[13px] font-medium leading-[130%] tracking-[-0.01em] text-text-onFill">
                {level.label}
              </span>
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

export function BridgeColorModal({
  open,
  selectedPaletteId,
  activityLogs,
  isActivityLoading,
  isActivityError,
  activityErrorMessage,
  onActivityRetry,
  onOpenChange,
  onConfirm,
}: BridgeColorModalProps) {
  const titleId = useId();

  const [draftPaletteId, setDraftPaletteId] = useState(selectedPaletteId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (open) {
      setDraftPaletteId(selectedPaletteId);
      setIsSubmitting(false);
      setErrorMessage('');
    }
  }, [open, selectedPaletteId]);

  const draftPalette = useMemo(
    () => getBridgePaletteById(draftPaletteId),
    [draftPaletteId],
  );

  const previewColors = useMemo(
    () =>
      activityLogs.map((log) =>
        getActivityChipColors(
          draftPalette.colors,
          log.intensity,
          draftPalette.id,
        ),
      ),
    [activityLogs, draftPalette],
  );

  const hasChanged = draftPaletteId !== selectedPaletteId;

  const handleClose = () => {
    if (isSubmitting) return;

    onOpenChange(false);
  };

  const handleConfirm = async () => {
    if (!hasChanged || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await onConfirm(draftPaletteId);
      onOpenChange(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '징검다리 색상을 변경하지 못했어요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <ModalBackdrop
      className="overflow-hidden"
      role="presentation"
      onMouseDown={handleClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-[547px] w-[640px] flex-col gap-token-l rounded-token-l bg-fill-inverse p-token-xl shadow-shadow-m max-sm:h-auto max-sm:max-h-[calc(100dvh-32px)] max-sm:w-full max-sm:overflow-y-auto max-sm:rounded-token-m max-sm:p-4 dark:border-[0.5px] dark:border-border-secondary dark:shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex h-11 w-full items-start justify-between">
          <h2
            id={titleId}
            className="text-title-02-sb tracking-[-0.01em] text-text-strong"
          >
            징검다리 색상
          </h2>

          <button
            type="button"
            disabled={isSubmitting}
            aria-label="징검다리 색상 모달 닫기"
            className="flex size-11 items-start justify-end text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleClose}
          >
            <CloseIcon className="size-6" aria-hidden="true" />
          </button>
        </header>

        <div className="flex h-[83px] w-full flex-col gap-token-xs max-sm:h-auto max-sm:min-h-[83px]">
          <div className="flex h-[27px] items-center gap-token-xs max-sm:h-auto max-sm:min-h-[27px]">
            <p className="text-[18px] font-medium leading-[150%] tracking-[-0.01em] text-text-primary">
              <span>{draftPalette.name}</span>
              <span className="text-[#A3A3A3] dark:text-text-teritary"> · 최근 7일 미리보기</span>
            </p>
            <ActivityColorInfoTooltip />
          </div>

          {isActivityLoading ? (
            <PreviewSkeleton />
          ) : isActivityError ? (
            <div className="flex h-12 items-center justify-between rounded-token-s bg-fill-surface px-token-m">
              <p className="text-caption-01 text-fill-danger">
                {activityErrorMessage || '활동기록을 불러오지 못했어요.'}
              </p>

              <button
                type="button"
                className="text-caption-01 font-semibold text-text-strong underline"
                onClick={onActivityRetry}
              >
                다시 시도
              </button>
            </div>
          ) : (
            <div className="flex h-12 w-full gap-token-xs">
              {previewColors.map((color, index) => (
                <ColorChip
                  key={`${draftPaletteId}-${color.color}-${index}`}
                  color={color.color}
                  darkColor={color.darkColor}
                  size="preview"
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid h-[228px] w-full grid-cols-3 grid-rows-2 gap-token-m max-sm:h-auto max-sm:grid-cols-2 max-sm:gap-token-s">
          {BRIDGE_COLOR_PALETTES.map((palette) => {
            const isSelected = palette.id === draftPaletteId;
            const colors = getBridgePaletteColors(palette);
            const pebbleDarkColors = ['#1F1F1F', '#5C5C5C', '#ADADAD', '#F8F8F8'];

            return (
              <button
                key={palette.id}
                type="button"
                disabled={isSubmitting}
                aria-pressed={isSelected}
                aria-label={`${palette.name} ${palette.tone} 색상 선택`}
                className={[
                  'flex h-[108px] w-[184px] flex-col gap-token-m rounded-token-s bg-fill-surface p-token-l text-left max-sm:w-full max-sm:min-w-0 max-sm:p-token-m',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary',
                  'disabled:cursor-not-allowed',
                  isSelected
                    ? 'border-2 border-border-primary'
                    : 'border-2 border-transparent',
                ].join(' ')}
                onClick={() => setDraftPaletteId(palette.id)}
              >
                <span className="flex h-6 items-center gap-token-xs">
                  <span className="text-body-02-m tracking-[-0.01em] text-text-strong">
                    {palette.name}
                  </span>

                  <span className="text-[14px] font-medium leading-[150%] tracking-[-0.01em] text-text-teritary">
                    {palette.tone}
                  </span>
                </span>

                <span className="flex h-8 gap-token-xs">
                  {colors.map((color, index) => (
                    <ColorChip
                      key={`${palette.id}-${color}-${index}`}
                      color={color}
                      darkColor={
                        palette.id === 'pebble'
                          ? pebbleDarkColors[index] ?? color
                          : index === 0
                            ? '#1F1F1F'
                            : colors[4 - index] ?? color
                      }
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        {errorMessage ? (
          <p className="text-caption-01 text-fill-danger">{errorMessage}</p>
        ) : null}

        <div className="mt-auto flex h-11 w-full gap-token-m">
          <Button
            type="button"
            variant="cancel"
            disabled={isSubmitting}
            className="h-11 w-[282px] max-sm:min-w-0 max-sm:flex-1"
            onClick={handleClose}
          >
            취소
          </Button>

          <Button
            type="button"
            variant="primary"
            disabled={!hasChanged || isSubmitting}
            className="h-11 w-[282px] disabled:opacity-100 max-sm:min-w-0 max-sm:flex-1"
            onClick={() => void handleConfirm()}
          >
            {isSubmitting ? '변경 중...' : '변경'}
          </Button>
        </div>
      </section>
    </ModalBackdrop>
  );
}
