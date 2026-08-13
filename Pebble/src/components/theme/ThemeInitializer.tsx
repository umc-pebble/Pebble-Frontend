import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { getMySettings } from '@/features/settings/api/settingsApi';
import {
  applyTheme,
  getStoredTheme,
} from '@/features/settings/utils/theme';
import { getAccessToken } from '@/services/api';

export function ThemeInitializer() {
  /*
   * 로그인·로그아웃 뒤 route가 바뀌면 컴포넌트가 다시
   * 렌더링되어 localStorage의 최신 token을 확인합니다.
   */
  useLocation();

  const accessToken = getAccessToken();

  useEffect(() => {
    let isCancelled = false;

    if (!accessToken) {
      applyTheme('LIGHT', {
        persist: false,
      });

      return () => {
        isCancelled = true;
      };
    }

    /*
     * 서버 요청이 끝나기 전에는 로컬에 저장된 테마를 먼저
     * 적용해 새로고침 시 밝은 화면이 잠깐 보이는 현상을 줄입니다.
     */
    applyTheme(getStoredTheme(), {
      persist: false,
    });

    void getMySettings()
      .then((settings) => {
        if (isCancelled) return;

        applyTheme(settings.theme);
      })
      .catch(() => {
        /*
         * 서버 설정 조회가 실패하면 저장된 테마를 유지합니다.
         * API 오류 UI는 각 페이지에서 별도로 처리합니다.
         */
      });

    return () => {
      isCancelled = true;
    };
  }, [accessToken]);

  return null;
}