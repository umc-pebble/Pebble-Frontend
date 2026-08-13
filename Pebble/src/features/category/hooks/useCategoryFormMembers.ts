import { useEffect, useMemo, useState } from 'react';

import { getFollowingFriends } from '@/features/category/api/categoryFriendsApi';
import {
  getCategoryMembers,
  getSharedCategoryUserProfile,
  type SharedCategoryMemberResponse,
} from '@/features/category/api/sharedCategoryApi';
import type { Friend } from '@/features/category/types';
import {
  filterAvailableCategoryFriends,
  mapProfileToCategoryMember,
} from '@/features/category/utils/categoryFormUtils';
import { getMyProfile } from '@/features/mypage/api/profileApi';
import type { Category } from '@/types';
import { getErrorMessage } from '@/utils/getErrorMessage';

type UseCategoryFormMembersParams = {
  category?: Category;
  isOpen: boolean;
  isShared: boolean;
  mode: 'create' | 'edit';
  onError: (message: string) => void;
};

export const useCategoryFormMembers = ({
  category,
  isOpen,
  isShared,
  mode,
  onError,
}: UseCategoryFormMembersParams) => {
  const categoryId = category?.id;
  const categoryMembers = category?.members;
  const [selectedMembers, setSelectedMembers] = useState<Friend[]>([]);
  const [initialMembers, setInitialMembers] = useState<Friend[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasLoadedFriends, setHasLoadedFriends] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = useMemo(
    () =>
      filterAvailableCategoryFriends({
        friends,
        selectedMembers,
        searchQuery,
      }),
    [friends, searchQuery, selectedMembers],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const displayMembers = mode === 'edit' ? categoryMembers ?? [] : [];

    setSelectedMembers(displayMembers);
    setInitialMembers(displayMembers);
    setFriends([]);
    setSearchQuery('');
    setIsDropdownOpen(false);
    setHasLoadedFriends(false);
  }, [categoryMembers, isOpen, mode]);

  useEffect(() => {
    if (!isOpen || !isShared) {
      setFriends([]);
      setHasLoadedFriends(false);
    }
  }, [isOpen, isShared]);

  useEffect(() => {
    if (!isOpen || mode !== 'edit' || !isShared || !categoryId) {
      return;
    }

    let isActive = true;

    const loadCategoryMembers = async () => {
      try {
        const [loadedFriends, sharedMembers, myProfile] = await Promise.all([
          getFollowingFriends(),
          getCategoryMembers(categoryId),
          getMyProfile().catch(() => null),
        ]);
        const friendMap = new Map(
          loadedFriends.map((friend) => [friend.id, friend]),
        );
        const categoryMemberMap = new Map(
          (categoryMembers ?? []).map((member) => [member.id, member]),
        );

        const resolveMember = async (
          member: SharedCategoryMemberResponse,
        ): Promise<Friend> => {
          const friend = friendMap.get(member.userId);
          const categoryMember = categoryMemberMap.get(member.userId);

          if (friend) {
            return { ...friend, role: member.role };
          }

          if (categoryMember?.name) {
            return { ...categoryMember, role: member.role };
          }

          if (myProfile?.id === member.userId) {
            return mapProfileToCategoryMember(myProfile, member.role);
          }

          const userProfile = await getSharedCategoryUserProfile(
            member.userId,
          ).catch(() => null);

          if (userProfile) {
            return { ...userProfile, role: member.role };
          }

          return {
            id: member.userId,
            name: `사용자 ${member.userId}`,
            role: member.role,
          };
        };

        const loadedMembers = await Promise.all(
          sharedMembers
            .filter((member) => member.status === 'ACCEPTED')
            .map(resolveMember),
        );

        if (!isActive) {
          return;
        }

        setFriends(loadedFriends);
        setHasLoadedFriends(true);
        setSelectedMembers(loadedMembers);
        setInitialMembers(loadedMembers);
      } catch (error) {
        if (isActive) {
          onError(getErrorMessage(error, '공유 멤버 정보를 불러오지 못했어요.'));
        }
      }
    };

    void loadCategoryMembers();

    return () => {
      isActive = false;
    };
  }, [categoryId, categoryMembers, isOpen, isShared, mode, onError]);

  const toggleMember = (member: Friend) => {
    if (member.role === 'OWNER') {
      return;
    }

    setSelectedMembers((previousMembers) => {
      if (previousMembers.some((selected) => selected.id === member.id)) {
        return previousMembers.filter((selected) => selected.id !== member.id);
      }

      setSearchQuery('');
      return [...previousMembers, member];
    });
  };

  const loadFriends = async () => {
    if (hasLoadedFriends) {
      return;
    }

    try {
      const loadedFriends = await getFollowingFriends();
      setFriends(loadedFriends);
      setHasLoadedFriends(true);
    } catch (error) {
      setFriends([]);
      setHasLoadedFriends(true);
      onError(getErrorMessage(error, '친구 목록을 불러오지 못했어요.'));
    }
  };

  const handleDropdownOpenChange = (nextIsOpen: boolean) => {
    setIsDropdownOpen(nextIsOpen);

    if (nextIsOpen) {
      void loadFriends();
    }
  };

  return {
    filteredFriends,
    handleDropdownOpenChange,
    initialMembers,
    isDropdownOpen,
    searchQuery,
    selectedMembers,
    setSearchQuery,
    toggleMember,
  };
};
