import { useCallback, useEffect, useState } from 'react';

import {
  getCurrentUser,
  getMySettings,
  updateMySettings,
} from '../api/settingsApi';
import type {
  CurrentUser,
  SettingsTheme,
  UserSettings,
} from '../types/settings';
import { applyTheme } from '../utils/theme';

export function useSettings() {
  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);
  const [settings, setSettings] =
    useState<UserSettings | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [updatingField, setUpdatingField] = useState<
    'theme' | 'notification' | 'activityColor' | null
  >(null);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      const [user, loadedSettings] = await Promise.all([
        getCurrentUser(),
        getMySettings(),
      ]);

      setCurrentUser(user);
      setSettings(loadedSettings);
      applyTheme(loadedSettings.theme);
    } catch (error) {
      setCurrentUser(null);
      setSettings(null);

      setLoadError(
        error instanceof Error
          ? error.message
          : '설정 정보를 불러오지 못했어요.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const changeTheme = async (nextTheme: SettingsTheme) => {
    if (!settings || updatingField) return;
    if (settings.theme === nextTheme) return;

    const previousSettings = settings;

    setUpdatingField('theme');

    setSettings({
      ...settings,
      theme: nextTheme,
    });

    applyTheme(nextTheme);

    try {
      const result = await updateMySettings({
        theme: nextTheme,
      });

      setSettings((current) =>
        current
          ? {
              ...current,
              ...result,
            }
          : current,
      );

      applyTheme(result.theme);
    } catch (error) {
      setSettings(previousSettings);
      applyTheme(previousSettings.theme);

      throw error;
    } finally {
      setUpdatingField(null);
    }
  };

  const changeNotification = async (notifyTaskDue: boolean) => {
    if (!settings || updatingField) return;

    const previousSettings = settings;

    setUpdatingField('notification');

    setSettings({
      ...settings,
      notifyTaskDue,
    });

    try {
      const result = await updateMySettings({
        notifyTaskDue,
      });

      setSettings((current) =>
        current
          ? {
              ...current,
              ...result,
            }
          : current,
      );
    } catch (error) {
      setSettings(previousSettings);

      throw error;
    } finally {
      setUpdatingField(null);
    }
  };

  const changeActivityColor = async (activityColor: string) => {
    if (!settings || updatingField) return;

    if (
      settings.activityColor.toUpperCase() ===
      activityColor.toUpperCase()
    ) {
      return;
    }

    const previousSettings = settings;

    setUpdatingField('activityColor');

    setSettings({
      ...settings,
      activityColor,
    });

    try {
      const result = await updateMySettings({
        activityColor,
      });

      setSettings((current) =>
        current
          ? {
              ...current,
              ...result,
            }
          : current,
      );
    } catch (error) {
      setSettings(previousSettings);

      throw error;
    } finally {
      setUpdatingField(null);
    }
  };

  const markPasswordChanged = useCallback(() => {
    setSettings((current) =>
      current
        ? {
            ...current,
            isTempPassword: false,
          }
        : current,
    );
  }, []);

  return {
    currentUser,
    settings,

    isLoading,
    loadError,
    updatingField,

    reload: loadSettings,
    changeTheme,
    changeNotification,
    changeActivityColor,
    markPasswordChanged,
  };
}