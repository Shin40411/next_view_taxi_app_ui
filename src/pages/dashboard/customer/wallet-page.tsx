import { Helmet } from 'react-helmet-async';

import CustomerWalletView from 'src/sections/customer/view/wallet-view';

// ----------------------------------------------------------------------

export default function CustomerWalletPage() {
    return (
        <>
            <Helmet>
                <title>Ví GoXu | Goxu.vn</title>
            </Helmet>

            <CustomerWalletView />
        </>
    );
}
