'use client';

import { ChangeEvent, useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import Container from '@mui/material/Container';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useSettingsContext } from 'src/components/settings';
import { ASSETS_API, HOST_API } from 'src/config-global';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useWallet } from 'src/hooks/api/use-wallet';
import { useSnackbar } from 'src/components/snackbar';
import { Box } from '@mui/material';
import { IWalletTransaction } from 'src/types/wallet';
import Label from 'src/components/label';
import { fDateTime } from 'src/utils/format-time';
import EmptyContent from 'src/components/empty-content';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export default function WalletManagementView() {
    const settings = useSettingsContext();
    const { enqueueSnackbar } = useSnackbar();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState<string>('');
    const [isAccept, setIsAccept] = useState(false);
    const [reason, setReason] = useState('');

    const { useGetAllWallets, resolveTransaction } = useWallet();
    const { wallets, walletsTotal, walletsLoading, mutate } = useGetAllWallets(
        page + 1,
        rowsPerPage,
        searchTerm,
        startDate,
        endDate
    );

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenConfirm = (id: string, accept: boolean) => {
        setSelectedId(id);
        setIsAccept(accept);
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
        setSelectedId('');
        setReason('');
    };

    const handleConfirmResolve = async () => {
        try {
            await resolveTransaction(selectedId, isAccept, reason);
            enqueueSnackbar(isAccept ? 'Đã duyệt giao dịch' : 'Đã từ chối giao dịch', { variant: isAccept ? 'success' : 'info' });
            mutate();
            handleCloseConfirm();
        } catch (error: any) {
            console.error(error);
            enqueueSnackbar(error.message || 'Xử lý thất bại', { variant: 'error' });
        }
    };

    const renderStatus = (status: string) => {
        const color =
            (status === 'SUCCESS' && 'success') ||
            (status === 'PENDING' && 'warning') ||
            'error';
        const label =
            (status === 'SUCCESS' && 'Thành công') ||
            (status === 'PENDING' && 'Đang chờ') ||
            'Thất bại';

        return (
            <Label color={color} variant="filled">
                {label}
            </Label>
        );
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Lịch sử giao dịch ví khách hàng"
                links={[
                    {
                        name: 'Hỗ trợ khách hàng',
                    },
                    { name: 'Ví Goxu' },
                ]}
                sx={{ mt: 1 }}
            />
            <Card sx={{ mt: 3 }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<Iconify icon="vscode-icons:file-type-excel" />}
                    >
                        Xuất báo cáo
                    </Button>
                    <Stack direction="row" spacing={2} sx={{ flexGrow: 1, justifyContent: 'flex-end' }}>
                        <TextField
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: 200 }}
                            size="small"
                        />
                        <DatePicker
                            label="Từ ngày"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                        <DatePicker
                            label="Đến ngày"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                    </Stack>
                </Box>
                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <Scrollbar>
                        <Table sx={{ minWidth: 960 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Người gửi</TableCell>
                                    <TableCell>Người nhận</TableCell>
                                    <TableCell align="right">Số tiền</TableCell>
                                    <TableCell align="center">Loại giao dịch</TableCell>
                                    <TableCell align="center">Trạng thái</TableCell>
                                    <TableCell>Thông tin ngân hàng</TableCell>
                                    <TableCell>Hóa đơn</TableCell>
                                    <TableCell>Ngày tạo</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {walletsLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">Đang tải...</TableCell>
                                    </TableRow>
                                ) : wallets.map((row: IWalletTransaction, index: number) => (
                                    <TableRow hover key={row.id}>
                                        <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2">{row.sender?.full_name}</Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                                                {row.sender?.username}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {row.receiver ? (
                                                <>
                                                    <Typography variant="subtitle2">{row.receiver.full_name}</Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                                                        {row.receiver.username}
                                                    </Typography>
                                                </>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                                                {Number(row.amount * 1000).toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={
                                                    row.type === 'DEPOSIT' ?
                                                        'Nạp' : row.type === 'WITHDRAW' ?
                                                            'Rút' : 'Chuyển'
                                                }
                                                size="medium"
                                                variant="filled"
                                                color={
                                                    row.type === 'DEPOSIT' ? 'success' :
                                                        row.type === 'WITHDRAW' ? 'error' : 'warning'
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {renderStatus(row.status)}
                                        </TableCell>
                                        <TableCell>
                                            {row.sender?.bankAccount ? (
                                                <Stack spacing={0.5}>
                                                    <Typography variant="body2">{row.sender.bankAccount.bank_name}</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{row.sender.bankAccount.account_number}</Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{row.sender.bankAccount.account_holder_name}</Typography>
                                                </Stack>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {row.bill ? (
                                                <Link href={`${ASSETS_API}/${row.bill}`} target="_blank" rel="noopener">
                                                    Xem biên lai chuyển khoản
                                                </Link>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell>{fDateTime(row.created_at)}</TableCell>
                                        <TableCell align="right">
                                            {row.status === 'PENDING' && (
                                                <Box display="flex" justifyContent="flex-end" gap={1}>
                                                    <Tooltip title="Duyệt">
                                                        <Button color="success" variant='contained' size='large' onClick={() => handleOpenConfirm(row.id, true)} startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}>
                                                            Duyệt
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip title="Từ chối">
                                                        <Button color="error" variant='outlined' size='large' sx={{ whiteSpace: 'nowrap' }} onClick={() => handleOpenConfirm(row.id, false)} startIcon={<Iconify icon="eva:close-circle-fill" />}>
                                                            Từ chối
                                                        </Button>
                                                    </Tooltip>
                                                </Box>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!walletsLoading && wallets.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">
                                            <EmptyContent title='Không tìm thấy giao dịch nào' />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={walletsTotal}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số dòng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
                />
            </Card>

            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title={isAccept ? 'Duyệt giao dịch' : 'Từ chối giao dịch'}
                content={
                    <>
                        <Typography sx={{ mb: 3 }}>
                            {isAccept ? 'Bạn có chắc chắn muốn duyệt giao dịch này không?' : 'Bạn có chắc chắn muốn từ chối giao dịch này không?'}
                        </Typography>
                        {!isAccept && (
                            <TextField
                                fullWidth
                                label="Lý do từ chối"
                                placeholder="Nhập lý do từ chối..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        )}
                    </>
                }
                action={
                    <Button variant="contained" color={isAccept ? 'success' : 'error'} onClick={handleConfirmResolve}>
                        {isAccept ? 'Duyệt' : 'Từ chối'}
                    </Button>
                }
            />
        </Container>
    );
}
