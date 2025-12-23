import { Helmet } from 'react-helmet-async';

import DriverHomeView from 'src/sections/driver/home-view';

// ----------------------------------------------------------------------

export default function DriverHomePage() {
    return (
        <>
            <Helmet>
                <title> Dashboard Driver | AloTaxi </title>
            </Helmet>

            <DriverHomeView />
        </>
    );
}
