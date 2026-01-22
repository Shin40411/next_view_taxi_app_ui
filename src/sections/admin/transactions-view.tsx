import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';

import { fPoint } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { getTransactions, AdminTransaction } from 'src/services/admin';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function AdminTransactionsView() {
    const [tableData, setTableData] = useState<AdminTransaction[]>([]);
    const [filterName, setFilterName] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchTransactions = async () => {
            const data = await getTransactions();
            setTableData(data);
        };
        fetchTransactions();
    }, []);

    const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterName(event.target.value);
        setPage(0);
    };

    const handleFilterStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterStatus(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleExport = () => {
        alert("Exporting data... (Mock)");
    };

    const dataFiltered = tableData.filter((item) => {
        if (filterStatus !== 'all' && item.status !== filterStatus) {
            return false;
        }
        if (filterName && !item.driverName.toLowerCase().includes(filterName.toLowerCase()) && !item.id.toLowerCase().includes(filterName.toLowerCase())) {
            return false;
        }
        return true;
    });

    return (
        <Card>
            <Box sx={{ p: 3, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Lịch sử giao dịch</Typography>
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="eva:cloud-download-fill" />}
                    onClick={handleExport}
                >
                    Xuất dữ liệu
                </Button>
            </Box>

            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                sx={{ p: 2.5 }}
            >
                <TextField
                    value={filterName}
                    onChange={handleFilterName}
                    placeholder="Tìm kiếm mã GD, tài xế..."
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
                    value={filterStatus}
                    onChange={handleFilterStatus}
                    sx={{ width: 160 }}
                >
                    <MenuItem value="all">Tất cả trạng thái</MenuItem>
                    <MenuItem value="completed">Hoàn thành</MenuItem>
                    <MenuItem value="cancelled">Đã hủy</MenuItem>
                </TextField>
            </Stack>

            <Divider />

            <Scrollbar>
                <TableContainer sx={{ overflow: 'unset' }}>
                    <Table sx={{ minWidth: 960 }}>
                        <TableHead sx={{ bgcolor: 'grey.200' }}>
                            <TableRow>
                                <TableCell>MÃ GD</TableCell>
                                <TableCell>TÀI XẾ / BIỂN SỐ</TableCell>
                                <TableCell>ĐIỂM ĐÓN / ĐẾN</TableCell>
                                <TableCell>THỜI GIAN</TableCell>
                                <TableCell align="right">SỐ ĐIỂM</TableCell>
                                <TableCell align="center">TRẠNG THÁI</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {dataFiltered
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                            {row.id}
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="subtitle2" noWrap>
                                                {row.driverName}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                                                {row.vehiclePlate}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main', flexShrink: 0 }} />
                                                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{row.pickupAddress}</Typography>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main', flexShrink: 0 }} />
                                                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{row.dropoffAddress}</Typography>
                                            </Stack>
                                        </TableCell>

                                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                            {fDateTime(row.timestamp)}
                                        </TableCell>

                                        <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'success.main' }}>
                                            +{fPoint(row.amount)}
                                        </TableCell>

                                        <TableCell align="center">
                                            <Chip
                                                label={row.status === 'completed' ? 'Thành công' : 'Đã hủy'}
                                                color={row.status === 'completed' ? 'success' : 'error'}
                                                size="small"
                                                variant="soft"
                                                sx={{ fontWeight: 600, minWidth: 80 }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}

                            {dataFiltered.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography variant="body2">Không tìm thấy dữ liệu phù hợp</Typography>
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
                count={dataFiltered.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Số hàng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} trong ${count !== -1 ? count : `hơn ${to}`}`
                }
            />
        </Card>
    );
}
