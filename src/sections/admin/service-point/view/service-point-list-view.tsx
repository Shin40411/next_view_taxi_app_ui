import { useState } from 'react';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import { fPoint } from 'src/utils/format-number';
import { exportToCSV } from 'src/utils/export-csv';
import { useAdmin } from 'src/hooks/api/use-admin';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function ServicePointListView() {
    const router = useRouter();
    const { useGetUsers } = useAdmin();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterName, setFilterName] = useState('');

    const { users, usersTotal } = useGetUsers('CUSTOMER', page + 1, rowsPerPage);

    const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterName(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (id: string) => {
        router.push(paths.dashboard.admin.servicePoints.edit(id));
    };

    const handleNew = () => {
        router.push(paths.dashboard.admin.servicePoints.new);
    };

    return (
        <Card sx={{ mx: 2.5, my: 5 }}>
            <Box sx={{ p: 3, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Quản lý cơ sở kinh doanh</Typography>
            </Box>

            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 2 }}
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 2.5 }}
            >
                <TextField
                    value={filterName}
                    onChange={handleFilterName}
                    placeholder="Tìm tên quán, địa chỉ..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 280 }}
                />

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="soft"
                        startIcon={<Iconify icon="eva:cloud-download-fill" />}
                        onClick={() => {
                            const exportData = users.map(item => ({
                                ID: item.id,
                                Name: item.full_name,
                                Phone: item.username,
                                TaxID: item.tax_id,
                                Wallet: item.servicePoints?.[0]?.advertising_budget || 0
                            }));
                            exportToCSV(exportData, `service_points_report_${new Date().toISOString().split('T')[0]}.csv`);
                        }}
                    >
                        Xuất báo cáo
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                        onClick={handleNew}
                    >
                        Thêm mới
                    </Button>
                </Stack>
            </Stack>

            <Divider />

            <Scrollbar>
                <TableContainer sx={{ overflow: 'unset' }}>
                    <Table sx={{ minWidth: 960 }}>
                        <TableHead sx={{ bgcolor: 'grey.200' }}>
                            <TableRow>
                                <TableCell>TÊN CSKD / ĐỊA CHỈ</TableCell>
                                <TableCell>LIÊN HỆ</TableCell>
                                {/* <TableCell>CẤU HÌNH THƯỞNG</TableCell> */}
                                <TableCell>NGÂN SÁCH (GoXu)</TableCell>
                                <TableCell>NGÀY TẠO</TableCell>
                                <TableCell align="right">HÀNH ĐỘNG</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {users.map((row) => {
                                const servicePoint = row.servicePoints?.[0]; // Get the first service point if available

                                return (
                                    <TableRow key={row.id} hover>
                                        <TableCell>
                                            <Typography variant="subtitle2" noWrap>
                                                {row.full_name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                                {servicePoint?.address || '---'}
                                            </Typography>
                                            {servicePoint?.name && servicePoint.name !== row.full_name && (
                                                <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                                                    ({servicePoint.name})
                                                </Typography>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2">{row.username}</Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    MST: {row.tax_id || '---'}
                                                </Typography>
                                            </Stack>
                                        </TableCell>

                                        {/* <TableCell>
                                            {servicePoint ? (
                                                <Stack spacing={0.5}>
                                                    <Typography variant="body2" >
                                                        Thưởng: {fPoint(servicePoint.reward_amount)}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        Bán kính: {servicePoint.geofence_radius}m
                                                    </Typography>
                                                </Stack>
                                            ) : (
                                                '---'
                                            )}
                                        </TableCell> */}

                                        <TableCell>
                                            <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                                                {fPoint(servicePoint?.advertising_budget || 0)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2">{fDate(row.created_at)}</Typography>
                                        </TableCell>

                                        <TableCell align="right">
                                            <IconButton onClick={() => handleEdit(row.id)}>
                                                <Iconify icon="eva:edit-fill" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
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
                    `${from}–${to} trong ${count !== -1 ? count : `hơn ${to}`}`
                }
            />
        </Card>
    );
}
