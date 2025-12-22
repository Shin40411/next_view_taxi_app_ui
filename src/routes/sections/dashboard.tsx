import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
import { paths } from '../paths';
// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/ecommerce'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: '/',
    element: (
      <AuthGuard>
          <DashboardLayout>
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
    ],
  },
];
