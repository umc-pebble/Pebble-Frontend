export type ActivityLogLevel = 0 | 1 | 2 | 3;

export type ActivityIntensity = 'empty' | 'level1' | 'level2' | 'level3';

export type ActivityColor =
  | '#A3A3A3'
  | '#82A0FF'
  | '#ABE692'
  | '#FFE48B'
  | '#FFB67A'
  | '#FFB4B4';

export interface ActivityLogsRequest {
  userId: number;
  baseDate?: string;
}

export interface ActivityLogItem {
  date: string;
  completedTaskCount: number;
  level: ActivityLogLevel;
}

export interface ActivityLogsResponse {
  userId: number;
  nickname: string;
  activityColor: string;
  baseDate: string;
  logs: ActivityLogItem[];
}

export interface ActivityPalette {
  activityColor: ActivityColor;
  colors: {
    empty: string;
    level1: string;
    level2: string;
    level3: string;
  };
}

export interface NormalizedActivityLog extends ActivityLogItem {
  intensity: ActivityIntensity;
  color: string;
}

export interface NormalizedActivityLogs {
  userId: number;
  nickname: string;
  activityColor: ActivityColor;
  baseDate: string;
  logs: NormalizedActivityLog[];
  palette: ActivityPalette;
}

export type ActivityLogsErrorType =
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'server'
  | 'unknown';

export interface ActivityLogsErrorState {
  message: string;
  status?: number;
  code?: string;
  type: ActivityLogsErrorType;
}