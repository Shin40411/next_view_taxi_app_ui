import { Helmet } from 'react-helmet-async';

// sections
import ServicePointProfileView from 'src/sections/customer/view/service-point-profile-view';

// ----------------------------------------------------------------------

export default function ServicePointProfilePage() {
    return (
        <>
            <Helmet>
                <title> Thông tin công ty | Goxu.vn </title>
            </Helmet>

            <ServicePointProfileView />
        </>
    );
}
