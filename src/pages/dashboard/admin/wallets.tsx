import { Helmet } from 'react-helmet-async';

import { WalletManagementView } from 'src/sections/admin/wallet/view';


// ----------------------------------------------------------------------

export default function WalletPage() {
    return (
        <>
            <Helmet>
                <title>Hỗ trợ ví khách hàng | Goxu.vn</title>
            </Helmet>

            <WalletManagementView />
        </>
    );
}
