import { Helmet } from 'react-helmet-async';
// @mui
import { Button, Container } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';
// hooks
import { useAdmin } from 'src/hooks/api/use-admin';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
// sections
import { EmployeeNewEditForm } from 'src/sections/admin/employee';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';


// ----------------------------------------------------------------------

export default function EmployeeEditPage() {
    const settings = useSettingsContext();

    const params = useParams();

    const { id } = params;

    const { useGetUser } = useAdmin();

    const { user: currentUser, userLoading } = useGetUser(id);

    if (userLoading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Helmet>
                <title> Chỉnh sửa nhân viên | Goxu.vn</title>
            </Helmet>

            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Chỉnh sửa nhân viên"
                    links={[
                        {
                            name: 'Danh sách nhân viên',
                            href: paths.dashboard.admin.employees.root,
                        },
                        { name: currentUser?.full_name },
                    ]}
                    action={
                        <Button
                            component={RouterLink}
                            href={paths.dashboard.admin.employees.root}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:left-line" />}
                        >
                            Quay lại
                        </Button>
                    }
                    sx={{
                        my: { xs: 3, md: 5 },
                    }}

                />

                <EmployeeNewEditForm currentUser={currentUser} />
            </Container>
        </>
    );
}
