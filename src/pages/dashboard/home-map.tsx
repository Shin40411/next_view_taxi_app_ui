import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';

import HomeMapView from 'src/sections/home/home-map-view';
import DriverHomeView from 'src/sections/driver/home-view';
import CustomerHomeView from 'src/sections/customer/home-view';

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

    const searchParams = new URLSearchParams(useLocation().search);
    const isMapView = searchParams.get('view') === 'map';

    if ((user?.role === 'PARTNER' || user?.role === 'INTRODUCER') && isHome) {
        return (
            <>
                <Helmet>
                    <title> Đối tác | Goxu.vn</title>
                </Helmet>
                <DriverHomeView />
            </>
        );
    }

    if (user?.role === 'CUSTOMER') {
        return (
            <>
                <Helmet>
                    <title> Cơ sở kinh doanh | Goxu.vn</title>
                </Helmet>
                <CustomerHomeView />
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title> Trang chủ | Goxu.vn</title>
            </Helmet>

            <HomeMapView />
        </>
    );
}
