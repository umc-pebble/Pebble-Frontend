import { apiRequest } from "@/services/api";
import type { AlarmType } from "@/features/alarm/types/alarm";

export type NotificationResponse = {
  id: number;
  type: AlarmType;
  relatedId: number | null;
  isRead: boolean;
  expiresAt: string | null;
  createdAt: string;
};

export type NotificationPage = {
  offset: number;
  limit: number;
  total: number;
};

type GetNotificationsResponse = {
  notifications: NotificationResponse[];
  unreadCount: number;
  page: NotificationPage;
};

export async function getAlarms(): Promise<GetNotificationsResponse> {
  const data = await apiRequest<GetNotificationsResponse>({
    method: "GET",
    url: "/notifications",
    params: {
      offset: 0,
      limit: 100,
    },
  });

  return (
    data ?? {
      notifications: [],
      unreadCount: 0,
      page: { offset: 0, limit: 100, total: 0 },
    }
  );
}

export async function readAlarm(notificationId: number): Promise<void> {
  await apiRequest({
    method: "PATCH",
    url: `/notifications/${notificationId}/read`,
  });
}

export async function deleteAlarm(notificationId: number): Promise<void> {
  await apiRequest({
    method: "DELETE",
    url: `/notifications/${notificationId}`,
  });
}

export async function deleteAllAlarms(): Promise<void> {
  await apiRequest({
    method: "DELETE",
    url: "/notifications",
  });
}
