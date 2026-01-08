import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { useWallet } from 'src/hooks/api/use-wallet';
import { IWalletTransaction } from 'src/types/wallet';
import { useSocketListener } from 'src/hooks/use-socket';

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
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { fCurrency, fNumber } from 'src/utils/format-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
    useTable,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TablePaginationCustom,
} from 'src/components/table';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'stt', label: '#', width: 50 },
    { id: 'type', label: 'Loại', width: 140 },
    { id: 'amount', label: 'Goxu', width: 140 },
    { id: 'description', label: 'Mô tả', width: 200 },
    { id: 'date', label: 'Thời gian', width: 140 },
    { id: 'status', label: 'Trạng thái', width: 110 },
    { id: 'reason', label: 'Lý do', width: 140 },
    // { id: '', width: 50 },
];

// ----------------------------------------------------------------------

type Props = {
    filterType?: 'all' | 'deposit' | 'spend';
};

export default function WalletTransactionsTable({ filterType = 'all' }: Props) {
    const theme = useTheme();

    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

    const { useGetCustomerTransactions } = useWallet();

    const { wallets, walletsTotal, walletsLoading, mutate } = useGetCustomerTransactions(
        table.page + 1,
        table.rowsPerPage,
        searchTerm,
        startDate,
        endDate
    );

    useSocketListener('wallet_transaction_updated', () => {
        mutate();
    });

    const dataFiltered = wallets.filter(item => {
        if (filterType === 'all') return true;
        if (filterType === 'deposit') return item.type === 'DEPOSIT';
        if (filterType === 'spend') return item.type === 'WITHDRAW' || item.type === 'TRANSFER';
        return true;
    });

    const getTitle = () => {
        if (filterType === 'deposit') return 'Lịch sử nạp';
        if (filterType === 'spend') return 'Lịch sử chuyển';
        return 'Tất cả giao dịch';
    };

    return (
        <Card sx={{ mb: 3 }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h6">{getTitle()}</Typography>

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
                        sx={{ width: 160 }}
                    />
                    <DatePicker
                        label="Đến ngày"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        slotProps={{ textField: { size: 'small' } }}
                        sx={{ width: 160 }}
                    />
                </Stack>
            </Box>

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <Scrollbar>
                    <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                        <TableHeadCustom
                            order={table.order}
                            orderBy={table.orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={walletsTotal}
                            numSelected={table.selected.length}
                            onSort={table.onSort}
                        />

                        <TableBody>
                            {walletsLoading ? (
                                <TableEmptyRows height={table.dense ? 52 : 72} emptyRows={emptyRows(table.page, table.rowsPerPage, 10)} />
                            ) : (
                                dataFiltered.map((row, index) => (
                                    <TransactionTableRow
                                        key={row.id}
                                        row={row}
                                        index={(table.page * table.rowsPerPage) + index + 1}
                                    />
                                ))
                            )}

                            <TableNoData notFound={!walletsLoading && !dataFiltered.length} />
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
        </Card>
    );
}

// ----------------------------------------------------------------------

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
                        {isDeposit ? 'Nạp Goxu' : 'Chuyển Goxu'}
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

            {/* <TableCell align="right">
                <IconButton color="default">
                    <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
            </TableCell> */}
        </TableRow>
    );
}
