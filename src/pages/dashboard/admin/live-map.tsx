import { Helmet } from 'react-helmet-async';

import AdminLiveMapView from 'src/sections/admin/live-map-view';

// ----------------------------------------------------------------------

export default function AdminLiveMapPage() {
    return (
        <>
            <Helmet>
                <title> Live Map | Goxu.vn</title>
            </Helmet>

            <AdminLiveMapView />
        </>
    );
}
