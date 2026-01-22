import { Helmet } from 'react-helmet-async';

import SupportView from 'src/sections/driver/support/view/support-view';

// ----------------------------------------------------------------------

export default function PartnerSupportPage() {
    return (
        <>
            <Helmet>
                <title> Hỗ trợ khách hàng | Goxu.vn</title>
            </Helmet>

            <SupportView />
        </>
    );
}
