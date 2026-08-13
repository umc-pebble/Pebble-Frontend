import { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import { GlobalErrorToast } from '@/components/feedback/GlobalErrorToast';
import { NetworkStatusManager } from '@/components/feedback/NetworkStatusManager';
import { MainLayout } from '@/components/layout/MainLayout';
import { ThemeInitializer } from '@/components/theme/ThemeInitializer';
import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { AuthSessionSynchronizer } from '@/features/auth/components/AuthSessionSynchronizer';
import { FIRST_STEP_PATH } from '@/features/report/constants/reportSteps';
import { getAccessToken } from '@/services/api';

const CalendarMainPage = lazy(() =>
  import('@/pages/calendar/CalendarMainPage').then((module) => ({
    default: module.CalendarMainPage,
  })),
);
const FriendsPage = lazy(() => import('@/pages/friends/FriendsPage'));
const HomePage = lazy(() =>
  import('@/pages/home/HomePage').then((module) => ({
    default: module.HomePage,
  })),
);
const LandingPage = lazy(() =>
  import('@/pages/landing/LandingPage').then((module) => ({
    default: module.LandingPage,
  })),
);
const MyPage = lazy(() => import('@/pages/mypage/MyPage'));
const ProfileEditPage = lazy(() => import('@/pages/mypage/ProfileEditPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const EmailVerifyPage = lazy(() =>
  import('@/pages/settings/EmailVerifyPage').then((module) => ({
    default: module.EmailVerifyPage,
  })),
);
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/pages/ForgotPasswordPage').then((module) => ({
    default: module.ForgotPasswordPage,
  })),
);
const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((module) => ({
    default: module.LoginPage,
  })),
);
const ProfileSetupPage = lazy(() =>
  import('@/features/auth/pages/ProfileSetupPage').then((module) => ({
    default: module.ProfileSetupPage,
  })),
);
const SignUpCompletePage = lazy(() =>
  import('@/features/auth/pages/SignUpCompletePage').then((module) => ({
    default: module.SignUpCompletePage,
  })),
);
const SignUpPage = lazy(() =>
  import('@/features/auth/pages/SignUpPage').then((module) => ({
    default: module.SignUpPage,
  })),
);
const SocialOAuthCallbackPage = lazy(() =>
  import('@/features/auth/pages/SocialOAuthCallbackPage').then((module) => ({
    default: module.SocialOAuthCallbackPage,
  })),
);
const ReportLayout = lazy(() =>
  import('@/features/report/ReportLayout').then((module) => ({
    default: module.ReportLayout,
  })),
);
const MonthlyPebbleStep = lazy(() =>
  import('@/features/report/steps/MonthlyPebbleStep').then((module) => ({
    default: module.MonthlyPebbleStep,
  })),
);
const BusiestCategoryStep = lazy(() =>
  import('@/features/report/steps/BusiestCategoryStep').then((module) => ({
    default: module.BusiestCategoryStep,
  })),
);
const BusiestDayStep = lazy(() =>
  import('@/features/report/steps/BusiestDayStep').then((module) => ({
    default: module.BusiestDayStep,
  })),
);
const SharedFriendsStep = lazy(() =>
  import('@/features/report/steps/SharedFriendsStep').then((module) => ({
    default: module.SharedFriendsStep,
  })),
);
const SummaryStep = lazy(() =>
  import('@/features/report/steps/SummaryStep').then((module) => ({
    default: module.SummaryStep,
  })),
);

const RouteLoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-fill-inverse text-body-02-m text-text-teritary dark:bg-fill-surface">
    화면을 불러오는 중이에요
  </div>
);

function LandingRoute() {
  if (getAccessToken()) {
    return <Navigate to="/" replace />;
  }

  return <LandingPage />;
}

function ProtectedLayoutRoute() {
  const { pathname } = useLocation();

  if (!getAccessToken()) {
    return (
      <Navigate
        to={pathname === '/' ? '/landing' : '/login'}
        replace
      />
    );
  }

  return <MainLayout />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthSessionSynchronizer />
      <ThemeInitializer />

      <div className="min-h-screen bg-fill-surface font-sans text-text-strong">
        <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route
            path="/landing"
            element={<LandingRoute />}
          />

          <Route element={<ProtectedLayoutRoute />}>
            <Route index element={<HomePage />} />
            <Route
              path="home"
              element={<HomePage />}
            />
            <Route
              path="calendar"
              element={<CalendarMainPage />}
            />
            <Route
              path="friends"
              element={<FriendsPage />}
            />
            <Route path="my" element={<MyPage />} />
            <Route
              path="my/profile"
              element={<ProfileEditPage />}
            />
            <Route
              path="settings"
              element={<SettingsPage />}
            />
          </Route>

          <Route
            path="/report"
            element={
              <RequireAuth>
                <ReportLayout />
              </RequireAuth>
            }
          >
            <Route
              index
              element={
                <Navigate
                  to={FIRST_STEP_PATH}
                  replace
                />
              }
            />
            <Route
              path="monthly"
              element={<MonthlyPebbleStep />}
            />
            <Route
              path="category"
              element={<BusiestCategoryStep />}
            />
            <Route
              path="day"
              element={<BusiestDayStep />}
            />
            <Route
              path="friends"
              element={<SharedFriendsStep />}
            />
            <Route
              path="summary"
              element={<SummaryStep />}
            />
            <Route
              path="*"
              element={
                <Navigate
                  to={FIRST_STEP_PATH}
                  replace
                />
              }
            />
          </Route>

          <Route
            path="/email/verify"
            element={<EmailVerifyPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/signup"
            element={<SignUpPage />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route
            path="/profile-setup"
            element={<ProfileSetupPage />}
          />
          <Route
            path="/signup-complete"
            element={<SignUpCompletePage />}
          />
          <Route
            path="/oauth/callback/:provider"
            element={<SocialOAuthCallbackPage />}
          />
        </Routes>
        </Suspense>
      </div>

      <GlobalErrorToast />
      <NetworkStatusManager />
    </BrowserRouter>
  );
}

export default App;
