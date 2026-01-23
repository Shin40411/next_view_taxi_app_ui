import { useState } from 'react';
import { format } from 'date-fns';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useWallet } from 'src/hooks/api/use-wallet';
import { useSocketListener } from 'src/hooks/use-socket';

import { fNumber } from 'src/utils/format-number';

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

import { IWalletTransaction } from 'src/types/wallet';
import { TransactionTableRow } from './wallet-transaction-table-row';

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

