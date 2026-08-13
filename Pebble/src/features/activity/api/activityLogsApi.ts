import { apiRequest } from '@/services/api';

import type {
  ActivityLogsRequest,
  ActivityLogsResponse,
} from '../types/activityLogs';

function requireData<T>(data: T | null, message: string): T {
  if (data === null) {
    throw new Error(message);
  }

  return data;
}

export async function getActivityLogs({
  userId,
  baseDate,
}: ActivityLogsRequest) {
  const data = await apiRequest<ActivityLogsResponse>({
    method: 'GET',
    url: `/activity-logs/users/${userId}`,
    params: baseDate ? { baseDate } : undefined,
  });

  return requireData(data, '징검다리 기록을 불러오지 못했어요.');
}