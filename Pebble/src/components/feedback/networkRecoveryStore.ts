import { closeGlobalErrorToast } from './globalErrorToastStore';

export type NetworkRecoveryState = {
  open: boolean;
  isOnline: boolean;
  isRetrying: boolean;
};

type NetworkRecoveryListener = (
  state: NetworkRecoveryState,
) => void;

type NetworkRetryAction = () => Promise<void>;

const listeners =
  new Set<NetworkRecoveryListener>();

let retryAction: NetworkRetryAction | null =
  null;

let state: NetworkRecoveryState = {
  open: false,
  isOnline: true,
  isRetrying: false,
};

function emit() {
  listeners.forEach((listener) =>
    listener(state),
  );
}

function getBrowserOnlineState() {
  if (typeof navigator === 'undefined') {
    return true;
  }

  return navigator.onLine;
}

export function subscribeNetworkRecovery(
  listener: NetworkRecoveryListener,
) {
  listeners.add(listener);
  listener(state);

  return () => {
    listeners.delete(listener);
  };
}

export function initializeNetworkRecovery() {
  const isOnline =
    getBrowserOnlineState();

  /*
   * navigator.onLine 값만으로 전체 화면을 열지 않습니다.
   *
   * 필수 초기 API가 실제 네트워크 오류로 실패했을 때
   * reportInitialNetworkFailure()에서 화면을 엽니다.
   *
   * 이미 초기 API 실패로 화면이 열린 상태라면
   * 해당 상태는 유지합니다.
   */
  state = {
    ...state,
    isOnline,
    isRetrying: false,
  };

  if (state.open) {
    closeGlobalErrorToast();
  }

  emit();
}

export function setBrowserNetworkState(
  isOnline: boolean,
) {
  state = {
    ...state,
    isOnline,
  };

  emit();
}

export function reportInitialNetworkFailure(
  nextRetryAction: NetworkRetryAction,
) {
  retryAction = nextRetryAction;

  closeGlobalErrorToast();

  state = {
    open: true,
    isOnline: getBrowserOnlineState(),
    isRetrying: false,
  };

  emit();
}

export function isNetworkErrorScreenOpen() {
  return state.open;
}

export async function retryInitialNetworkRequest() {
  if (state.isRetrying) return;

  const isOnline =
    getBrowserOnlineState();

  if (!isOnline) {
    state = {
      ...state,
      isOnline: false,
      open: true,
      isRetrying: false,
    };

    emit();
    return;
  }

  /*
   * 최초 오프라인 상태에서 아직 초기 요청이
   * 등록되지 않았다면 페이지를 다시 시작합니다.
   */
  if (!retryAction) {
    window.location.reload();
    return;
  }

  state = {
    ...state,
    isOnline: true,
    isRetrying: true,
  };

  emit();

  try {
    await retryAction();

    retryAction = null;

    state = {
      open: false,
      isOnline: true,
      isRetrying: false,
    };

    emit();
  } catch {
    state = {
      open: true,
      isOnline:
        getBrowserOnlineState(),
      isRetrying: false,
    };

    emit();
  }
}