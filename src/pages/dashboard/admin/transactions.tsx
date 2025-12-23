import { Helmet } from 'react-helmet-async';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import AdminTransactionsView from 'src/sections/admin/transactions-view';

// ----------------------------------------------------------------------

export default function AdminTransactionsPage() {
    return (
        <>
            <Helmet>
                <title> Admin: Giao dịch | Alotaxi</title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Quản lý Giao dịch
                </Typography>

                <AdminTransactionsView />
            </Container>
        </>
    );
}
