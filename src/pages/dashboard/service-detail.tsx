import { Helmet } from 'react-helmet-async';

import ServiceDetailView from 'src/sections/home/service-detail-view';

// ----------------------------------------------------------------------

export default function ServiceDetailPage() {
    return (
        <>
            <Helmet>
                <title> Chi tiết dịch vụ | Alotaxi</title>
            </Helmet>

            <ServiceDetailView />
        </>
    );
}
