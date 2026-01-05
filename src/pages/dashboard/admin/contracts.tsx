
import { Helmet } from 'react-helmet-async';

import ContractManagementView from 'src/sections/admin/contract/view/contract-management-view';

// ----------------------------------------------------------------------

export default function ContractManagementPage() {
    return (
        <>
            <Helmet>
                <title>Quản lý hợp đồng | Goxu.vn</title>
            </Helmet>

            <ContractManagementView />
        </>
    );
}
