import { useState } from 'react';

import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useAdmin } from 'src/hooks/api/use-admin';

import { fPoint } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';

import { IServicePointTransaction } from 'src/types/user';

interface TransactionDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    servicePointId: string | null;
    period: string;
    servicePointName: string;
}

export default function TransactionDetailsDialog({ open, onClose, servicePointId, period, servicePointName }: TransactionDetailsDialogProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { useGetServicePointTransactions } = useAdmin();
    const { transactions, transactionsTotal, transactionsLoading } = useGetServicePointTransactions(servicePointId, period, page + 1, rowsPerPage);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
                Lịch sử đơn - {servicePointName}
                <IconButton onClick={onClose} edge="end">
                    <Iconify icon="mingcute:close-line" />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ px: 4, py: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{
                                '& .MuiTableCell-root:not(:last-of-type)': {
                                    borderRight: (theme) => `solid 1px ${theme.palette.divider}`
                                },
                                '& .MuiTableCell-root': {
                                    borderBottom: (theme) => `solid 1px ${theme.palette.divider} !important`
                                },
                                '& .MuiTableCell-root:first-child': {
                                    borderLeft: (theme) => `solid 1px ${theme.palette.divider} !important`
                                },
                                '& .MuiTableCell-root:last-child': {
                                    borderRight: (theme) => `solid 1px ${theme.palette.divider} !important`
                                }
                            }}>
                                <TableCell>Mã</TableCell>
                                <TableCell>Loại</TableCell>
                                <TableCell>Số Goxu</TableCell>
                                <TableCell>Thời gian</TableCell>
                                <TableCell>Mô tả</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactionsLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Đang tải...</TableCell>
                                </TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center"><EmptyContent /></TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((tx: IServicePointTransaction) => (
                                    <TableRow key={tx.id}
                                        sx={{
                                            '& .MuiTableCell-root:not(:last-of-type)': {
                                                borderRight: (theme) => `solid 1px ${theme.palette.divider}`
                                            },
                                            '& .MuiTableCell-root': {
                                                borderBottom: (theme) => `solid 1px ${theme.palette.divider} !important`
                                            },
                                            '& .MuiTableCell-root:first-child': {
                                                borderLeft: (theme) => `solid 1px ${theme.palette.divider} !important`
                                            },
                                            '& .MuiTableCell-root:last-child': {
                                                borderRight: (theme) => `solid 1px ${theme.palette.divider} !important`
                                            }
                                        }}
                                    >
                                        <TableCell>#{tx.tripCode || '-'}</TableCell>
                                        <TableCell>{convertType(tx.type)}</TableCell>
                                        <TableCell>{fPoint(tx.amount)}</TableCell>
                                        <TableCell>{fDateTime(tx.createdAt)}</TableCell>
                                        <TableCell>{tx.description}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={transactionsTotal}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Số hàng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
                />
            </DialogContent>
        </Dialog>
    );
}

function convertType(type: string) {
    switch (type) {
        case 'TIPS':
            return 'Thưởng hoa hồng thêm';
        default:
            return 'Xác nhận đơn';
    }
}