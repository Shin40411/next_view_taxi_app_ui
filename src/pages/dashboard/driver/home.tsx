import { Helmet } from 'react-helmet-async';

import DriverHomeView from 'src/sections/driver/view/home-view';

// ----------------------------------------------------------------------

export default function DriverHomePage() {
    return (
        <>
            <Helmet>
                <title> Trang chủ - Đối tác | Goxu.vn </title>
            </Helmet>

            <DriverHomeView />
        </>
    );
}
