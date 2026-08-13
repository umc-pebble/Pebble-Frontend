import { apiRequest } from '@/services/api';

import type {
  CurrentUser,
  EmailConfirmResponse,
  UpdateSettingsRequest,
  UpdateSettingsResponse,
  UserSettings,
} from '../types/settings';

function requireData<T>(data: T | null, message: string): T {
  if (data === null) {
    throw new Error(message);
  }

  return data;
}

export async function getCurrentUser() {
  const data = await apiRequest<CurrentUser>({
    method: 'GET',
    url: '/users/me',
  });

  return requireData(data, '사용자 정보를 불러오지 못했어요.');
}

export async function getMySettings() {
  const data = await apiRequest<UserSettings>({
    method: 'GET',
    url: '/users/me/settings',
  });

  return requireData(data, '설정 정보를 불러오지 못했어요.');
}

export async function updateMySettings(body: UpdateSettingsRequest) {
  const data = await apiRequest<UpdateSettingsResponse>({
    method: 'PATCH',
    url: '/users/me/settings',
    data: body,
  });

  return requireData(data, '설정을 변경하지 못했어요.');
}

export async function requestEmailChange(newEmail: string) {
  await apiRequest<null>({
    method: 'POST',
    url: '/users/me/email/request',
    data: {
      newEmail,
    },
  });
}

export async function confirmEmailChange(token: string) {
  const data = await apiRequest<EmailConfirmResponse>({
    method: 'POST',
    url: '/users/me/email/confirm',
    data: {
      token,
    },
    skipAuth: true,
  });

  return requireData(data, '이메일 변경을 완료하지 못했어요.');
}

export async function deleteMyAccount() {
  await apiRequest<null>({
    method: 'DELETE',
    url: '/users/me',
    skipAuthRefresh: true,
  });
}