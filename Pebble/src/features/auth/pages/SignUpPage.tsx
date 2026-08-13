// @/features/auth/pages/SignUpPage.tsx
import { AuthPageLayout } from '../components/AuthPageLayout';
import { SignUpContainer } from "../containers/SignUpContainer";

export const SignUpPage = (): JSX.Element => {
  return (
    <AuthPageLayout dataId="signup-screen" variant="signup">
      <SignUpContainer />
    </AuthPageLayout>
  );
};
