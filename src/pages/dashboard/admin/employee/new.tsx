import { Helmet } from 'react-helmet-async';
// @mui
import { Button, Container } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// sections
import { EmployeeNewEditForm } from 'src/sections/admin/employee';


// ----------------------------------------------------------------------

export default function EmployeeCreatePage() {
    const settings = useSettingsContext();

    return (
        <>
            <Helmet>
                <title> Thêm nhân viên mới | Goxu.vn</title>
            </Helmet>

            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="Thêm nhân viên mới"
                    links={[
                        {
                            name: 'Danh sách nhân viên',
                            href: paths.dashboard.admin.employees.root,
                        },
                        { name: 'Tạo mới' },
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

                <EmployeeNewEditForm />
            </Container>
        </>
    );
}
