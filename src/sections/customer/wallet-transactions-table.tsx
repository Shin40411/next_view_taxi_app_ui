import { useState } from 'react';
import { format } from 'date-fns';

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

const CHECK_IN = new Date();
const CHECK_OUT = new Date();

const TABLE_HEAD = [
    { id: 'transactionId', label: 'Mã giao dịch' },
    { id: 'type', label: 'Loại', width: 140 },
    { id: 'amount', label: 'GoXu', width: 140 },
    { id: 'description', label: 'Mô tả', width: 200 },
    { id: 'date', label: 'Thời gian', width: 140 },
    { id: 'status', label: 'Trạng thái', width: 110 },
    { id: '', width: 50 },
];

const MOCK_DATA = [
    {
        id: 'TXN-001',
        type: 'deposit',
        amount: 2000000,
        description: 'Nạp GoXu qua VietQR',
        date: new Date('2025-12-24T10:30:00'),
        status: 'success',
    },
    {
        id: 'TXN-002',
        type: 'spend',
        amount: 50000,
        description: 'Thưởng tài xế 30H-123.45',
        date: new Date('2025-12-24T09:15:00'),
        status: 'success',
    },
    {
        id: 'TXN-003',
        type: 'spend',
        amount: 30000,
        description: 'Chi phí quảng cáo ngày',
        date: new Date('2025-12-23T23:00:00'),
        status: 'success',
    },
    {
        id: 'TXN-004',
        type: 'deposit',
        amount: 500000,
        description: 'Nạp tiền qua Bank',
        date: new Date('2025-12-23T15:45:00'),
        status: 'pending',
    },
    {
        id: 'TXN-005',
        type: 'spend',
        amount: 100000,
        description: 'Điều chỉnh số dư',
        date: new Date('2025-12-20T08:00:00'),
        status: 'failed',
    },
];

// ----------------------------------------------------------------------

type Props = {
    filterType?: 'all' | 'deposit' | 'spend';
};

export default function WalletTransactionsTable({ filterType = 'all' }: Props) {
    const theme = useTheme();

    const table = useTable({ defaultOrderBy: 'date', defaultOrder: 'desc' });

    const [tableData] = useState(MOCK_DATA.filter(item => {
        if (filterType === 'all') return true;
        return item.type === filterType;
    }));

    const getTitle = () => {
        if (filterType === 'deposit') return 'Lịch sử nạp';
        if (filterType === 'spend') return 'Lịch sử chuyển';
        return 'Tất cả giao dịch';
    };

    return (
        <Card>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">{getTitle()}</Typography>

                <Button
                    variant="outlined"
                    startIcon={<Iconify icon="eva:cloud-download-fill" />}
                >
                    Xuất Excel
                </Button>
            </Box>

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <Scrollbar>
                    <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                        <TableHeadCustom
                            order={table.order}
                            orderBy={table.orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={tableData.length}
                            numSelected={table.selected.length}
                            onSort={table.onSort}
                        />

                        <TableBody>
                            {tableData.map((row) => (
                                <TransactionTableRow key={row.id} row={row} />
                            ))}

                            <TableEmptyRows
                                height={table.dense ? 52 : 72}
                                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                            />

                            <TableNoData notFound={!tableData.length} />
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
                count={tableData.length}
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

function TransactionTableRow({ row }: { row: any }) {
    const theme = useTheme();

    const isDeposit = row.type === 'deposit';

    return (
        <TableRow hover>
            <TableCell sx={{ fontWeight: 'bold' }}>{row.id}</TableCell>

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
                        {isDeposit ? 'Nạp GoXu' : 'Chi tiêu'}
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

            <TableCell>{row.description}</TableCell>

            <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2">
                        {format(row.date, 'dd/MM/yyyy')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {format(row.date, 'p')}
                    </Typography>
                </Box>
            </TableCell>

            <TableCell>
                <Label
                    variant="soft"
                    color={
                        (row.status === 'success' && 'success') ||
                        (row.status === 'pending' && 'warning') ||
                        (row.status === 'failed' && 'error') ||
                        'default'
                    }
                >
                    {row.status === 'success' && 'Thành công'}
                    {row.status === 'pending' && 'Đang xử lý'}
                    {row.status === 'failed' && 'Thất bại'}
                </Label>
            </TableCell>

            <TableCell align="right">
                <IconButton color="default">
                    <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}
