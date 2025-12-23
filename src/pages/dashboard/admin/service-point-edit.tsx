import { Helmet } from 'react-helmet-async';

import ServicePointCreateEditView from 'src/sections/admin/service-point/view/service-point-create-edit-view';

// ----------------------------------------------------------------------

export default function ServicePointEditPage() {
    return (
        <>
            <Helmet>
                <title> Admin: Chỉnh sửa Điểm Dịch Vụ | AloTaxi </title>
            </Helmet>

            <ServicePointCreateEditView />
        </>
    );
}
