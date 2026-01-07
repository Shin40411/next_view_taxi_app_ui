import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { GuestGuard } from 'src/auth/guard';
import AuthClassicLayout from 'src/layouts/auth/classic';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// JWT
const JwtLoginPage = lazy(() => import('src/pages/auth/jwt/login'));
const JwtRegisterPage = lazy(() => import('src/pages/auth/jwt/register'));
const JwtForgotPasswordPage = lazy(() => import('src/pages/auth/jwt/forgot-password'));

const JwtVerifyPage = lazy(() => import('src/pages/auth/jwt/verify'));
const JwtNewPasswordPage = lazy(() => import('src/pages/auth/jwt/new-password'));

const authJwt = {
  path: 'jwt',
  element: (
    <GuestGuard>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <JwtLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthClassicLayout>
          <JwtRegisterPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'forgot-password',
      element: (
        <AuthClassicLayout title="Quên mật khẩu">
          <JwtForgotPasswordPage />
        </AuthClassicLayout>
      ),
    },
    // 👇 ĐÃ BỎ COMMENT ĐOẠN NÀY (Để bật đường dẫn):
    {
      path: 'verify',
      element: (
        <AuthClassicLayout title="Xác thực OTP">
          <JwtVerifyPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'new-password',
      element: (
        <AuthClassicLayout title="Mật khẩu mới">
          <JwtNewPasswordPage />
        </AuthClassicLayout>
      ),
    },
  ],
};

export const authRoutes = [
  {
    path: 'auth',
    children: [authJwt],
  },
];