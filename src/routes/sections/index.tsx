// import { Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// import MainLayout from 'src/layouts/main';
// import { PATH_AFTER_LOGIN } from 'src/config-global';
// import { AuthGuard } from 'src/auth/guard';
// import DashboardLayout from 'src/layouts/dashboard';

// import { LoadingScreen } from 'src/components/loading-screen';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
// import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';


// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth routes
    ...authRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // Main routes
    ...mainRoutes,

    // Components routes
    ...componentsRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
