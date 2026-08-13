import { apiRequest } from '@/services/api';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginUser = {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl?: string | null;
  isTempPassword?: boolean;
};

export type LoginResponse = {
  user: LoginUser;
  accessToken: string;
  refreshToken: string;
  mustChangePassword?: boolean;
};

export type SignUpRequest = {
  email: string;
  password: string;
  nickname: string;
  profileImageUrl?: string | null;
  bio?: string | null;
};

export type SocialProvider = 'google' | 'naver';

export type SocialLoginRequest = {
  code: string;
  redirectUri?: string;
};

export type SocialLoginResponse = LoginResponse & {
  isNewUser: boolean;
};

export type UpdateProfileRequest = {
  nickname?: string;
  bio?: string | null;
  profileImageUrl?: string | null;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

function requireAuthResponse(
  data: LoginResponse | null,
  errorMessage: string,
): LoginResponse {
  if (!data?.accessToken || !data.refreshToken) {
    throw new Error(errorMessage);
  }

  return data;
}

/** 이메일과 비밀번호로 로그인하고 이후 API 호출에 사용할 토큰을 받습니다. */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  const data = await apiRequest<LoginResponse>({
    method: 'POST',
    url: '/auth/login',
    data: request,
    skipAuth: true,
  });

  return requireAuthResponse(data, '로그인 응답에 인증 토큰이 없습니다.');
}

/** 이메일 회원가입을 완료하고 로그인 토큰을 함께 받습니다. */
export async function signUp(request: SignUpRequest): Promise<LoginResponse> {
  const data = await apiRequest<LoginResponse>({
    method: 'POST',
    url: '/auth/signup',
    data: request,
    skipAuth: true,
  });

  return requireAuthResponse(data, '회원가입 응답에 인증 토큰이 없습니다.');
}

/** OAuth 인가코드를 서버에서 교환해 소셜 로그인 또는 가입을 완료합니다. */
export async function socialLogin(
  provider: SocialProvider,
  request: SocialLoginRequest,
): Promise<SocialLoginResponse> {
  const data = await apiRequest<SocialLoginResponse>({
    method: 'POST',
    url: `/auth/social/${provider}`,
    data: request,
    skipAuth: true,
  });

  return requireAuthResponse(
    data,
    '소셜 로그인 응답에 인증 토큰이 없습니다.',
  ) as SocialLoginResponse;
}

/** 서버 세션을 만료시킵니다. 로그아웃 직전에 캡처한 토큰을 명시적으로 사용합니다. */
export async function logout(accessToken?: string | null): Promise<void> {
  await apiRequest<never>({
    method: 'POST',
    url: '/auth/logout',
    skipAuthRefresh: true,
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
  });
}

/** 가입 여부를 노출하지 않고 입력한 이메일로 임시 비밀번호 발급을 요청합니다. */
export async function requestTemporaryPassword(email: string): Promise<void> {
  await apiRequest<never>({
    method: 'POST',
    url: '/auth/password/temp',
    data: { email },
    skipAuth: true,
  });
}

/** 임시 비밀번호 또는 현재 비밀번호를 확인한 뒤 새 비밀번호로 변경합니다. */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<AuthTokens> {
  const data = await apiRequest<AuthTokens>({
    method: 'PATCH',
    url: '/users/me/password',
    data: { currentPassword, newPassword },
  });

  if (!data?.accessToken || !data.refreshToken) {
    throw new Error('비밀번호 변경 응답에 인증 토큰이 없습니다.');
  }

  return data;
}

/** 신규 소셜 사용자나 가입 직후 사용자의 프로필을 수정합니다. */
export async function updateProfile(
  request: UpdateProfileRequest,
): Promise<void> {
  await apiRequest({
    method: 'PATCH',
    url: '/users/me',
    data: request,
  });
}
