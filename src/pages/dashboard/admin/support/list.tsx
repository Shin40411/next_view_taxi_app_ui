import { Helmet } from 'react-helmet-async';

import SupportListView from 'src/sections/admin/support/view/support-list-view';

// ----------------------------------------------------------------------

export default function SupportListPage() {
    return (
        <>
            <Helmet>
                <title> Hỗ trợ khách hàng | Goxu.vn</title>
            </Helmet>

            <SupportListView />
        </>
    );
}
