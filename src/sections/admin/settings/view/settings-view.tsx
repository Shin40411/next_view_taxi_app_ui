import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { paths } from 'src/routes/paths';
import SettingsForm from '../settings-form';

export default function SettingsView() {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Cài đặt hệ thống"
                links={[
                    { name: 'Cấu hình hệ thống', href: paths.dashboard.admin.overview },
                    { name: 'Cài đặt' },
                ]}
                sx={{
                    my: { xs: 3, md: 5 },
                }}
            />

            <SettingsForm />
        </Container>
    );
}
