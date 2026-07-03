import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '@/features/auth/LoginPage';
import { OnboardingPage } from '@/features/onboarding/OnboardingPage';
import { ErrorPage } from '@/routes/error';
import { RootLayout } from '@/routes/root';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <OnboardingPage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
]);
