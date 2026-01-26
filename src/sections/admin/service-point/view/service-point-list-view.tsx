import { enqueueSnackbar } from 'notistack';
import { useState, ChangeEvent } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { Container } from '@mui/material';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useAdmin } from 'src/hooks/api/use-admin';

import { fDate } from 'src/utils/format-time';
import { fPoint } from 'src/utils/format-number';
import { getFullImageUrl } from 'src/utils/get-image';

import { ASSETS_API } from 'src/config-global';
import { _PROVINCES } from 'src/_mock/_provinces';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import TableNoData from 'src/components/table/table-no-data';
import { useSettingsContext } from 'src/components/settings';
import PasswordReset from 'src/components/dialogs/password-reset';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function ServicePointListView() {
    const router = useRouter();
    const { useGetUsers, deleteUser } = useAdmin();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterName, setFilterName] = useState('');
    const [filterProvince, setFilterProvince] = useState('0'); // 0 for all
    const [resetPasswordId, setResetPasswordId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const confirm = useBoolean();
    const popover = usePopover();
    const settings = useSettingsContext();

    const { users, usersTotal, usersEmpty, usersMutate } = useGetUsers('CUSTOMER', page + 1, rowsPerPage, filterName, filterProvince === '0' ? undefined : filterProvince);

    const handleFilterName = (event: ChangeEvent<HTMLInputElement>) => {
        setFilterName(event.target.value);
        setPage(0);
    };

    const handleFilterProvince = (event: ChangeEvent<HTMLInputElement>) => {
        setFilterProvince(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (id: string) => {
        router.push(paths.dashboard.admin.servicePoints.edit(id));
    };

    const handleNew = () => {
        router.push(paths.dashboard.admin.servicePoints.new);
    };

    const handleDelete = async () => {
        try {
            if (deleteId) {
                await deleteUser(deleteId);
                enqueueSnackbar('Khoá tài khoản thành công', { variant: 'success' });
                usersMutate();
                confirm.onFalse();
                setDeleteId(null);
            } else {
                enqueueSnackbar('Khoá tài khoản thất bại', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Khoá tài khoản thất bại', { variant: 'error' });
        }
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Danh sách Công ty/ CSKD"
                links={[
                    {
                        name: 'Quản lý',
                    },
                    { name: 'Công ty/ CSKD' },
                ]}
                action={
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={handleNew}
                    >
                        Tạo công ty/ CSKD
                    </Button>
                }
                sx={{
                    mt: { xs: 3, md: 5 },
                    mb: 2,
                }}
            />
            <Card sx={{ my: 1 }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 2, sm: 2 }}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ p: 2.5 }}
                >
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
                        <TextField
                            value={filterName}
                            onChange={handleFilterName}
                            placeholder="Tìm tên công ty..."
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: 280 }}
                        />

                        <TextField
                            select
                            label="Tỉnh / Thành phố"
                            value={filterProvince}
                            onChange={handleFilterProvince}
                            sx={{ width: 200 }}
                            SelectProps={{ native: false }}
                        >
                            <MenuItem value="0">Tất cả</MenuItem>
                            {_PROVINCES.map((option) => (
                                <MenuItem key={option.code} value={option.name}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        {/* <Button
                        variant="soft"
                        startIcon={<Iconify icon="eva:cloud-download-fill" />}
                        onClick={() => {
                            const exportData = users.map(item => ({
                                ID: item.id,
                                Name: item.full_name,
                                Phone: item.username,
                                TaxID: item.tax_id,
                                Wallet: item.servicePoints?.[0]?.advertising_budget || 0
                            }));
                            exportToCSV(exportData, `service_points_report_${new Date().toISOString().split('T')[0]}.csv`);
                        }}
                    >
                        Xuất báo cáo
                    </Button> */}

                    </Stack>
                </Stack>

                <Divider />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 960 }}>
                            <TableHead sx={{ bgcolor: 'grey.200' }}>
                                <TableRow>
                                    <TableCell>TÊN CÔNG TY / ĐỊA CHỈ</TableCell>
                                    <TableCell>LIÊN HỆ</TableCell>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>HOA HỒNG</TableCell>
                                    <TableCell>NGÂN SÁCH (Goxu)</TableCell>
                                    <TableCell>NGÀY TẠO</TableCell>
                                    <TableCell>HỢP ĐỒNG</TableCell>
                                    <TableCell align="right" />
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {users.map((row) => {
                                    const servicePoint = row.servicePoints?.[0];

                                    return (
                                        <TableRow key={row.id} hover>
                                            <TableCell>
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Avatar alt={row.full_name} src={getFullImageUrl(row.avatar)} />

                                                    <Stack spacing={0.5}>
                                                        <Typography variant="subtitle2" noWrap>
                                                            {row.full_name}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                                            {servicePoint?.address || '---'}
                                                        </Typography>
                                                        {servicePoint?.name && servicePoint.name !== row.full_name && (
                                                            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                                                                ({servicePoint.name})
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </Stack>
                                            </TableCell>

                                            <TableCell>
                                                <Stack spacing={0.5}>
                                                    <Typography variant="body2">{row.username}</Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        MST: {row.tax_id || '---'}
                                                    </Typography>
                                                </Stack>
                                            </TableCell>

                                            <TableCell>
                                                {servicePoint ? (
                                                    <Stack spacing={0.5}>
                                                        <Typography variant="body2" fontWeight={800}>
                                                            {fPoint(servicePoint.reward_amount)}
                                                        </Typography>
                                                    </Stack>
                                                ) : (
                                                    '---'
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                                                    {fPoint(servicePoint?.advertising_budget || 0)}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Typography variant="body2">{fDate(row.created_at)}</Typography>
                                            </TableCell>

                                            <TableCell>
                                                {servicePoint?.contract ? (
                                                    <Link
                                                        color="Info"
                                                        variant="button"
                                                        href={`${ASSETS_API}/${servicePoint.contract}`}
                                                        target="_blank"
                                                        sx={{
                                                            alignItems: 'center',
                                                            display: 'inline-flex',
                                                        }}
                                                    >
                                                        Xem hợp đồng
                                                    </Link>
                                                ) : (
                                                    'Chưa có'
                                                )}
                                            </TableCell>

                                            <TableCell align="right">
                                                <IconButton color={popover.open ? 'inherit' : 'default'} onClick={(e) => {
                                                    popover.onOpen(e);
                                                    setSelectedId(row.id);
                                                }}>
                                                    <Iconify icon="eva:more-vertical-fill" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                <TableNoData notFound={usersEmpty} />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={usersTotal}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số hàng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`
                    }
                />

                <CustomPopover
                    open={popover.open}
                    onClose={popover.onClose}
                    arrow="right-top"
                    sx={{ width: 160 }}
                >
                    <MenuItem
                        onClick={() => {
                            if (selectedId) handleEdit(selectedId);
                            popover.onClose();
                        }}
                    >
                        <Iconify icon="eva:edit-fill" />
                        Sửa thông tin
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            if (selectedId) setResetPasswordId(selectedId);
                            popover.onClose();
                        }}
                    >
                        <Iconify icon="hugeicons:reset-password" />
                        Cấp lại MK
                    </MenuItem>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <MenuItem
                        onClick={() => {
                            if (selectedId) {
                                setDeleteId(selectedId);
                                confirm.onTrue();
                            }
                            popover.onClose();
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <Iconify icon="eva:lock-fill" />
                        Khoá tài khoản
                    </MenuItem>
                </CustomPopover>

                <PasswordReset
                    open={!!resetPasswordId}
                    onClose={() => setResetPasswordId(null)}
                    currentUser={users.find((user) => user.id === resetPasswordId)}
                />

                <ConfirmDialog
                    open={confirm.value}
                    onClose={confirm.onFalse}
                    title="Khoá tài khoản"
                    content="Bạn có chắc chắn muốn khoá tài khoản này không? Hành động này không thể hoàn tác."
                    action={
                        <Button variant="contained" color="error" onClick={handleDelete}>
                            Khoá
                        </Button>
                    }
                />
            </Card>
        </Container>
    );
}
