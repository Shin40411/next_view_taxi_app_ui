import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';

import HomeMapView from 'src/sections/home/home-map-view';
import DriverHomeView from 'src/sections/driver/home-view';

import Button from '@mui/material/Button';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function HomeMapPage() {
    const router = useRouter();
    const { pathname } = useLocation();
    const { user } = useAuthContext();
    const isHome = pathname === '/';

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            router.replace(paths.dashboard.admin.overview);
        }
    }, [user, router]);

    if (user?.role === 'ADMIN') {
        return null;
    }

    if (user?.role === 'PARTNER' && isHome) {
        return (
            <>
                <Helmet>
                    <title> Dashboard Tài xế | Alotaxi</title>
                </Helmet>
                <DriverHomeView />
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title> Trang chủ | Alotaxi</title>
            </Helmet>

            <HomeMapView />
        </>
    );
}
