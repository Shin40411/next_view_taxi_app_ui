import { Helmet } from 'react-helmet-async';

import Container from '@mui/material/Container';

import AdminTransactionsView from 'src/sections/admin/transactions-view';

// ----------------------------------------------------------------------

export default function AdminTransactionsPage() {
    return (
        <>
            <Helmet>
                <title> Giao dịch | Goxu.vn</title>
            </Helmet>

            <Container maxWidth="xl" sx={{ my: 5 }}>
                <AdminTransactionsView />
            </Container>
        </>
    );
}
