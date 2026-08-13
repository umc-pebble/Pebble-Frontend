import type { CSSProperties } from 'react';

import type { DateType } from '@/hooks/useScheduleDatePicker';
import { getReadableCategoryTextColor } from '@/utils/categoryColorTheme';

export const getScheduleSelectedColor = (
  dateType: DateType,
  themeBaseColor: string,
  themeMidColor: string,
) => (dateType === '다중' ? themeMidColor : themeBaseColor);

export const getScheduleSelectedTextColor = (
  dateType: DateType,
  themeBaseColor: string,
  themeMidColor: string,
) =>
  dateType === '다중'
    ? getReadableCategoryTextColor(
        themeBaseColor,
        getScheduleSelectedColor(dateType, themeBaseColor, themeMidColor),
      )
    : '#ffffff';

export const getSelectedDateTypeButtonStyle = (
  dateType: DateType,
  themeBaseColor: string,
  themeMidColor: string,
): CSSProperties => {
  const isBlackCategoryColor =
    themeBaseColor.trim().toLowerCase() === '#171717';

  return {
    backgroundColor: isBlackCategoryColor
      ? 'rgb(var(--button-primary))'
      : getScheduleSelectedColor(
          dateType,
          themeBaseColor,
          themeMidColor,
        ),
    color: isBlackCategoryColor
      ? 'rgb(var(--text-on-fill))'
      : getScheduleSelectedTextColor(
          dateType,
          themeBaseColor,
          themeMidColor,
        ),
  };
};
