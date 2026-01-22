import { Helmet } from 'react-helmet-async';

// sections
import DriverProfileView from 'src/sections/driver/profile-view';

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
