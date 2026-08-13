import { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { CalendarStatusView } from '@/features/calendar/components/CalendarStatusView';
import { useCalendarLayoutContext } from '@/features/calendar/context/useCalendarLayoutContext';
import { filterCategoriesByMonth, isScheduleItemInMonth } from '@/features/milestone/components/scheduleDateUtils';
import type { ScheduleItem } from '@/types';
import { getScheduleDisplayLabels } from '@/utils/scheduleDate';

const MobileRouteNav = ({ activePath }: { activePath: string }) => {
  const navigate = useNavigate();
  const getButtonClassName = (isActive: boolean) =>
    isActive
      ? 'rounded-token-s bg-fill-primary px-1 py-3 text-body-04-m text-text-onFill sm:text-body-02-sb'
      : 'rounded-token-s bg-fill-inverse px-1 py-3 text-body-04-m text-text-strong shadow-shadow-s sm:text-body-02-sb';

  return (
    <nav
      aria-label="주요 메뉴"
      className="sticky top-3 z-40 grid grid-cols-5 gap-1 rounded-token-m bg-fill-inverse/95 p-2 shadow-shadow-s backdrop-blur-md sm:gap-2"
    >
      <button
        type="button"
        className={getButtonClassName(activePath === '/' || activePath === '/home')}
        onClick={() => navigate('/')}
      >
        홈
      </button>
      <button
        type="button"
        className={getButtonClassName(activePath === '/calendar')}
        onClick={() => navigate('/calendar')}
      >
        캘린더
      </button>
      <button
        type="button"
        className={getButtonClassName(activePath.startsWith('/friends'))}
        onClick={() => navigate('/friends')}
      >
        친구
      </button>
      <button
        type="button"
        className={getButtonClassName(activePath.startsWith('/my'))}
        onClick={() => navigate('/my')}
      >
        마이
      </button>
      <button
        type="button"
        className={getButtonClassName(activePath.startsWith('/settings'))}
        onClick={() => navigate('/settings')}
      >
        설정
      </button>
    </nav>
  );
};

const MobileScheduleRow = ({
  item,
  accentColor,
  backgroundColor = '#F4F4F5',
}: {
  item: ScheduleItem;
  accentColor: string;
  backgroundColor?: string;
}) => (
  <>
    {getScheduleDisplayLabels(item).map((dateLabel) => (
      <div
        key={`${item.id}-${dateLabel}`}
        className="flex items-center gap-3 rounded-token-s px-3 py-2"
        style={{ backgroundColor }}
      >
        <span
          className="h-8 w-1.5 shrink-0 rounded-token-infinite"
          style={{ backgroundColor: accentColor }}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-02-sb text-text-strong">
            {item.title}
          </p>
          <p className="text-body-03-r text-text-teritary">{dateLabel}</p>
        </div>
      </div>
    ))}
  </>
);

export const MobileCalendarLayout = ({
  isTablet = false,
}: {
  isTablet?: boolean;
}) => {
  const { pathname } = useLocation();
  const {
    currentYear,
    currentMonth,
    onChangeCalendarMonth,
    categories,
    standaloneTasks,
    isCalendarLoading,
    calendarErrorMessage,
    reloadCalendarData,
    selectCategory,
  } = useCalendarLayoutContext();
  const displayedStandaloneTasks = useMemo(
    () =>
      standaloneTasks.filter((task) =>
        isScheduleItemInMonth(task, currentYear, currentMonth),
      ),
    [currentMonth, currentYear, standaloneTasks],
  );
  const visibleCategoryGroups = useMemo(
    () =>
      filterCategoriesByMonth(categories, currentYear, currentMonth).map(
        (category) => ({
          category,
          milestones: category.items,
          tasks: category.tasks ?? [],
        }),
      ),
    [categories, currentMonth, currentYear],
  );

  const changeMonth = (offset: number) => {
    const nextDate = new Date(currentYear, currentMonth - 1 + offset, 1);
    onChangeCalendarMonth(nextDate.getFullYear(), nextDate.getMonth() + 1);
  };

  const handleToday = () => {
    const today = new Date();
    onChangeCalendarMonth(today.getFullYear(), today.getMonth() + 1);
  };

  return (
    <main className="min-h-screen bg-fill-inverse px-4 py-5 sm:px-6 dark:bg-fill-surface">
      <section
        className={`mx-auto flex w-full flex-col gap-4 ${
          isTablet ? 'max-w-[960px]' : 'max-w-[430px]'
        }`}
      >
        <header className="rounded-token-l bg-fill-inverse p-5 shadow-shadow-s">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-body-03-r text-text-teritary">Pebble</p>
              <h1 className="text-title-02-sb text-text-strong">
                {currentYear}년 {currentMonth}월
              </h1>
            </div>
            <button
              type="button"
              className="rounded-token-infinite bg-btn-primary px-4 py-2 text-body-02-sb text-text-onFill"
              onClick={handleToday}
            >
              오늘
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="rounded-token-s bg-btn-quaternary py-3 text-body-02-sb text-text-strong"
              onClick={() => changeMonth(-1)}
            >
              이전 달
            </button>
            <button
              type="button"
              className="rounded-token-s bg-btn-quaternary py-3 text-body-02-sb text-text-strong"
              onClick={() => changeMonth(1)}
            >
              다음 달
            </button>
          </div>
        </header>

        <MobileRouteNav activePath={pathname} />

        {isCalendarLoading ? (
          <section className="min-h-[320px] rounded-token-l bg-fill-inverse shadow-shadow-s">
            <CalendarStatusView
              title="캘린더를 불러오는 중이에요"
              description="카테고리, 마일스톤, 태스크 정보를 확인하고 있어요."
            />
          </section>
        ) : calendarErrorMessage ? (
          <section className="min-h-[320px] rounded-token-l bg-fill-inverse shadow-shadow-s">
            <CalendarStatusView
              title="캘린더를 불러오지 못했어요"
              description={calendarErrorMessage}
              actionLabel="다시 시도"
              onAction={reloadCalendarData}
            />
          </section>
        ) : (
          <div className={isTablet ? 'grid grid-cols-2 items-start gap-4' : 'flex flex-col gap-4'}>
            {displayedStandaloneTasks.length > 0 ? (
              <section className={`rounded-token-l bg-fill-inverse p-4 shadow-shadow-s ${isTablet ? 'col-span-2' : ''}`}>
                <div className="mb-3 flex items-end gap-2">
                  <h2 className="text-title-03-sb text-text-strong">
                    단일 태스크
                  </h2>
                  <span className="text-body-02-m text-text-teritary">
                    {displayedStandaloneTasks.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {displayedStandaloneTasks.map((task) => (
                    <MobileScheduleRow
                      key={task.id}
                      item={task}
                      accentColor={task.accent ?? '#171717'}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {visibleCategoryGroups.map(({ category, milestones, tasks }) => (
              <section
                key={category.id}
                className="rounded-token-l bg-fill-inverse p-4 shadow-shadow-s"
              >
                <button
                  type="button"
                  className="mb-3 flex w-full items-center gap-3 text-left"
                  onClick={() => selectCategory(category.id)}
                >
                  <span
                    className="h-10 w-2 rounded-token-infinite"
                    style={{ backgroundColor: category.themeBase }}
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-title-03-sb text-text-strong">
                      {category.title}
                    </h2>
                    <p className="text-body-03-r text-text-teritary">
                      마일스톤 {milestones.length} · 태스크 {tasks.length}
                    </p>
                  </div>
                </button>
                <div className="flex flex-col gap-2">
                  {milestones.map((milestone) => (
                    <MobileScheduleRow
                      key={milestone.id}
                      item={milestone}
                      accentColor={category.themeBase}
                      backgroundColor={category.themeMid}
                    />
                  ))}
                  {tasks.map((task) => (
                    <MobileScheduleRow
                      key={task.id}
                      item={task}
                      accentColor={category.themeBase}
                      backgroundColor={category.themeLight}
                    />
                  ))}
                </div>
              </section>
            ))}

            {displayedStandaloneTasks.length === 0 &&
            visibleCategoryGroups.length === 0 ? (
              <section className="min-h-[320px] rounded-token-l bg-fill-inverse shadow-shadow-s">
                <CalendarStatusView
                  title="이번 달 일정이 없어요"
                  description="카테고리, 마일스톤, 태스크를 추가해보세요."
                />
              </section>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
};

export const MobileNestedPageLayout = ({
  isTablet = false,
}: {
  isTablet?: boolean;
}) => {
  const { pathname } = useLocation();

  return (
    <main className="min-h-screen overflow-x-hidden bg-fill-inverse px-4 py-5 sm:px-6 dark:bg-fill-surface">
      <section
        className={`mx-auto flex w-full flex-col gap-4 ${
          isTablet ? 'max-w-[960px]' : 'max-w-[430px]'
        }`}
      >
        <MobileRouteNav activePath={pathname} />
        {pathname === '/' ? (
          <Outlet />
        ) : (
          <div className="overflow-hidden rounded-token-l bg-fill-inverse shadow-shadow-s">
            <Outlet />
          </div>
        )}
      </section>
    </main>
  );
};
