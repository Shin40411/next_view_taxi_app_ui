import { useState, useCallback } from 'react';
// @mui
import {
    Card,
    Table,
    Button,
    Tooltip,
    TableBody,
    Container,
    IconButton,
    TableContainer,
    Tabs,
    Tab,
} from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
import { useAdmin } from 'src/hooks/api/use-admin';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
    useTable,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';
// types
import { IUserAdmin, IUserTableFilters, IUserTableFilterValue } from 'src/types/user';
//
import EmployeeTableRow from '../employee-table-row';
import EmployeeTableToolbar from '../employee-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Tên nhân viên' },
    { id: 'username', label: 'Tên tài khoản' },
    { id: 'role', label: 'Vai trò' },
    { id: '' },
];

const defaultFilters: IUserTableFilters = {
    name: '',
    role: [],
    status: 'all',
};

// ----------------------------------------------------------------------

export default function EmployeeListView() {
    const table = useTable();

    const settings = useSettingsContext();

    const router = useRouter();

    const confirm = useBoolean();



    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { useGetUsers, deleteUser } = useAdmin();

    const [filters, setFilters] = useState(defaultFilters);



    const [role, setRole] = useState('ACCOUNTANT');

    const { users, usersTotal, usersLoading, usersEmpty, usersMutate } = useGetUsers(role, table.page + 1, table.rowsPerPage, filters.name);

    const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        setRole(newValue);
        table.onResetPage();
    }, [table]);

    const handleFilters = useCallback(
        (name: string, value: IUserTableFilterValue) => {
            table.onResetPage();
            setFilters((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        },
        [table]
    );

    const handleEditRow = useCallback(
        (id: string) => {
            router.push(paths.dashboard.admin.employees.edit(id));
        },
        [router]
    );
    const handleDeleteRow = useCallback(async () => {
        try {
            if (deleteId) {
                await deleteUser(deleteId);
                usersMutate();
                setDeleteId(null);
                confirm.onFalse();
            } else {
                enqueueSnackbar('Xóa tài khoản thất bại', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Xóa tài khoản thất bại', { variant: 'error' });
        }
    }, [deleteId, confirm, deleteUser, usersMutate]);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Danh sách nhân viên"
                links={[
                    {
                        name: 'Quản lý',
                        href: paths.dashboard.admin.employees.root,
                    },
                    { name: 'Nhân viên' },
                ]}
                action={
                    <Button
                        component={RouterLink}
                        to={paths.dashboard.admin.employees.new}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        Thêm nhân viên
                    </Button>
                }
                sx={{
                    mt: { xs: 3, md: 5 },
                    mb: 2,
                }}
            />

            <Card sx={{ mb: 1 }}>
                <Tabs
                    value={role}
                    onChange={handleChangeTab}
                    sx={{
                        px: 2.5,
                    }}
                >
                    {[
                        { value: 'ACCOUNTANT', label: 'Kế toán' },
                        { value: 'MONITOR', label: 'Quản lý' },
                    ].map((tab) => (
                        <Tab key={tab.value} value={tab.value} label={tab.label} />
                    ))}
                </Tabs>

                <EmployeeTableToolbar
                    filters={filters}
                    onFilters={handleFilters}
                />

                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <Scrollbar>
                        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                            <TableHeadCustom
                                order={table.order}
                                orderBy={table.orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={users.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                            />

                            <TableBody>
                                {users.map((row) => (
                                    <EmployeeTableRow
                                        key={row.id}
                                        row={row}
                                        selected={table.selected.includes(row.id)}
                                        onSelectRow={() => table.onSelectRow(row.id)}

                                        onEditRow={() => handleEditRow(row.id)}
                                        onDeleteRow={() => {
                                            setDeleteId(row.id);
                                            confirm.onTrue();
                                        }}
                                    />
                                ))}

                                <TableEmptyRows
                                    height={table.dense ? 52 : 72}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)}
                                />

                                <TableNoData notFound={usersEmpty} />
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>

                <TablePaginationCustom
                    count={usersTotal}
                    page={table.page}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                    //
                    dense={table.dense}
                    onChangeDense={table.onChangeDense}
                />


                <ConfirmDialog
                    open={confirm.value}
                    onClose={confirm.onFalse}
                    title="Khoá tài khoản"
                    content="Bạn có chắc chắn muốn khoá tài khoản này không? Hành động này không thể hoàn tác."
                    action={
                        <Button variant="contained" color="error" onClick={handleDeleteRow}>
                            Khoá
                        </Button>
                    }
                />
            </Card>
        </Container>
    );
}
// Helper for RouterLink
import { Link as RouterLink } from 'react-router-dom'; import { enqueueSnackbar } from 'notistack';

