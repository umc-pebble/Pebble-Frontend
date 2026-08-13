import { describe, expect, it } from 'vitest';

import type { Category, MilestoneItem, TaskItem } from '@/types';

import {
  cloneScheduleItems,
  removeMilestoneFromCategory,
  toggleCategoryTaskCompletedInList,
  toggleTaskCompletedInMilestone,
  updateMilestoneInCategory,
} from './calendarStateUtils';

const childTask: TaskItem = {
  id: 'task-1',
  title: '하위 태스크',
  start: '2026-08-13',
  itemType: 'task',
  isCompleted: false,
};

const milestone: MilestoneItem = {
  id: 'milestone-1',
  title: '마일스톤',
  start: '2026-08-13',
  itemType: 'milestone',
  tasks: [childTask],
};

const categoryTask: TaskItem = {
  id: 'category-task-1',
  title: '카테고리 직속 태스크',
  start: '2026-08-14',
  itemType: 'task',
  isCompleted: false,
};

const category: Category = {
  id: 'category-1',
  title: '프로젝트',
  accent: '#00cef5',
  themeBase: '#00cef5',
  themeMid: '#8ae8fa',
  themeLight: '#dbf8fe',
  items: [milestone],
  tasks: [categoryTask],
};

describe('calendarStateUtils', () => {
  it('일정 목록을 중첩 태스크까지 복제한다', () => {
    const original = [milestone];
    const cloned = cloneScheduleItems(original);

    expect(cloned).toEqual([milestone]);
    expect(cloned).not.toBe(original);
    expect(cloned[0]).not.toBe(milestone);
    expect(cloned[0].tasks).not.toBe(milestone.tasks);
  });

  it('마일스톤 수정 시 기존 하위 태스크를 유지한다', () => {
    const updated = updateMilestoneInCategory(
      [category],
      category.id,
      milestone.id,
      {
        ...milestone,
        title: '수정된 마일스톤',
        tasks: [],
      },
    );

    expect(updated[0].items[0].title).toBe('수정된 마일스톤');
    expect(updated[0].items[0].tasks).toEqual([childTask]);
    expect(category.items[0].title).toBe('마일스톤');
  });

  it('마일스톤 하위 태스크와 카테고리 직속 태스크 완료 상태를 각각 변경한다', () => {
    const milestoneTaskUpdated = toggleTaskCompletedInMilestone(
      [category],
      category.id,
      milestone.id,
      childTask.id,
    );
    const categoryTaskUpdated = toggleCategoryTaskCompletedInList(
      milestoneTaskUpdated,
      category.id,
      categoryTask.id,
    );

    expect(categoryTaskUpdated[0].items[0].tasks?.[0].isCompleted).toBe(true);
    expect(categoryTaskUpdated[0].tasks?.[0].isCompleted).toBe(true);
    expect(category.items[0].tasks?.[0].isCompleted).toBe(false);
    expect(category.tasks?.[0].isCompleted).toBe(false);
  });

  it('대상 카테고리에서 지정한 마일스톤만 제거한다', () => {
    const anotherMilestone = { ...milestone, id: 'milestone-2' };
    const categories = [
      { ...category, items: [milestone, anotherMilestone] },
      { ...category, id: 'category-2' },
    ];

    const updated = removeMilestoneFromCategory(
      categories,
      category.id,
      milestone.id,
    );

    expect(updated[0].items.map((item) => item.id)).toEqual(['milestone-2']);
    expect(updated[1]).toBe(categories[1]);
  });
});
