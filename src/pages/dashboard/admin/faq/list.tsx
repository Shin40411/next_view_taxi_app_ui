import { Helmet } from 'react-helmet-async';
// sections
import { FaqListView } from 'src/sections/admin/support/view';

// ----------------------------------------------------------------------

export default function FaqListPage() {
    return (
        <>
            <Helmet>
                <title> FAQ | Goxu.vn </title>
            </Helmet>

            <FaqListView />
        </>
    );
}
