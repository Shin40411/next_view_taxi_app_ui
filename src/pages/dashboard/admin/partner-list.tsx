import { Helmet } from 'react-helmet-async';

import PartnerListView from 'src/sections/admin/partner/view/partner-list-view';

// ----------------------------------------------------------------------

export default function PartnerListPage() {
    return (
        <>
            <Helmet>
                <title> Danh sách đối tác | Goxu.vn </title>
            </Helmet>

            <PartnerListView />
        </>
    );
}
