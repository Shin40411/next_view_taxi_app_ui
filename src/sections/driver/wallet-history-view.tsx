// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { alpha, useTheme } from '@mui/material/styles';

import { useEffect, useState } from 'react';
// hooks
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hooks';
import { useContract, ICreateContractRequest } from 'src/hooks/api/use-contract';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fNumber, fPoint } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
//
import WithdrawRequestDialog from './withdraw-request-dialog';
import { enqueueSnackbar } from 'notistack';
import ContractPreview from '../contract/contract-preview';

// ----------------------------------------------------------------------


import {
    useTable,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TablePaginationCustom,
} from 'src/components/table';
import Label from 'src/components/label';
import { useWallet } from 'src/hooks/api/use-wallet';
import { useAdmin } from 'src/hooks/api/use-admin';
import { IWalletTransaction } from 'src/types/wallet';
import { format } from 'date-fns';
import TransferRequestDialog from './transfer-request-dialog';
const MOCK_BANK_INFO = {
    bankName: 'Vietcombank',
    accountNumber: '0123456789',
    accountName: 'NGUYEN VAN A',
};

// ----------------------------------------------------------------------

export default function WalletHistoryView() {
    const theme = useTheme();
    const router = useRouter();
    const settings = useSettingsContext();
    const withdrawDialog = useBoolean();
    const transferDialog = useBoolean();
    const { user } = useAuthContext();
    const { useGetMyContract, createContract } = useContract();
    const { useGetUser } = useAdmin();
    const { user: refreshedUser, userMutate } = useGetUser(user?.id);
    const { contract, contractLoading, mutate } = useGetMyContract();

    const currentBalance = Number(refreshedUser?.partnerProfile?.wallet_balance || 0);

    const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

    const { useGetPartnerTransactions, partnerWithdrawWallet } = useWallet();

    const { wallets, walletsTotal, walletsLoading, mutate: mutateWallets } = useGetPartnerTransactions(
        table.page + 1,
        table.rowsPerPage
    );

    const handleSignContract = async (data: any) => {
        try {
            await createContract(data as ICreateContractRequest);
            mutate();
            enqueueSnackbar('Ký hợp đồng thành công! Mời bạn sử dụng ví', { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Có lỗi xảy ra khi lưu hợp đồng', { variant: 'error' });
        }
    };

    const handleRequestWithdraw = () => {
        if (!MOCK_BANK_INFO) {
            enqueueSnackbar('Bạn chưa cập nhật thông tin ngân hàng! Chuyển hướng đến trang cập nhật...', { variant: 'error' });
            router.push(paths.dashboard.driver.profile);
            return;
        }
        withdrawDialog.onTrue();
    };

    // useEffect(() => {
    //     console.log(contract);
    // }, [contract]);

    if (!contract && !contractLoading) {
        return (
            <Container maxWidth={settings.themeStretch ? false : 'xl'}>
                <ContractPreview onSign={handleSignContract} />
            </Container>
        );
    }

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <Card
                sx={{
                    my: 3,
                    height: 200,
                    position: 'relative',
                    color: 'common.black',
                    background: 'linear-gradient(135deg, #FFF176 0%, #FBC02D 100%)',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                    }}
                >
                    <img
                        src="/assets/illustrations/taxi_driver.png"
                        alt="taxi driver"
                        style={{ height: '100%', maxHeight: 200, objectFit: 'contain' }}
                    />
                </Box>
                <Box
                    sx={{
                        p: 3,
                        height: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="overline" sx={{ opacity: 0.64, mb: 1 }}>
                        Số dư hiện tại
                    </Typography>
                    <Typography variant="h2">
                        {fPoint(currentBalance)}
                    </Typography>
                </Box>
            </Card>

            <Card>
                <Box sx={{ p: 3 }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        justifyContent="space-between"
                        spacing={2}
                        sx={{ mb: 3 }}
                    >
                        <Typography variant="h6">Lịch sử giao dịch</Typography>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                color="inherit"
                                startIcon={<Iconify icon="solar:card-send-bold" />}
                                onClick={transferDialog.onTrue}
                            >
                                Chuyển Goxu
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Iconify icon="eva:diagonal-arrow-right-up-fill" />}
                                onClick={handleRequestWithdraw}
                            >
                                Yêu cầu rút ví
                            </Button>
                        </Stack>
                    </Stack>

                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                                <TableHeadCustom
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headLabel={[
                                        { id: 'stt', label: '#', width: 50 },
                                        { id: 'type', label: 'Loại', width: 140 },
                                        { id: 'amount', label: 'Goxu', width: 140 },
                                        { id: 'description', label: 'Mô tả', width: 200 },
                                        { id: 'date', label: 'Thời gian', width: 140 },
                                        { id: 'status', label: 'Trạng thái', width: 110 },
                                        { id: 'reason', label: 'Lý do', width: 140 },
                                    ]}
                                    rowCount={walletsTotal}
                                    numSelected={table.selected.length}
                                    onSort={table.onSort}
                                />

                                <TableBody>
                                    {walletsLoading ? (
                                        <TableEmptyRows height={table.dense ? 52 : 72} emptyRows={emptyRows(table.page, table.rowsPerPage, 10)} />
                                    ) : (
                                        wallets.map((row, index) => (
                                            <TransactionTableRow
                                                key={row.id}
                                                row={row}
                                                index={(table.page * table.rowsPerPage) + index + 1}
                                            />
                                        ))
                                    )}

                                    <TableNoData notFound={!walletsLoading && !wallets.length} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>

                    <TablePaginationCustom
                        count={walletsTotal}
                        page={table.page}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                        dense={table.dense}
                        onChangeDense={table.onChangeDense}
                    />
                </Box>
            </Card>

            <WithdrawRequestDialog
                open={withdrawDialog.value}
                onClose={withdrawDialog.onFalse}
                currentBalance={currentBalance}
                bankInfo={MOCK_BANK_INFO}
            />

            <TransferRequestDialog
                open={transferDialog.value}
                onClose={transferDialog.onFalse}
                currentBalance={currentBalance}
                onRefresh={() => {
                    mutateWallets();
                    userMutate();
                }}
            />
        </Container>
    );
}

function TransactionTableRow({ row, index }: { row: IWalletTransaction; index: number }) {
    const theme = useTheme();

    const isDeposit = row.type === 'DEPOSIT';

    const renderDescription = () => {
        if (row.type === 'DEPOSIT') return 'Nạp GoXu';
        if (row.type === 'WITHDRAW') return 'Rút GoXu';
        if (row.type === 'TRANSFER') return `Chuyển GoXu cho ${row.receiver?.full_name || row.receiver?.username || 'người nhận'}`;
        return 'Giao dịch';
    };

    return (
        <TableRow hover>
            <TableCell>{index}</TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify
                        icon={isDeposit ? 'eva:arrow-downward-fill' : 'eva:arrow-upward-fill'}
                        sx={{
                            mr: 1,
                            color: isDeposit ? 'success.main' : 'error.main',
                            bgcolor: isDeposit ? alpha(theme.palette.success.main, 0.16) : alpha(theme.palette.error.main, 0.16),
                            p: 0.5,
                            borderRadius: '50%',
                            width: 28,
                            height: 28
                        }}
                    />
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {row.type === 'DEPOSIT' ? 'Nạp Goxu' : row.type === 'WITHDRAW' ? 'Rút Goxu' : row.type === 'TRANSFER' ? 'Chuyển Goxu' : 'Giao dịch'}
                    </Typography>
                </Box>
            </TableCell>

            <TableCell>
                <Typography
                    variant="subtitle2"
                    sx={{ color: isDeposit ? 'success.main' : 'error.main' }}
                >
                    {isDeposit ? '+' : '-'}{fNumber(row.amount)} GoXu
                </Typography>
            </TableCell>

            <TableCell>{renderDescription()}</TableCell>

            <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2">
                        {format(new Date(row.created_at), 'dd/MM/yyyy')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {format(new Date(row.created_at), 'p')}
                    </Typography>
                </Box>
            </TableCell>

            <TableCell>
                <Label
                    variant="soft"
                    color={
                        (row.status === 'SUCCESS' && 'success') ||
                        (row.status === 'PENDING' && 'warning') ||
                        (row.status === 'FALSE' && 'error') ||
                        'default'
                    }
                >
                    {row.status === 'SUCCESS' && 'Thành công'}
                    {row.status === 'PENDING' && 'Đang xử lý'}
                    {row.status === 'FALSE' && 'Thất bại'}
                </Label>
            </TableCell>

            <TableCell>
                {row.reason ? (
                    <Tooltip title={row.reason}>
                        <Typography variant="caption" noWrap sx={{ maxWidth: 140, display: 'block' }}>
                            {row.reason}
                        </Typography>
                    </Tooltip>
                ) : '-'}
            </TableCell>
        </TableRow>
    );
}

