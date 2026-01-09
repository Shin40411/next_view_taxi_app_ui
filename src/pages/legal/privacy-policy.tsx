import { Helmet } from 'react-helmet-async';

import PrivacyPolicyView from 'src/sections/legal/view/privacy-policy-view';

// ----------------------------------------------------------------------

export default function PrivacyPolicyPage() {
    return (
        <>
            <Helmet>
                <title> Chính sách bảo mật | Goxu </title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <PrivacyPolicyView />
        </>
    );
}
