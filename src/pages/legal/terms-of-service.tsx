import { Helmet } from 'react-helmet-async';

import TermsOfServiceView from 'src/sections/legal/view/terms-of-service-view';

// ----------------------------------------------------------------------

export default function TermsOfServicePage() {
    return (
        <>
            <Helmet>
                <title> Điều khoản và chính sách | Goxu </title>
            </Helmet>

            <TermsOfServiceView />
        </>
    );
}
