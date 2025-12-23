import { Helmet } from 'react-helmet-async';

import PartnerDetailView from 'src/sections/admin/partner/view/partner-detail-view';

// ----------------------------------------------------------------------

export default function PartnerDetailPage() {
    return (
        <>
            <Helmet>
                <title> Admin: Chi tiết đối tác | AloTaxi </title>
            </Helmet>

            <PartnerDetailView />
        </>
    );
}
