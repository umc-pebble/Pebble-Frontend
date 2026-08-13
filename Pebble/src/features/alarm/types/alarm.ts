export type AlarmType =
  | "TASK_DUE"
  | "MILESTONE_DUE"
  | "REPORT"
  | "FOLLOW_REQUEST"
  | "FOLLOW_ACCEPTED"
  | "CATEGORY_INVITE"
  | "CATEGORY_DELETED"
  | "CATEGORY_ACCEPTED";
export type FollowRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type FollowRequestAction = "ACCEPT" | "REJECT";
export type CategoryInviteAction = "ACCEPT" | "REJECT";

export interface AlarmUser {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface Alarm {
  id: number;
  notificationIds: number[];
  unreadNotificationIds: number[];
  type: AlarmType;
  content: string;
  isRead: boolean;
  createdAt: string;
  createdAtIso: string;
  relatedId: number | null;
  expiresAt: string | null;
  user?: AlarmUser;
  friendRequestId?: number;
  followStatus?: FollowRequestStatus;
}
