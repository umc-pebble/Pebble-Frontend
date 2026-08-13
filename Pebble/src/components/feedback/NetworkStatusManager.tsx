import {
  useEffect,
  useState,
} from 'react';

import { OfflineErrorScreen } from './OfflineErrorScreen';
import {
  initializeNetworkRecovery,
  isNetworkErrorScreenOpen,
  retryInitialNetworkRequest,
  setBrowserNetworkState,
  subscribeNetworkRecovery,
  type NetworkRecoveryState,
} from './networkRecoveryStore';

const INITIAL_NETWORK_STATE: NetworkRecoveryState = {
  open: false,
  isOnline: true,
  isRetrying: false,
};

export function NetworkStatusManager() {
  const [networkState, setNetworkState] =
    useState<NetworkRecoveryState>(
      INITIAL_NETWORK_STATE,
    );

  useEffect(
    () =>
      subscribeNetworkRecovery(
        setNetworkState,
      ),
    [],
  );

  useEffect(() => {
    initializeNetworkRecovery();

    const handleOnline = () => {
      setBrowserNetworkState(true);

      /*
       * 오프라인 전체 화면이 열려 있었으면
       * 브라우저 연결 복구 시 초기 API를 자동 재시도합니다.
       */
      if (isNetworkErrorScreenOpen()) {
        void retryInitialNetworkRequest();
      }
    };

    const handleOffline = () => {
      /*
       * 최초 진입 이후의 단순 offline 이벤트만으로는
       * 무조건 전체 화면을 열지 않습니다.
       *
       * 이후 필수 요청이 실제 network 오류로 실패하면
       * reportInitialNetworkFailure에서 화면을 엽니다.
       */
      setBrowserNetworkState(false);
    };

    window.addEventListener(
      'online',
      handleOnline,
    );
    window.addEventListener(
      'offline',
      handleOffline,
    );

    return () => {
      window.removeEventListener(
        'online',
        handleOnline,
      );
      window.removeEventListener(
        'offline',
        handleOffline,
      );
    };
  }, []);

  if (!networkState.open) {
    return null;
  }

  return (
    <OfflineErrorScreen
      isOnline={networkState.isOnline}
      isRetrying={networkState.isRetrying}
      onRetry={() => {
        void retryInitialNetworkRequest();
      }}
    />
  );
}