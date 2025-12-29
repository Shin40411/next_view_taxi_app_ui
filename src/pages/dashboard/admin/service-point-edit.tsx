import { Helmet } from 'react-helmet-async';

import ServicePointCreateEditView from 'src/sections/admin/service-point/view/service-point-create-edit-view';

// ----------------------------------------------------------------------

export default function ServicePointEditPage() {
    return (
        <>
            <Helmet>
                <title> Chỉnh sửa CSKD | Goxu.vn </title>
            </Helmet>

            <ServicePointCreateEditView />
        </>
    );
}
