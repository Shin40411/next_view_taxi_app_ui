import { Helmet } from 'react-helmet-async';
import DriverProfileView from 'src/sections/driver/view/profile-view';

// ----------------------------------------------------------------------

export default function DriverProfilePage() {
    return (
        <>
            <Helmet>
                <title> Hồ sơ tài xế - CTV | Goxu.vn</title>
            </Helmet>

            <DriverProfileView />
        </>
    );
}
