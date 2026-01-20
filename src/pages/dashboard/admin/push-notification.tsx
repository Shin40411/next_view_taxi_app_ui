import { Helmet } from 'react-helmet-async';
// sections
import PushNotificationView from 'src/sections/admin/settings/view/push-notification-view';

// ----------------------------------------------------------------------

export default function PushNotificationPage() {
    return (
        <>
            <Helmet>
                <title> Cấu hình thông báo đẩy | Goxu.vn </title>
            </Helmet>

            <PushNotificationView />
        </>
    );
}
