import { describe, expect, it } from 'vitest';

import {
  mapCategoryResponseToCategory,
  mapCreateCategoryInputToRequest,
  mapUpdateCategoryInputToRequest,
} from './categoryMapper';

describe('categoryMapper', () => {
  it('카테고리 응답의 구성원 별칭을 정규화하고 불완전한 구성원을 제외한다', () => {
    const category = mapCategoryResponseToCategory({
      id: 7,
      name: '공유 일정',
      color: '#00cef5',
      categoryMembers: [
        { userId: 1, nickname: 'Elric', role: 'OWNER' },
        { id: 2, name: '친구', profileImageUrl: null },
        { id: 3 },
      ],
    });

    expect(category).toMatchObject({
      id: '7',
      title: '공유 일정',
      accent: '#00cef5',
      items: [],
      tasks: [],
    });
    expect(category.members).toEqual([
      {
        id: 1,
        name: 'Elric',
        role: 'OWNER',
        uniqueTag: undefined,
        email: undefined,
        profileImageUrl: null,
      },
      {
        id: 2,
        name: '친구',
        role: undefined,
        uniqueTag: undefined,
        email: undefined,
        profileImageUrl: null,
      },
    ]);
  });

  it('공유 카테고리 생성에만 초대 사용자와 서버 이미지 URL을 포함한다', () => {
    const request = mapCreateCategoryInputToRequest({
      title: '프로젝트',
      accent: '#ffcc00',
      themeBase: '#ffcc00',
      themeMid: '#ffe37a',
      themeLight: '#fff7d1',
      imageUrl: 'blob:http://localhost/image',
      isShared: true,
      members: [{ id: 10, name: '친구' }],
    });

    expect(request).toEqual({
      name: '프로젝트',
      color: '#ffcc00',
      imageUrl: null,
      isPublic: undefined,
      isCompleted: undefined,
      inviteUserIds: [10],
    });
  });

  it('수정 요청에는 실제로 전달된 필드만 포함한다', () => {
    expect(
      mapUpdateCategoryInputToRequest({
        accent: '#111111',
        imageUrl: undefined,
        isHidden: false,
      }),
    ).toEqual({
      color: '#111111',
      imageUrl: null,
      isHidden: false,
    });
  });
});
