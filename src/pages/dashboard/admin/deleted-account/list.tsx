import { Helmet } from 'react-helmet-async';

import { DeletedAccountListView } from 'src/sections/admin/deleted-account/view';


// ----------------------------------------------------------------------

export default function DeletedAccountListPage() {
    return (
        <>
            <Helmet>
                <title> Admin: Tài khoản đã xóa | Goxu.vn</title>
            </Helmet>

            <DeletedAccountListView />
        </>
    );
}
