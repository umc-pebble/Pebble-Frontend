import { ScheduleDateTypeSelector } from '@/components/ui/schedule-date-picker/ScheduleDateTypeSelector';
import { ScheduleMonthCalendar } from '@/components/ui/schedule-date-picker/ScheduleMonthCalendar';
import type { DateType, DayStatus } from '@/hooks/useScheduleDatePicker';

type ScheduleDatePickerVariant = 'milestone' | 'task';

type ScheduleDatePickerProps = {
  variant: ScheduleDatePickerVariant;
  dateType: DateType;
  onDateTypeChange: (dateType: DateType) => void;
  currentYear: number;
  currentMonth: number;
  daysInMonth: number;
  firstDay: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateClick: (day: number) => void;
  getDayStatus: (day: number) => DayStatus;
  themeBaseColor?: string;
  themeMidColor?: string;
  themeLightColor?: string;
  disabled?: boolean;
};

export const ScheduleDatePicker = ({
  variant,
  dateType,
  onDateTypeChange,
  currentYear,
  currentMonth,
  daysInMonth,
  firstDay,
  onPrevMonth,
  onNextMonth,
  onDateClick,
  getDayStatus,
  themeBaseColor = '#171717',
  themeMidColor = '#171717',
  themeLightColor = 'rgba(23, 23, 23, 0.05)',
  disabled = false,
}: ScheduleDatePickerProps) => {
  const isTaskVariant = variant === 'task';

  return (
    <>
      <ScheduleDateTypeSelector
        dateType={dateType}
        disabled={disabled}
        isTaskVariant={isTaskVariant}
        onDateTypeChange={onDateTypeChange}
        themeBaseColor={themeBaseColor}
        themeMidColor={themeMidColor}
      />
      <ScheduleMonthCalendar
        currentYear={currentYear}
        currentMonth={currentMonth}
        dateType={dateType}
        daysInMonth={daysInMonth}
        disabled={disabled}
        firstDay={firstDay}
        getDayStatus={getDayStatus}
        isTaskVariant={isTaskVariant}
        onDateClick={onDateClick}
        onNextMonth={onNextMonth}
        onPrevMonth={onPrevMonth}
        themeBaseColor={themeBaseColor}
        themeLightColor={themeLightColor}
        themeMidColor={themeMidColor}
      />
    </>
  );
};
