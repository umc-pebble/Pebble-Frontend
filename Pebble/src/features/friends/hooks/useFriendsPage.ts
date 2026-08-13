import { useCallback, useEffect, useRef, useState } from "react";

import {
  acceptFollowRequest,
  deleteFollow,
  getAllFollows,
  searchUsers,
  sendFollowRequest,
  type FollowListItem,
  type SearchedUser,
} from "@/features/friends/api/followApi";
import { FOLLOW_UPDATED_EVENT } from "@/features/friends/utils/followSync";
import { getErrorMessage } from "@/utils/getErrorMessage";

const SEARCH_DEBOUNCE_MS = 300;
const TOAST_DURATION_MS = 2_000;

export type FriendsPageTab = "friends" | "search";

export const useFriendsPage = () => {
  const [activeTab, setActiveTab] = useState<FriendsPageTab>("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<FollowListItem[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FollowListItem[]>([]);
  const [sentRequests, setSentRequests] = useState<FollowListItem[]>([]);
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [isListLoading, setIsListLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const normalizedSearchQuery = searchQuery.trim();

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, TOAST_DURATION_MS);
  }, []);

  const loadFollowLists = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setIsListLoading(true);
    }

    setErrorMessage("");

    try {
      const [nextFriends, nextPendingRequests, nextSentRequests] =
        await Promise.all([
          getAllFollows("friends"),
          getAllFollows("pending"),
          getAllFollows("sent"),
        ]);

      setFriends(nextFriends);
      setPendingRequests(nextPendingRequests);
      setSentRequests(nextSentRequests);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "친구 목록을 불러오지 못했어요."));
    } finally {
      setIsListLoading(false);
    }
  }, []);

  const refreshCurrentSearch = useCallback(async () => {
    if (!normalizedSearchQuery) {
      return;
    }

    const response = await searchUsers(normalizedSearchQuery);
    setSearchResults(response.users);
  }, [normalizedSearchQuery]);

  useEffect(() => {
    void loadFollowLists(true);
  }, [loadFollowLists]);

  useEffect(() => {
    const refreshVisibleFollowData = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      void Promise.all([loadFollowLists(), refreshCurrentSearch()]).catch(
        () => undefined,
      );
    };
    const refreshUpdatedFollowData = () => {
      void Promise.all([loadFollowLists(), refreshCurrentSearch()]).catch(
        () => undefined,
      );
    };

    window.addEventListener("focus", refreshVisibleFollowData);
    document.addEventListener("visibilitychange", refreshVisibleFollowData);
    window.addEventListener(FOLLOW_UPDATED_EVENT, refreshUpdatedFollowData);

    return () => {
      window.removeEventListener("focus", refreshVisibleFollowData);
      document.removeEventListener(
        "visibilitychange",
        refreshVisibleFollowData,
      );
      window.removeEventListener(FOLLOW_UPDATED_EVENT, refreshUpdatedFollowData);
    };
  }, [loadFollowLists, refreshCurrentSearch]);

  useEffect(
    () => () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!normalizedSearchQuery) {
      setSearchResults([]);
      setIsSearching(false);
      setErrorMessage("");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      setErrorMessage("");

      try {
        const response = await searchUsers(
          normalizedSearchQuery,
          controller.signal,
        );
        setSearchResults(response.users);
      } catch (error) {
        if (!controller.signal.aborted) {
          setSearchResults([]);
          setErrorMessage(getErrorMessage(error, "사용자를 검색하지 못했어요."));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [normalizedSearchQuery]);

  const runAction = async (
    id: number,
    action: () => Promise<void>,
    successMessage: string,
  ) => {
    setProcessingId(id);
    setErrorMessage("");

    try {
      await action();
      await loadFollowLists();
      await refreshCurrentSearch();
      showToast(successMessage);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "요청을 처리하지 못했어요."));
    } finally {
      setProcessingId(null);
    }
  };

  const sendFollow = (user: SearchedUser) =>
    runAction(
      user.userId,
      () => sendFollowRequest(user.userId).then(() => undefined),
      `${user.nickname}님에게 친구 신청을 보냈어요`,
    );

  const acceptRequest = (request: FollowListItem) =>
    runAction(
      request.followId,
      () => acceptFollowRequest(request.followId).then(() => undefined),
      `${request.nickname}님과 친구가 되었어요`,
    );

  const rejectRequest = (request: FollowListItem) =>
    runAction(
      request.followId,
      () => deleteFollow(request.followId),
      `${request.nickname}님의 요청을 거절했어요`,
    );

  const cancelRequest = (request: FollowListItem) =>
    runAction(
      request.followId,
      () => deleteFollow(request.followId),
      `${request.nickname}님의 친구 신청을 취소했어요`,
    );

  const deleteFriend = (friend: FollowListItem) =>
    runAction(
      friend.followId,
      () => deleteFollow(friend.followId),
      `${friend.nickname}님의 친구 관계를 삭제했어요`,
    );

  return {
    acceptRequest,
    activeTab,
    cancelRequest,
    deleteFriend,
    errorMessage,
    friends,
    isListLoading,
    isSearching,
    isToastVisible,
    normalizedSearchQuery,
    pendingRequests,
    processingId,
    rejectRequest,
    searchQuery,
    searchResults,
    sendFollow,
    sentRequests,
    setActiveTab,
    setSearchQuery,
    toastMessage,
  };
};
