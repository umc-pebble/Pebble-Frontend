import type { LatestReportDto } from '../api/reportApi';
import type { MonthlyReportResponse } from '../types/report';

const parseReportMonth = (value: string) => {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (!Number.isInteger(year) || month < 1 || month > 12) return null;

  return { year, month };
};

/**
 * 백엔드의 집계 중심 응답을 R003~R007 화면 모델로 변환합니다.
 * 서버 필드명은 이 어댑터 한 곳에서만 알고, 화면 컴포넌트는 기존 모델을 유지합니다.
 */
export function adaptLatestReport(
  dto: LatestReportDto,
): MonthlyReportResponse | null {
  const reportMonth = parseReportMonth(dto.reportMeta.month);
  if (!reportMonth) return null;

  const recentMonths = dto.activityLogs.monthlyCompletedTaskCounts.map(
    ({ month, count }) => {
      const parsed = parseReportMonth(month);
      return {
        year: parsed?.year ?? reportMonth.year,
        month: parsed?.month ?? reportMonth.month,
        count,
      };
    },
  );

  const latestMonthCount =
    recentMonths.find(
      ({ year, month }) =>
        year === reportMonth.year && month === reportMonth.month,
    )?.count ??
    recentMonths[recentMonths.length - 1]?.count ??
    0;

  const busiestCategory = dto.topCategory
    ? {
        name: dto.topCategory.name,
        colorHex: dto.topCategory.color,
        milestoneCount: dto.topCategory.milestoneCount,
        taskCount: dto.topCategory.taskCount,
        milestones: dto.topCategory.milestones.map((milestone, index) => ({
          id: `milestone-${index}`,
          name: milestone.name,
          featured: index < 3,
          tasks: milestone.previewTasks.map((task, taskIndex) => ({
            id: `milestone-${index}-task-${taskIndex}`,
            name: task.name,
            completed: task.completed,
          })),
          remainingTaskCount: Math.max(
            0,
            milestone.completedTaskCount - milestone.previewTasks.length,
          ),
        })),
      }
    : null;

  const busiestDay = dto.busiestDay
    ? {
        date: dto.busiestDay.date,
        schedules: dto.busiestDay.tasks.map((task, index) => ({
          id: `schedule-${index}`,
          kind: 'task' as const,
          breadcrumb: [task.categoryName, task.milestoneName]
            .filter(Boolean)
            .join(' - '),
          name: task.taskName,
          completed: task.completed,
          colorHex: task.color,
        })),
      }
    : null;

  const categoryNames = new Set(
    dto.sharedCategories.map(({ categoryName }) => categoryName),
  );

  return {
    reportId: dto.reportMeta.id,
    reportImageUrl: dto.reportMeta.reportImageUrl,
    reportYear: reportMonth.year,
    reportMonth: reportMonth.month,
    monthlyPebbleCount: latestMonthCount,
    recentMonths,
    totalPebbleCount: dto.activityLogs.totalCompletedTaskCount,
    recordStartDate: dto.activityLogs.period.startDate,
    recordEndDate: dto.activityLogs.period.endDate,
    busiestCategory,
    busiestDay,
    sharedFriends: {
      sharedCategoryCount: categoryNames.size,
      friends: dto.sharedCategories.map((friend, index) => ({
        id: `friend-${index}`,
        categoryName: friend.categoryName,
        nickname: friend.friendName,
        avatarUrl: friend.profileImageUrl,
      })),
    },
  };
}
