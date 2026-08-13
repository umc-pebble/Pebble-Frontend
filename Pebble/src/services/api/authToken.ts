const ACCESS_TOKEN_STORAGE_KEY = "pebble_access_token";
const REFRESH_TOKEN_STORAGE_KEY = "pebble_refresh_token";
const AUTH_SESSION_REVISION_STORAGE_KEY = "pebble_auth_session_revision";
const VIEWED_FRIEND_CALENDARS_STORAGE_KEY = "pebble:viewed-friend-calendars";
const AUTH_BROADCAST_CHANNEL_NAME = "pebble:auth-session";

/** 로그아웃·토큰 만료·회원탈퇴 시 계정 종속 상태를 초기화하는 공통 이벤트입니다. */
export const AUTH_SESSION_CLEARED_EVENT = "pebble:auth-session-cleared";

export type AuthSessionClearedEventDetail = {
  external: boolean;
};

function createSessionRevision() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function dispatchAuthSessionCleared(external: boolean) {
  window.dispatchEvent(
    new CustomEvent<AuthSessionClearedEventDetail>(AUTH_SESSION_CLEARED_EVENT, {
      detail: { external },
    }),
  );
}

let authBroadcastChannel: BroadcastChannel | null = null;

if (typeof window !== "undefined") {
  if ("BroadcastChannel" in window) {
    authBroadcastChannel = new BroadcastChannel(AUTH_BROADCAST_CHANNEL_NAME);
    authBroadcastChannel.addEventListener("message", (event) => {
      if (event.data?.type === "session-cleared") {
        dispatchAuthSessionCleared(true);
      }
    });
  }

  // BroadcastChannel을 지원하지 않는 브라우저에서도 다른 탭의 로그아웃을 감지합니다.
  window.addEventListener("storage", (event) => {
    if (
      event.key === AUTH_SESSION_REVISION_STORAGE_KEY &&
      event.oldValue !== event.newValue
    ) {
      dispatchAuthSessionCleared(true);
    }
  });
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getAccessToken() {
  if (!canUseLocalStorage()) {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function setAccessToken(accessToken: string) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}

export function getRefreshToken() {
  if (!canUseLocalStorage()) {
    return null;
  }

  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

/** 진행 중인 인증 요청이 시작된 세션과 현재 세션이 같은지 확인하는 식별자입니다. */
export function getAuthSessionRevision() {
  if (!canUseLocalStorage()) {
    return null;
  }

  return window.localStorage.getItem(AUTH_SESSION_REVISION_STORAGE_KEY);
}

export function setRefreshToken(refreshToken: string) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
}

export function setAuthTokens(accessToken: string, refreshToken: string) {
  if (canUseLocalStorage() && !getAuthSessionRevision()) {
    window.localStorage.setItem(
      AUTH_SESSION_REVISION_STORAGE_KEY,
      createSessionRevision(),
    );
  }

  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
}

export function clearAuthTokens() {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  // 삭제 대신 새 식별자를 기록해 다른 탭과 진행 중인 재발급 요청을 동시에 무효화합니다.
  window.localStorage.setItem(
    AUTH_SESSION_REVISION_STORAGE_KEY,
    createSessionRevision(),
  );
  window.sessionStorage.removeItem(VIEWED_FRIEND_CALENDARS_STORAGE_KEY);
  dispatchAuthSessionCleared(false);
  authBroadcastChannel?.postMessage({ type: "session-cleared" });
}

export const clearAccessToken = clearAuthTokens;
