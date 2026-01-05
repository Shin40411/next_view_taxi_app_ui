'use client';

import { useState } from 'react';

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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

import { useWallet } from 'src/hooks/api/use-wallet';
import { useSnackbar } from 'src/components/snackbar';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function WalletManagementView() {
    const settings = useSettingsContext();
    const { enqueueSnackbar } = useSnackbar();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDeposit, setOpenDeposit] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<any>(null);
    const [depositAmount, setDepositAmount] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    const { useGetAllWallets, depositWallet } = useWallet();
    const { wallets, walletsTotal, walletsLoading } = useGetAllWallets(page + 1, rowsPerPage, searchTerm);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDeposit = (wallet: any) => {
        setSelectedWallet(wallet);
        setOpenDeposit(true);
    };

    const handleCloseDeposit = () => {
        setOpenDeposit(false);
        setSelectedWallet(null);
        setDepositAmount('');
    };

    const handleDeposit = async () => {
        const amount = parseInt(depositAmount.replace(/\D/g, ''), 10) || 0;

        try {
            await depositWallet(selectedWallet.id, amount);
            enqueueSnackbar('Nạp tiền thành công', { variant: 'success' });
            handleCloseDeposit();
        } catch (error: any) {
            console.error(error);
            enqueueSnackbar(error.message || 'Nạp tiền thất bại', { variant: 'error' });
        }
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Card sx={{ mt: 4 }}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6">Trung tâm hỗ trợ ví khách hàng</Typography>
                </Box>
                <TableContainer sx={{ minHeight: 500, position: 'relative', overflow: 'unset' }}>
                    <Scrollbar>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Chủ sở hữu</TableCell>
                                    <TableCell>Số điện thoại</TableCell>
                                    <TableCell>Công ty</TableCell>
                                    <TableCell align="right">Số dư (Goxu)</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody sx={{ height: 500 }}>
                                {walletsLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">Đang tải...</TableCell>
                                    </TableRow>
                                ) : wallets.map((row: any) => (
                                    <TableRow hover key={row.id}>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.owner?.full_name}</TableCell>
                                        <TableCell>{row.owner?.phone_number || row.owner?.username}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell align="right">
                                            <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                                                {Number(row.advertising_budget).toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Nạp tiền">
                                                <IconButton color="primary" onClick={() => handleOpenDeposit(row)}>
                                                    <Iconify icon="eva:plus-fill" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!walletsLoading && wallets.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">Không tìm thấy yêu cầu nào</TableCell>
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
                    labelDisplayedRows={({ from, to, count }) => `Hiển thị ${from}-${to} trong ${count}`}
                />
            </Card>

            <Dialog open={openDeposit} onClose={handleCloseDeposit}>
                <DialogTitle>Nạp tiền vào ví Goxu</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Điểm dịch vụ: <strong>{selectedWallet?.name}</strong>
                    </Typography>

                    <TextField
                        autoFocus
                        fullWidth
                        label="Số tiền (VNĐ)"
                        variant="outlined"
                        value={depositAmount}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setDepositAmount(value ? parseInt(value, 10).toLocaleString('vi-VN') : '');
                        }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">₫</InputAdornment>,
                        }}
                        helperText={`Quy đổi: ${((parseInt(depositAmount.replace(/\D/g, ''), 10) || 0) / 1000).toLocaleString()} Goxu`}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeposit} color="inherit">
                        Hủy
                    </Button>
                    <Button onClick={handleDeposit} variant="contained" color="primary">
                        Xác nhận nạp
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
