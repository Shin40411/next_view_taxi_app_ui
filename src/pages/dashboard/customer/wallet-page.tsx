import { Helmet } from 'react-helmet-async';

import CustomerWalletView from 'src/sections/customer/view/wallet-view';

// ----------------------------------------------------------------------

export default function CustomerWalletPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Ví GoXu</title>
            </Helmet>

            <CustomerWalletView />
        </>
    );
}
