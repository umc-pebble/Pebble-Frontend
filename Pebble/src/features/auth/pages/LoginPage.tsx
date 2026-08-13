// @/features/auth/pages/LoginPage.tsx
import { AuthPageLayout } from '../components/AuthPageLayout';
import { LoginContainer } from "../containers/LoginContainer";

export const LoginPage = (): JSX.Element => {
  return (
    <AuthPageLayout dataId="login-screen">
      <LoginContainer />
    </AuthPageLayout>
  );
};
