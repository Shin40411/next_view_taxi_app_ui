import { Helmet } from 'react-helmet-async';

import PartnerDetailView from 'src/sections/admin/partner/view/partner-detail-view';

// ----------------------------------------------------------------------

export default function PartnerDetailPage() {
    return (
        <>
            <Helmet>
                <title> Chi tiết đối tác | Goxu.vn </title>
            </Helmet>

            <PartnerDetailView />
        </>
    );
}
