import { Helmet } from 'react-helmet-async';

import WalletHistoryView from 'src/sections/driver/wallet-history-view';

// ----------------------------------------------------------------------

export default function WalletHistoryPage() {
    return (
        <>
            <Helmet>
                <title> Ví tiền & Lịch sử | Alotaxi Driver</title>
            </Helmet>

            <WalletHistoryView />
        </>
    );
}
