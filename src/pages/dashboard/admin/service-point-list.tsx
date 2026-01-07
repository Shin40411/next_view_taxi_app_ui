import { Helmet } from 'react-helmet-async';

import ServicePointListView from 'src/sections/admin/service-point/view/service-point-list-view';

// ----------------------------------------------------------------------

export default function ServicePointListPage() {
    return (
        <>
            <Helmet>
                <title> Quản lý Điểm Dịch Vụ | Goxu.vn </title>
            </Helmet>

            <ServicePointListView />
        </>
    );
}
