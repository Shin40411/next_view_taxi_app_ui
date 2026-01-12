import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import MainLayout from 'src/layouts/main';
import SimpleLayout from 'src/layouts/simple';
import CompactLayout from 'src/layouts/compact';

import { SplashScreen } from 'src/components/loading-screen';
import { GuestGuard } from 'src/auth/guard';
import AuthClassicLayout from 'src/layouts/auth/classic';

// ----------------------------------------------------------------------

const JwtLoginPage = lazy(() => import('src/pages/auth/jwt/login'));
// const HomePage = lazy(() => import('src/pages/home'));
const Page500 = lazy(() => import('src/pages/500'));
const Page403 = lazy(() => import('src/pages/403'));
const Page404 = lazy(() => import('src/pages/404'));
const FaqsPage = lazy(() => import('src/pages/faqs'));
const AboutPage = lazy(() => import('src/pages/about-us'));
const ContactPage = lazy(() => import('src/pages/contact-us'));
const PricingPage = lazy(() => import('src/pages/pricing'));
const PaymentPage = lazy(() => import('src/pages/payment'));
const ComingSoonPage = lazy(() => import('src/pages/coming-soon'));
const MaintenancePage = lazy(() => import('src/pages/maintenance'));

const TermsOfServicePage = lazy(() => import('src/pages/legal/terms-of-service'));
const PrivacyPolicyPage = lazy(() => import('src/pages/legal/privacy-policy'));
const TestOcrPage = lazy(() => import('src/pages/test/test-ocr'));

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: (
          <GuestGuard>
            <AuthClassicLayout>
              <JwtLoginPage />
            </AuthClassicLayout>
          </GuestGuard>
        ),
        index: true,
      },
      { path: 'terms-of-service', element: <TermsOfServicePage /> },
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      // { path: 'test-ocr', element: <TestOcrPage /> },
      // { path: 'about-us', element: <AboutPage /> },
      // { path: 'contact-us', element: <ContactPage /> },
      // { path: 'faqs', element: <FaqsPage /> },
    ],
  },
  {
    element: (
      <GuestGuard>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </GuestGuard>
    ),
    children: [
      // { path: 'login', element: <LoginPage /> },
    ],
  },
  {
    element: (
      <SimpleLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </SimpleLayout>
    )
    // children: [
    //   { path: 'pricing', element: <PricingPage /> },
    //   { path: 'payment', element: <PaymentPage /> },
    // ],
  },
  {
    element: (
      <CompactLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </CompactLayout>
    ),
    children: [
      // { path: 'coming-soon', element: <ComingSoonPage /> },
      // { path: 'maintenance', element: <MaintenancePage /> },
      { path: '500', element: <Page500 /> },
      { path: '404', element: <Page404 /> },
      { path: '403', element: <Page403 /> },
    ],
  },
];