import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
import { paths } from '../paths';
// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/home-map'));
const HomeMapPage = lazy(() => import('src/pages/dashboard/home-map')); // Correct import if IndexPage is home-map
const ServiceDetailPage = lazy(() => import('src/pages/dashboard/service-detail'));
const AdminOverviewPage = lazy(() => import('src/pages/dashboard/admin/overview'));
const AdminLiveMapPage = lazy(() => import('src/pages/dashboard/admin/live-map'));
const AdminTransactionsPage = lazy(() => import('src/pages/dashboard/admin/transactions'));
// Restoring these:
const PartnerListPage = lazy(() => import('src/pages/dashboard/admin/partner-list'));
const PartnerDetailPage = lazy(() => import('src/pages/dashboard/admin/partner-detail'));
const ServicePointListPage = lazy(() => import('src/pages/dashboard/admin/service-point-list'));
const ServicePointCreatePage = lazy(() => import('src/pages/dashboard/admin/service-point-create'));
const ServicePointEditPage = lazy(() => import('src/pages/dashboard/admin/service-point-edit'));
const DriverHomePage = lazy(() => import('src/pages/dashboard/driver/home'));

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
      { path: 'home-map', element: <HomeMapPage /> },
      { path: 'driver', element: <DriverHomePage /> },
      { path: 'service/:id', element: <ServiceDetailPage /> },
      { path: 'admin/overview', element: <AdminOverviewPage /> },
      { path: 'admin/live-map', element: <AdminLiveMapPage /> },
      { path: 'admin/transactions', element: <AdminTransactionsPage /> },
      {
        path: 'admin/partners',
        children: [
          { element: <PartnerListPage />, index: true },
          { path: ':id', element: <PartnerDetailPage /> },
        ],
      },
      {
        path: 'admin/service-points',
        children: [
          { element: <ServicePointListPage />, index: true },
          { path: 'new', element: <ServicePointCreatePage /> },
          { path: ':id/edit', element: <ServicePointEditPage /> },
        ],
      },
    ],
  },
];
