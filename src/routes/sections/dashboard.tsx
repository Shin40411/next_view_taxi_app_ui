import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
import { paths } from '../paths';
// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/home-map'));
const ServiceDetailPage = lazy(() => import('src/pages/dashboard/service-detail'));
const AdminOverviewPage = lazy(() => import('src/pages/dashboard/admin/overview'));
const AdminLiveMapPage = lazy(() => import('src/pages/dashboard/admin/live-map'));
const AdminTransactionsPage = lazy(() => import('src/pages/dashboard/admin/transactions'));

const WalletPage = lazy(() => import('src/pages/dashboard/admin/wallets'));
const EmployeeListPage = lazy(() => import('src/pages/dashboard/admin/employee/list'));
const EmployeeCreatePage = lazy(() => import('src/pages/dashboard/admin/employee/new'));
const EmployeeEditPage = lazy(() => import('src/pages/dashboard/admin/employee/edit'));
const SettingsPage = lazy(() => import('src/pages/dashboard/admin/settings'));
// Restoring these:
const PartnerListPage = lazy(() => import('src/pages/dashboard/admin/partner-list'));
const PartnerDetailPage = lazy(() => import('src/pages/dashboard/admin/partner-detail'));
const ServicePointListPage = lazy(() => import('src/pages/dashboard/admin/service-point-list'));
const ServicePointCreatePage = lazy(() => import('src/pages/dashboard/admin/service-point-create'));
const ServicePointEditPage = lazy(() => import('src/pages/dashboard/admin/service-point-edit'));
const DriverHomePage = lazy(() => import('src/pages/dashboard/driver/home'));
const ServicePointProfilePage = lazy(() => import('src/pages/dashboard/customer/service-point-profile'));
const WalletHistoryPage = lazy(() => import('src/pages/dashboard/driver/wallet-history'));
const DriverProfilePage = lazy(() => import('src/pages/dashboard/driver/profile'));
const PartnerSupportPage = lazy(() => import('src/pages/dashboard/driver/support'));
const CustomerWalletPage = lazy(() => import('src/pages/dashboard/customer/wallet-page'));
const CustomerSupportPage = lazy(() => import('src/pages/dashboard/customer/support'));
const AdminSupportListPage = lazy(() => import('src/pages/dashboard/admin/support/list'));
const AdminDeletedAccountListPage = lazy(() => import('src/pages/dashboard/admin/deleted-account/list'));
const AdminFaqListPage = lazy(() => import('src/pages/dashboard/admin/faq/list'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
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
      { path: 'driver', element: <RoleBasedGuard roles={['PARTNER', 'INTRODUCER']}><DriverHomePage /></RoleBasedGuard> },
      { path: 'tai-xe/vi-tien', element: <RoleBasedGuard roles={['PARTNER', 'INTRODUCER']}><WalletHistoryPage /></RoleBasedGuard> },
      { path: 'tai-xe/ho-so', element: <RoleBasedGuard roles={['PARTNER', 'INTRODUCER']}><DriverProfilePage /></RoleBasedGuard> },
      { path: 'tai-xe/ho-tro', element: <RoleBasedGuard roles={['PARTNER', 'INTRODUCER']}><PartnerSupportPage /></RoleBasedGuard> },
      { path: 'service/:id', element: <RoleBasedGuard roles={['CUSTOMER']}><ServiceDetailPage /></RoleBasedGuard> },
      { path: 'admin/overview', element: <RoleBasedGuard roles={['ADMIN', 'ACCOUNTANT']}><AdminOverviewPage /></RoleBasedGuard> },
      { path: 'admin/live-map', element: <RoleBasedGuard roles={['ADMIN']}><AdminLiveMapPage /></RoleBasedGuard> },
      { path: 'admin/transactions', element: <RoleBasedGuard roles={['ADMIN']}><AdminTransactionsPage /></RoleBasedGuard> },

      { path: 'admin/wallets', element: <RoleBasedGuard roles={['ADMIN', 'ACCOUNTANT']}><WalletPage /></RoleBasedGuard> },
      {
        path: 'admin/partners',
        element: <RoleBasedGuard roles={['ADMIN']}><Outlet /></RoleBasedGuard>,
        children: [
          { element: <PartnerListPage />, index: true },
          { path: ':id', element: <PartnerDetailPage /> },
        ],
      },
      {
        path: 'admin/service-points',
        element: <RoleBasedGuard roles={['ADMIN']}><Outlet /></RoleBasedGuard>,
        children: [
          { element: <ServicePointListPage />, index: true },
          { path: 'new', element: <ServicePointCreatePage /> },
          { path: ':id/edit', element: <ServicePointEditPage /> },
        ],
      },
      {
        path: 'admin/employees',
        element: <RoleBasedGuard roles={['ADMIN']}><Outlet /></RoleBasedGuard>,
        children: [
          { element: <EmployeeListPage />, index: true },
          { path: 'new', element: <EmployeeCreatePage /> },
          { path: ':id/edit', element: <EmployeeEditPage /> },
        ],
      },
      { path: 'admin/settings', element: <RoleBasedGuard roles={['ADMIN']}><SettingsPage /></RoleBasedGuard> },
      { path: 'admin/support', element: <RoleBasedGuard roles={['ADMIN']}><AdminSupportListPage /></RoleBasedGuard> },
      { path: 'admin/users/deleted/list', element: <RoleBasedGuard roles={['ADMIN']}><AdminDeletedAccountListPage /></RoleBasedGuard> },
      { path: 'admin/faqs', element: <RoleBasedGuard roles={['ADMIN']}><AdminFaqListPage /></RoleBasedGuard> },
      { path: 'vi-tien', element: <RoleBasedGuard roles={['CUSTOMER']}><CustomerWalletPage /></RoleBasedGuard> },
      { path: 'cua-hang-cua-ban', element: <RoleBasedGuard roles={['CUSTOMER']}><ServicePointProfilePage /></RoleBasedGuard> },
      { path: 'ho-tro', element: <RoleBasedGuard roles={['CUSTOMER']}><CustomerSupportPage /></RoleBasedGuard> },
    ],
  },
];
