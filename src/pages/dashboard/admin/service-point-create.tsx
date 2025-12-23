import { Helmet } from 'react-helmet-async';

import ServicePointCreateEditView from 'src/sections/admin/service-point/view/service-point-create-edit-view';

// ----------------------------------------------------------------------

export default function ServicePointCreatePage() {
    return (
        <>
            <Helmet>
                <title> Admin: Tạo Điểm Dịch Vụ | AloTaxi </title>
            </Helmet>

            <ServicePointCreateEditView />
        </>
    );
}
