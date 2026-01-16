import { useState, useCallback } from 'react';
// @mui
import {
    Card,
    Table,
    Button,
    TableBody,
    Container,
    TableContainer,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
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
    TablePaginationCustom,
} from 'src/components/table';
// types
import { IUserTableFilters, IUserTableFilterValue } from 'src/types/user';
//
import DeletedAccountTableRow from '../deleted-account-table-row';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'stt', label: 'STT' },
    { id: 'name', label: 'Tên' },
    { id: 'username', label: 'Tên đăng nhập' },
    { id: 'role', label: 'Vai trò' },
    { id: '' },
];

const defaultFilters: IUserTableFilters = {
    name: '',
    role: [],
    status: 'all',
};

// ----------------------------------------------------------------------

export default function DeletedAccountListView() {
    const table = useTable();

    const settings = useSettingsContext();

    const router = useRouter();

    const confirm = useBoolean();
    const confirmDelete = useBoolean();

    const [restoreId, setRestoreId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { useGetDeletedUsers, restoreUser, deleteUserPermanent } = useAdmin();

    const [filters, setFilters] = useState(defaultFilters);

    const { users, usersTotal, usersLoading, usersEmpty, usersMutate } = useGetDeletedUsers(table.page + 1, table.rowsPerPage, filters.name);

    const handleRestoreRow = useCallback(async () => {
        try {
            if (restoreId) {
                await restoreUser(restoreId);
                enqueueSnackbar('Khôi phục tài khoản thành công', { variant: 'success' });
                usersMutate();
                setRestoreId(null);
                confirm.onFalse();
            }
        } catch (error) {
            enqueueSnackbar('Khôi phục tài khoản thất bại', { variant: 'error' });
        }
    }, [restoreId, confirm, restoreUser, usersMutate]);

    const handleDeleteRow = useCallback(async () => {
        try {
            if (deleteId) {
                setIsDeleting(true);
                await deleteUserPermanent(deleteId);
                enqueueSnackbar('Xóa vĩnh viễn tài khoản thành công', { variant: 'success' });
                usersMutate();
                setDeleteId(null);
                confirmDelete.onFalse();
            }
        } catch (error: any) {
            enqueueSnackbar(error.message || 'Xóa vĩnh viễn tài khoản thất bại', { variant: 'error' });
        } finally {
            setIsDeleting(false);
        }
    }, [deleteId, confirmDelete, deleteUserPermanent, usersMutate]);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Tài khoản đã khoá"
                links={[
                    {
                        name: 'Cấu hình hệ thống',
                        href: paths.dashboard.admin.overview,
                    },
                    { name: 'Tài khoản đã khoá' },
                ]}
                sx={{
                    mt: { xs: 3, md: 5 },
                    mb: 1,
                }}
            />

            <Card sx={{ mb: 1 }}>

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
                                {users.map((row, index) => (
                                    <DeletedAccountTableRow
                                        key={row.id}
                                        index={(table.page * table.rowsPerPage) + index + 1}
                                        row={row}
                                        selected={table.selected.includes(row.id)}
                                        onSelectRow={() => table.onSelectRow(row.id)}
                                        onRestoreRow={() => {
                                            setRestoreId(row.id);
                                            confirm.onTrue();
                                        }}
                                        onDeleteRow={() => {
                                            setDeleteId(row.id);
                                            confirmDelete.onTrue();
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
                    dense={table.dense}
                    onChangeDense={table.onChangeDense}
                />

                <ConfirmDialog
                    open={confirm.value}
                    onClose={confirm.onFalse}
                    title="Khôi phục tài khoản"
                    content="Bạn có chắc chắn muốn khôi phục tài khoản này không?"
                    action={
                        <Button variant="contained" color="primary" onClick={handleRestoreRow}>
                            Khôi phục
                        </Button>
                    }
                />

                <ConfirmDialog
                    open={confirmDelete.value}
                    onClose={confirmDelete.onFalse}
                    title="Xóa vĩnh viễn tài khoản"
                    content="Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này không? Hành động này không thể hoàn tác và sẽ xóa TOÀN BỘ dữ liệu liên quan!"
                    action={
                        <LoadingButton variant="contained" color="error" onClick={handleDeleteRow} loading={isDeleting}>
                            Xóa vĩnh viễn
                        </LoadingButton>
                    }
                />
            </Card>
        </Container>
    );
}
