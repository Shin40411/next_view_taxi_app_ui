import { Helmet } from 'react-helmet-async';
// sections
import ServicePointProfileView from 'src/sections/customer/service-point/view/service-point-profile-view';

// ----------------------------------------------------------------------

export default function ServicePointProfilePage() {
    return (
        <>
            <Helmet>
                <title> Cửa hàng của bạn | Goxu.vn </title>
            </Helmet>

            <ServicePointProfileView />
        </>
    );
}
