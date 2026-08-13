import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import { Toast } from '@/components/ui/Toast';
import { useProfileStore } from '@/features/mypage/store/useProfileStore';
import { useRetryableAction } from '@/hooks/useRetryableAction';

const DAY_IN_MS =
  24 * 60 * 60 * 1000;

export const ProfileEditForm = () => {
  const profile = useProfileStore(
    (state) => state.profile,
  );

  const hasPendingImage = useProfileStore(
    (state) =>
      state.pendingImageUrl !== null,
  );

  const updateProfile = useProfileStore(
    (state) => state.updateProfile,
  );

  const isSaving = useProfileStore(
    (state) => state.isSaving,
  );

  const error = useProfileStore(
    (state) => state.error,
  );

  const [nickname, setNickname] =
    useState(profile.nickname);

  const [bio, setBio] =
    useState(profile.bio);

  const [
    isToastMounted,
    setIsToastMounted,
  ] = useState(false);

  const [
    isToastVisible,
    setIsToastVisible,
  ] = useState(false);

  const [
    toastMessage,
    setToastMessage,
  ] = useState('');

  const { isRunning, run } =
    useRetryableAction();

  const nicknameAvailableAt =
    profile.nicknameChangeableAfter
      ? new Date(
          profile.nicknameChangeableAfter,
        ).getTime()
      : 0;

  const remainingDays = Math.max(
    0,
    Math.ceil(
      (nicknameAvailableAt -
        Date.now()) /
        DAY_IN_MS,
    ),
  );

  const isNicknameLocked =
    remainingDays > 0;

  const normalizedNickname =
    nickname.trim();

  const normalizedBio = bio.trim();

  const hasChanges =
    normalizedNickname !==
      profile.nickname ||
    normalizedBio !== profile.bio ||
    hasPendingImage;

  const canSave =
    normalizedNickname.length > 0 &&
    hasChanges &&
    !isSaving &&
    !isRunning;

  useEffect(() => {
    setNickname(profile.nickname);
    setBio(profile.bio);
  }, [
    profile.bio,
    profile.nickname,
  ]);

  useEffect(() => {
    if (!isToastMounted) {
      return;
    }

    const showTimer =
      window.setTimeout(() => {
        setIsToastVisible(true);
      }, 150);

    const hideTimer =
      window.setTimeout(() => {
        setIsToastVisible(false);
      }, 2150);

    const removeTimer =
      window.setTimeout(() => {
        setIsToastMounted(false);
      }, 2600);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, [isToastMounted]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!canSave) {
      return;
    }

    /*
     * 재시도 시에도 처음 제출했던 값을 사용하도록
     * 요청 시점의 입력값을 복사합니다.
     */
    const nicknameSnapshot =
      normalizedNickname;

    const bioSnapshot =
      normalizedBio;

    const nicknameChanged =
      nicknameSnapshot !==
      profile.nickname;

    const bioChanged =
      bioSnapshot !== profile.bio;

    const imageChanged =
      hasPendingImage;

    await run(async () => {
      await updateProfile({
        nickname: nicknameSnapshot,
        bio: bioSnapshot,
      });

      /*
       * 요청이 성공한 경우에만 현재 입력값을
       * 서버에 저장된 값으로 맞춥니다.
       */
      setNickname(nicknameSnapshot);
      setBio(bioSnapshot);

      if (nicknameChanged) {
        setToastMessage(
          '닉네임이 변경되었어요. 15일 후에 다시 변경할 수 있어요.',
        );
      } else if (imageChanged) {
        setToastMessage(
          '프로필 이미지가 변경되었어요.',
        );
      } else if (bioChanged) {
        setToastMessage(
          '한 줄 소개가 변경되었어요.',
        );
      } else {
        setToastMessage(
          '프로필이 변경되었어요.',
        );
      }

      setIsToastMounted(true);
    });
  };

  const inputClassName = [
    'h-12 w-full rounded-token-s',
    'border border-border-default',
    'bg-fill-inverse px-3',
    'text-body-02-m text-text-strong',
    'placeholder:text-text-teritary',
  ].join(' ');

  return (
    <form
      className="mt-8 flex w-full max-w-[640px] flex-col gap-6 sm:mt-12 sm:gap-7"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col gap-2 text-body-02-sb text-text-strong">
        로그인 ID

        <input
          type="email"
          value={profile.email}
          readOnly
          className={`${inputClassName} bg-fill-surface text-text-secondary`}
        />
      </label>

      <label className="relative flex flex-col gap-2 pt-3 text-body-02-sb text-text-strong">
        닉네임 설정

        <input
          type="text"
          value={nickname}
          disabled={
            isNicknameLocked ||
            isSaving ||
            isRunning
          }
          maxLength={20}
          className={[
            inputClassName,
            'disabled:cursor-not-allowed',
            'disabled:bg-fill-surface',
            'disabled:text-text-secondary',
          ].join(' ')}
          onChange={(event) =>
            setNickname(
              event.target.value,
            )
          }
        />

        {isNicknameLocked ? (
          <span className="absolute left-0 top-full mt-1 text-body-03-r text-fill-danger">
            {remainingDays}일 후 변경 가능해요
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-2 pt-3 text-body-02-sb text-text-strong">
        한 줄 소개

        <input
          type="text"
          value={bio}
          disabled={
            isSaving || isRunning
          }
          maxLength={50}
          className={[
            inputClassName,
            'disabled:cursor-not-allowed',
            'disabled:bg-fill-surface',
            'disabled:text-text-secondary',
          ].join(' ')}
          onChange={(event) =>
            setBio(event.target.value)
          }
        />
      </label>

      <button
        type="submit"
        disabled={!canSave}
        className={[
          'mt-3 h-12 rounded-token-s',
          'bg-btn-secondary text-body-02-m text-text-onFill',
          'transition-opacity',
          'disabled:cursor-not-allowed disabled:opacity-60',
        ].join(' ')}
      >
        {isSaving || isRunning
          ? '저장 중...'
          : '저장'}
      </button>

      {error ? (
        <p
          role="alert"
          className="-mt-4 text-body-03-r text-fill-danger"
        >
          {error}
        </p>
      ) : null}

      {isToastMounted ? (
        <Toast
          message={toastMessage}
          open={isToastVisible}
          className="absolute bottom-4 right-5 z-30"
        />
      ) : null}
    </form>
  );
};
