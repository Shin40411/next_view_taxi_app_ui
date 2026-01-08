import { Helmet } from 'react-helmet-async';
import SettingsView from 'src/sections/admin/settings/view/settings-view';

// ----------------------------------------------------------------------

export default function SettingsPage() {
    return (
        <>
            <Helmet>
                <title> Cấu hình hệ thống | Goxu.vn</title>
            </Helmet>

            <SettingsView />
        </>
    );
}
