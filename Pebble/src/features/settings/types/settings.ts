export type SettingsTheme = 'LIGHT' | 'DARK';

export interface CurrentUser {
  id: number;
  email: string;
  nickname: string;
  uniqueTag: string;
  profileImageUrl?: string | null;
  bio?: string | null;
}

export interface UserSettings {
  theme: SettingsTheme;
  notifyTaskDue: boolean;
  activityColor: string;
  isSocialOnly: boolean;
  isTempPassword: boolean;
}

export interface UpdateSettingsRequest {
  theme?: SettingsTheme;
  notifyTaskDue?: boolean;
  activityColor?: string;
}

export interface UpdateSettingsResponse {
  theme: SettingsTheme;
  notifyTaskDue: boolean;
  activityColor: string;
}

export interface ActivityLogItem {
  date: string;
  completedTaskCount: number;
  level: 0 | 1 | 2 | 3;
}

export interface ActivityLogsResponse {
  userId: number;
  nickname: string;
  activityColor: string;
  baseDate: string;
  logs: ActivityLogItem[];
}

export interface EmailConfirmResponse {
  id: number;
  email: string;
  nickname: string;
  uniqueTag: string;
}