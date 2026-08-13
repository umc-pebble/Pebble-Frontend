export type SignUpDraft = {
  email: string;
  password: string;
};

export type SignUpLocationState = {
  draft?: SignUpDraft;
  serverError?: string;
};

export type LoginLocationState = {
  socialAuthMessage?: string;
};

export type ProfileSetupLocationState =
  | {
      mode: 'email';
      signUpDraft: SignUpDraft;
    }
  | {
      mode: 'social';
    };

export type PasswordChangeLocationState = {
  initialStep: 3;
  currentPassword: string;
};
