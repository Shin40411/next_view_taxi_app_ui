import { Helmet } from 'react-helmet-async';

import WalletHistoryView from 'src/sections/driver/view/wallet-history-view';

// ----------------------------------------------------------------------

export default function WalletHistoryPage() {
    return (
        <>
            <Helmet>
                <title> Ví tiền & Lịch sử | Goxu.vn</title>
            </Helmet>

            <WalletHistoryView />
        </>
    );
}
