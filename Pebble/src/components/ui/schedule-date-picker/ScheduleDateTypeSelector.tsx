import type { DateType } from '@/hooks/useScheduleDatePicker';

import { getSelectedDateTypeButtonStyle } from './scheduleDatePickerTheme';

type ScheduleDateTypeSelectorProps = {
  dateType: DateType;
  disabled: boolean;
  isTaskVariant: boolean;
  onDateTypeChange: (dateType: DateType) => void;
  themeBaseColor: string;
  themeMidColor: string;
};

const DATE_TYPES: DateType[] = ['하루', '기간', '다중'];

const DATE_TYPE_DESCRIPTIONS: Record<DateType, string> = {
  하루: '특정한 날만',
  기간: '시작부터 끝까지',
  다중: '여러 날을 골라 담아',
};

export const ScheduleDateTypeSelector = ({
  dateType,
  disabled,
  isTaskVariant,
  onDateTypeChange,
  themeBaseColor,
  themeMidColor,
}: ScheduleDateTypeSelectorProps) => {
  const getTypeButtonClass = (type: DateType) => {
    const baseClass =
      'group relative flex h-[73px] flex-1 flex-col items-start justify-center gap-1 overflow-hidden rounded-token-s px-5 py-3 transition-colors';
    const activeClass = 'text-text-onFill';
    const inactiveClass = isTaskVariant
      ? 'bg-btn-quaternary text-text-strong'
      : 'bg-fill-surface text-text-strong dark:bg-btn-quaternary';

    return `${baseClass} ${dateType === type ? activeClass : inactiveClass}`;
  };

  const getTypeButtonOverlayClass = (type: DateType) => {
    if (disabled) return '';

    return dateType === type
      ? 'group-hover:bg-[rgba(250,250,250,0.25)] group-active:bg-[rgba(250,250,250,0.4)]'
      : 'group-hover:bg-[rgba(23,23,23,0.05)] group-active:bg-[rgba(23,23,23,0.1)]';
  };

  return (
    <div className={`flex w-full gap-3 ${isTaskVariant ? 'mt-2' : ''}`}>
      {DATE_TYPES.map((type) => {
        const activeStyle = getSelectedDateTypeButtonStyle(
          type,
          themeBaseColor,
          themeMidColor,
        );
        const isActive = dateType === type;

        return (
          <button
            key={type}
            type="button"
            onClick={() => onDateTypeChange(type)}
            disabled={disabled}
            className={`${getTypeButtonClass(type)} disabled:cursor-not-allowed disabled:opacity-50`}
            style={isActive ? activeStyle : undefined}
          >
            <span
              className={`pointer-events-none absolute inset-0 transition-colors ${getTypeButtonOverlayClass(
                type,
              )}`}
              aria-hidden="true"
            />
            <span
              className={
                isTaskVariant
                  ? `relative z-10 text-[16px] font-medium leading-[1.5] tracking-[-0.16px] ${
                      isActive ? '' : 'text-text-strong'
                    }`
                  : `relative z-10 text-body-02-m ${
                      isActive ? '' : 'text-text-strong'
                    }`
              }
              style={isActive ? { color: activeStyle.color } : undefined}
            >
              {type}
            </span>
            <span
              className={`relative z-10 text-[14px] font-medium leading-[1.5] tracking-[-0.14px] ${
                isActive ? '' : 'text-text-secondary'
              }`}
              style={isActive ? { color: activeStyle.color } : undefined}
            >
              {DATE_TYPE_DESCRIPTIONS[type]}
            </span>
          </button>
        );
      })}
    </div>
  );
};
