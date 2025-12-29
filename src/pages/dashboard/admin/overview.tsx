import { Helmet } from 'react-helmet-async';

import AdminOverviewView from 'src/sections/admin/overview-view';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function AdminOverviewPage() {
    return (
        <>
            <Helmet>
                <title> Tổng quan | Goxu.vn</title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mt: 2 }}>
                    Thống kê
                </Typography>

                <AdminOverviewView />
            </Container>
        </>
    );
}
