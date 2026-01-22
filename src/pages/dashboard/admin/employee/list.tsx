import { Helmet } from 'react-helmet-async';

// sections
import { EmployeeListView } from 'src/sections/admin/employee/view';

// ----------------------------------------------------------------------

export default function EmployeeListPage() {
    return (
        <>
            <Helmet>
                <title> Danh sách nhân viên | Goxu.vn</title>
            </Helmet>

            <EmployeeListView />
        </>
    );
}
