import { useState } from 'react';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import { fPoint } from 'src/utils/format-number';
import { exportToCSV } from 'src/utils/export-csv';
import EmptyContent from 'src/components/empty-content';
import { useAdmin } from 'src/hooks/api/use-admin';
import { fDate } from 'src/utils/format-time';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import PartnerCreateDialog from '../partner-create-dialog';
import { getFullImageUrl } from 'src/utils/get-image';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { Container, Tooltip } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function PartnerListView() {
    const router = useRouter();
    const { useGetUsers, deleteUser } = useAdmin();
    const settings = useSettingsContext();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterName, setFilterName] = useState('');
    const [filterRole, setFilterRole] = useState('PARTNER');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const confirm = useBoolean();

    const { users, usersTotal, usersMutate } = useGetUsers(filterRole, page + 1, rowsPerPage, filterName);

    const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterName(event.target.value);
        setPage(0);
    };

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setFilterRole(newValue);
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewDetail = (id: string) => {
        router.push(paths.dashboard.admin.partners.detail(id));
    };

    const createOriginal = useBoolean();

    const handleDelete = async () => {
        try {
            if (deleteId) {
                await deleteUser(deleteId);
                enqueueSnackbar('Khoá tài khoản thành công', { variant: 'success' });
                usersMutate();
                confirm.onFalse();
                setDeleteId(null);
            }
            else {
                enqueueSnackbar('Khoá tài khoản thất bại', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Khoá tài khoản thất bại', { variant: 'error' });
        }
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Danh sách tài xế/ CTV"
                links={[
                    {
                        name: 'Quản lý',
                    },
                    { name: 'Tài xế/ CTV' },
                ]}
                action={
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={createOriginal.onTrue}
                    >
                        Tạo tài xế/ CTV
                    </Button>
                }
                sx={{
                    mt: { xs: 3, md: 5 },
                    mb: 1,
                }}
            />
            <Card sx={{ my: 2 }}>

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ p: 2.5 }}
                    spacing={2}
                >
                    <Tabs
                        value={filterRole}
                        onChange={handleChangeTab}
                        sx={{
                            px: 2.5,
                        }}
                    >
                        {[
                            { value: 'PARTNER', label: 'Tài xế' },
                            { value: 'INTRODUCER', label: 'Cộng tác viên' },
                        ].map((tab) => (
                            <Tab key={tab.value} value={tab.value} label={tab.label} />
                        ))}
                    </Tabs>
                    <TextField
                        value={filterName}
                        onChange={handleFilterName}
                        placeholder="Tìm tên, SĐT, biển số..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 280 }}
                    />
                </Stack>
                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 960 }}>
                            <TableHead sx={{ bgcolor: 'grey.200' }}>
                                <TableRow>
                                    <TableCell>ĐỐI TÁC</TableCell>
                                    <TableCell>LIÊN HỆ</TableCell>
                                    <TableCell>VÍ TÀI KHOẢN (Goxu)</TableCell>
                                    <TableCell align="center">TRẠNG THÁI</TableCell>
                                    <TableCell>NGÀY TẠO</TableCell>
                                    <TableCell align="right">HÀNH ĐỘNG</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {users.map((row) => (
                                    <TableRow key={row.id} hover onClick={() => handleViewDetail(row.id)} sx={{ cursor: 'pointer' }}>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Avatar
                                                    alt={row.full_name}
                                                    src={getFullImageUrl(row.avatarUrl || (row as any).avatar)}
                                                    sx={{ width: 50, height: 50, mb: 2 }}
                                                >
                                                    {row.full_name.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {row.full_name}
                                                    </Typography>
                                                    {row.role === 'PARTNER' && row.partnerProfile?.vehicle_plate && (
                                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                                                            {row.partnerProfile.vehicle_plate}
                                                        </Typography>
                                                    )}

                                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" gap={1}>
                                                        {row.contracts?.some((c: any) => c.status === 'ACTIVE') ? (
                                                            <Chip size="small" label="Hợp đồng đã được duyệt" color="success" variant="soft" sx={{ height: 20, fontSize: '0.75rem' }} />
                                                        ) : row.contracts?.some((c: any) => c.status === 'INACTIVE') ? (
                                                            <Chip size="small" label="Hợp đồng chưa được duyệt" color="warning" variant="soft" sx={{ height: 20, fontSize: '0.75rem' }} />
                                                        ) : (
                                                            <Chip size="small" label="Chưa ký hợp đồng" color="error" variant="soft" sx={{ height: 20, fontSize: '0.75rem' }} />
                                                        )}

                                                        {(
                                                            row.partnerProfile?.status === 'APPROVED'
                                                        ) ? (
                                                            <Chip size="small" label="Đã duyệt" color="info" variant="soft" sx={{ height: 20, fontSize: '0.75rem' }} />
                                                        ) :
                                                            row.partnerProfile?.status === 'REJECTED' ? (
                                                                <Chip size="small" label="Đã từ chối" color="error" variant="soft" sx={{ height: 20, fontSize: '0.75rem' }} />
                                                            )
                                                                :
                                                                (
                                                                    <Chip size="small" label="Đang chờ duyệt" color="warning" variant="soft" sx={{ height: 20, fontSize: '0.75rem' }} />
                                                                )
                                                        }
                                                    </Stack>
                                                </Box>
                                            </Stack>
                                        </TableCell>

                                        <TableCell>
                                            <Stack>
                                                <Typography variant="body2">{row.username}</Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{row.phone_number || 'Chưa cập nhật số điện thoại'}</Typography>
                                            </Stack>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="subtitle2" sx={{ color: 'warning.main' }}>
                                                {fPoint(row.partnerProfile?.wallet_balance || 0)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="center">
                                            <Chip
                                                label={row.partnerProfile?.is_online ? 'Đang hoạt động' : 'Ngoại tuyến'}
                                                color={row.partnerProfile?.is_online ? 'success' : 'default'}
                                                size="small"
                                                variant="soft"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2">{fDate(row.created_at)}</Typography>
                                        </TableCell>

                                        <TableCell align="right">
                                            <Tooltip title="Sửa thông tin">
                                                <IconButton onClick={(e) => { e.stopPropagation(); handleViewDetail(row.id); }}>
                                                    <Iconify icon="eva:arrow-ios-forward-fill" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Khoá tài khoản">
                                                <IconButton onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteId(row.id);
                                                    confirm.onTrue();
                                                }} sx={{ color: 'error.main' }}>
                                                    <Iconify icon="eva:lock-fill" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {users.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <EmptyContent
                                                title="Không có dữ liệu"
                                                description="Chưa có đối tác nào được tạo"
                                                imgUrl="/assets/icons/empty/ic_content.svg"
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
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

                <PartnerCreateDialog
                    open={createOriginal.value}
                    onClose={createOriginal.onFalse}
                    onUpdate={usersMutate}
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
            </Card >
        </Container>
    );
}
