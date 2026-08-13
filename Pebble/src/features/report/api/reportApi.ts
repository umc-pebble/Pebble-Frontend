import type { AxiosRequestConfig } from 'axios';

import { apiClient, apiRequest } from '@/services/api';

export interface ReportMetaDto {
  id: number;
  userId: number;
  month: string;
  reportImageUrl: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface ReportActivityLogsDto {
  monthlyCompletedTaskCounts: Array<{ month: string; count: number }>;
  totalCompletedTaskCount: number;
  period: { startDate: string; endDate: string };
}

export interface ReportTopCategoryDto {
  name: string;
  color: string;
  milestoneCount: number;
  taskCount: number;
  milestones: Array<{
    name: string;
    completedTaskCount: number;
    previewTasks: Array<{ name: string; completed: boolean }>;
  }>;
}

export interface ReportBusiestDayDto {
  date: string;
  taskCount: number;
  tasks: Array<{
    categoryName: string | null;
    milestoneName: string | null;
    taskName: string;
    completed: boolean;
    color: string | null;
  }>;
}

export interface ReportSharedCategoryDto {
  friendName: string;
  categoryName: string;
  profileImageUrl: string | null;
}

/** GET /reports가 반환하는 최신 유효 월말 리포트입니다. */
export interface LatestReportDto {
  reportMeta: ReportMetaDto;
  activityLogs: ReportActivityLogsDto;
  topCategory: ReportTopCategoryDto | null;
  busiestDay: ReportBusiestDayDto | null;
  sharedCategories: ReportSharedCategoryDto[];
}

interface UploadImageResponse {
  imageUrl: string;
}

/** 로그인 사용자의 만료되지 않은 최신 월말 리포트를 조회합니다. */
export function getLatestReport(
  signal?: AbortSignal,
): Promise<LatestReportDto | null> {
  return apiRequest<LatestReportDto>({
    method: 'GET',
    url: '/reports',
    signal,
  });
}

/** 생성한 리포트 PNG를 공용 이미지 저장소에 업로드합니다. */
export async function uploadReportImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const config: AxiosRequestConfig = {
    method: 'POST',
    url: '/uploads/image',
    data: formData,
  };
  const response = await apiClient.request<{
    success: true;
    message: string;
    data?: UploadImageResponse | null;
  }>(config);
  const imageUrl = response.data.data?.imageUrl;

  if (!imageUrl) {
    throw new Error('이미지 업로드 응답에 URL이 없습니다.');
  }

  return imageUrl;
}

/** 업로드된 합본 이미지 URL을 해당 리포트 레코드에 저장합니다. */
export async function updateReportImage(
  reportId: number,
  reportImageUrl: string,
): Promise<void> {
  await apiRequest<{ reportImageUrl: string }>({
    method: 'PATCH',
    url: `/reports/${reportId}`,
    data: { reportImageUrl },
  });
}
