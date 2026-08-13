import { getActivityPalette, isActivityColor } from '../constants/activityPalettes';
import type {
  ActivityIntensity,
  ActivityLogLevel,
  ActivityLogsResponse,
  NormalizedActivityLogs,
} from '../types/activityLogs';
import { getRecentSevenDates } from './activityDate';

function normalizeLevel(level: number): ActivityLogLevel {
  if (level <= 0) return 0;
  if (level === 1) return 1;
  if (level === 2) return 2;
  return 3;
}

function getIntensity(level: ActivityLogLevel): ActivityIntensity {
  if (level === 0) return 'empty';
  if (level === 1) return 'level1';
  if (level === 2) return 'level2';

  return 'level3';
}

export function normalizeActivityLogsResponse(
  response: ActivityLogsResponse,
): NormalizedActivityLogs {
  const activityColor = isActivityColor(response.activityColor)
    ? response.activityColor
    : '#A3A3A3';

  const palette = getActivityPalette(activityColor);
  const logsByDate = new Map(response.logs.map((log) => [log.date, log]));
  const dates = getRecentSevenDates(response.baseDate);

  const logs = dates.map((date) => {
    const log = logsByDate.get(date);
    const level = normalizeLevel(log?.level ?? 0);
    const intensity = getIntensity(level);

    return {
      date,
      completedTaskCount: log?.completedTaskCount ?? 0,
      level,
      intensity,
      color: palette.colors[intensity],
    };
  });

  return {
    userId: response.userId,
    nickname: response.nickname,
    activityColor,
    baseDate: response.baseDate,
    logs,
    palette,
  };
}