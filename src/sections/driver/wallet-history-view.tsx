// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTheme, alpha } from '@mui/material/styles';

import { useRef, SyntheticEvent, useState } from 'react';
// hooks
import { useAuthContext } from 'src/auth/hooks';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useContract } from 'src/hooks/api/use-contract';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fPoint } from 'src/utils/format-number';
import { useResponsive } from 'src/hooks/use-responsive';
//
import { enqueueSnackbar } from 'notistack';
import CountUp from 'react-countup';
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
import { useWallet } from 'src/hooks/api/use-wallet';
import { useAdmin } from 'src/hooks/api/use-admin';
import { TransactionTableRow } from './transaction-table-row';
import { TransactionMobileItem } from './transaction-mobile-item';
import DriverTransferForm from './driver-transfer-form';
import DriverWithdrawForm from './driver-withdraw-form';
import DriverDepositForm from './driver-deposit-form';
import { ICreateContractRequest } from 'src/types/contract';

// ----------------------------------------------------------------------

export default function WalletHistoryView() {
    const theme = useTheme();
    const router = useRouter();
    const settings = useSettingsContext();
    const { user } = useAuthContext();
    const { useGetMyContract, createContract } = useContract();
    const { useGetUser } = useAdmin();
    const { user: refreshedUser, userMutate } = useGetUser(user?.id);
    const { contract, contractLoading, mutate } = useGetMyContract();
    const searchParams = useSearchParams();

    const currentTab = searchParams.get('tab') || 'deposit';

    const balanceRef = useRef(0);
    const currentBalance = Number(refreshedUser?.partnerProfile?.wallet_balance || 0);

    const mdUp = useResponsive('up', 'md');

    const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

    const { useGetPartnerTransactions, partnerWithdrawWallet } = useWallet();

    const { wallets, walletsTotal, walletsLoading, mutate: mutateWallets } = useGetPartnerTransactions(
        table.page + 1,
        table.rowsPerPage
    );

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        router.push(paths.dashboard.driver.wallet + `?tab=${newValue}`);
    };

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

    if ((!contract || contract.status !== 'ACTIVE') && !contractLoading) {
        return (
            <Container maxWidth={settings.themeStretch ? false : 'xl'}>
                <Card sx={{ my: 2, py: 2 }}>
                    <ContractPreview onSign={handleSignContract} />
                </Card>
            </Container>
        );
    }

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
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
                        zIndex: 0,
                    }}
                >
                    <img
                        src="/assets/illustrations/wallet_illustration.png"
                        alt="taxi driver"
                        style={{ height: '100%', maxHeight: 200, objectFit: 'contain' }}
                    />
                </Box>
                <Box
                    sx={{
                        position: 'relative',
                        p: 3,
                        height: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                    zIndex={2}
                >
                    <Typography variant="overline" sx={{ opacity: 0.64, mb: 1 }}>
                        Tổng số dư ví hiện tại
                    </Typography>
                    <Typography variant="h2">
                        <CountUp
                            start={balanceRef.current}
                            end={currentBalance}
                            onEnd={() => { balanceRef.current = currentBalance; }}
                            formattingFn={(value) => fPoint(value)}
                        />
                    </Typography>
                </Box>
            </Card>

            <Card sx={{ my: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleChangeTab}
                    orientation={mdUp ? 'horizontal' : 'vertical'}
                    sx={{
                        px: 3,
                        py: { xs: 2, md: 0 },
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                        borderRadius: 2,
                    }}
                >
                    <Tab
                        value="deposit"
                        label="Nạp Goxu"
                        icon={<Iconify icon="solar:wallet-money-bold" width={20} />}
                        iconPosition="start"
                    />
                    <Tab
                        value="transfer"
                        label="Chuyển Goxu"
                        icon={<Iconify icon="solar:card-send-bold" width={20} />}
                        iconPosition="start"
                    />
                    <Tab
                        value="withdraw"
                        label="Rút ví"
                        icon={<Iconify icon="eva:diagonal-arrow-right-up-fill" width={20} />}
                        iconPosition="start"
                    />
                    <Tab
                        value="transactions"
                        label="Lịch sử giao dịch"
                        icon={<Iconify icon="solar:history-bold" width={20} />}
                        iconPosition="start"
                    />
                </Tabs>
            </Card>

            {currentTab === 'transactions' && (
                <Card sx={{ mb: 3 }}>
                    <Box sx={{ p: 3 }}>
                        {mdUp ? (
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
                                                { id: 'sender', label: 'Người gửi', width: 150 },
                                                { id: 'receiver', label: 'Người nhận', width: 150 },
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
                                                        currentUserId={user?.id}
                                                    />
                                                ))
                                            )}

                                            <TableNoData notFound={!walletsLoading && !wallets.length} />
                                        </TableBody>
                                    </Table>
                                </Scrollbar>
                            </TableContainer>
                        ) : (
                            <Box>
                                {wallets.map((row) => (
                                    <TransactionMobileItem
                                        key={row.id}
                                        row={row}
                                        currentUserId={user?.id}
                                    />
                                ))}
                                {wallets.length === 0 && (
                                    <EmptyContent
                                        filled
                                        title="Không có dữ liệu"
                                        sx={{
                                            py: 10,
                                        }}
                                    />
                                )}
                            </Box>
                        )}

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
            )}

            {currentTab === 'deposit' && (
                <DriverDepositForm
                    onRefresh={() => {
                        mutateWallets();
                        userMutate();
                    }}
                />
            )}

            {currentTab === 'transfer' && (
                <DriverTransferForm
                    currentBalance={currentBalance}
                    onRefresh={() => {
                        mutateWallets();
                        userMutate();
                    }}
                />
            )}

            {currentTab === 'withdraw' && (
                <DriverWithdrawForm
                    currentBalance={currentBalance}
                    bankInfo={refreshedUser?.bankAccount ? {
                        bankName: refreshedUser.bankAccount.bank_name,
                        accountNumber: refreshedUser.bankAccount.account_number,
                        accountName: refreshedUser.bankAccount.account_holder_name,
                    } : null}
                    onRefresh={() => {
                        mutateWallets();
                        userMutate();
                    }}
                />
            )}
        </Container>
    );
}
