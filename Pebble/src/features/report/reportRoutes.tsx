import { Navigate, type RouteObject } from 'react-router-dom';

import { ReportLayout } from './ReportLayout';
import { FIRST_STEP_PATH, REPORT_STEPS } from './constants/reportSteps';
import { MonthlyPebbleStep } from './steps/MonthlyPebbleStep';
import { BusiestCategoryStep } from './steps/BusiestCategoryStep';
import { BusiestDayStep } from './steps/BusiestDayStep';
import { SharedFriendsStep } from './steps/SharedFriendsStep';
import { SummaryStep } from './steps/SummaryStep';
import { RequireAuth } from '@/features/auth/components/RequireAuth';

/** 경로 조각 -> 화면. constants/reportSteps.ts 의 순서와 짝을 이룹니다 */
const STEP_ELEMENTS: Record<string, JSX.Element> = {
  monthly: <MonthlyPebbleStep />,
  category: <BusiestCategoryStep />,
  day: <BusiestDayStep />,
  friends: <SharedFriendsStep />,
  summary: <SummaryStep />,
};

/**
 * 리포트 라우트.
 *
 * 앱 라우터에 이렇게 끼워 넣으세요.
 *
 *   const router = createBrowserRouter([
 *     { path: '/', element: <RootLayout />, children: [
 *       ...otherRoutes,
 *       ...reportRoutes,
 *     ]},
 *   ]);
 *
 * 최종 URL:
 *   /report            -> /report/monthly 로 리다이렉트
 *   /report/monthly    R003
 *   /report/category   R004
 *   /report/day        R005
 *   /report/friends    R006
 *   /report/summary    R007
 *
 * 중간 단계 URL 로 바로 들어와도 동작합니다. ReportLayout 이 데이터를
 * 다시 받아오기 때문입니다.
 */
export const reportRoutes: RouteObject[] = [
  {
    path: 'report',
    element: (
      <RequireAuth>
        <ReportLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to={FIRST_STEP_PATH} replace /> },
      ...REPORT_STEPS.map((step) => ({
        path: step.path,
        element: STEP_ELEMENTS[step.path],
      })),
      // 없는 단계로 들어오면 첫 화면으로
      { path: '*', element: <Navigate to={FIRST_STEP_PATH} replace /> },
    ],
  },
];
