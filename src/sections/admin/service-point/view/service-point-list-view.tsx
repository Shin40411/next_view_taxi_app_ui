import { useState, useEffect } from 'react';
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
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import { fCurrency } from 'src/utils/format-number';
import { exportToCSV } from 'src/utils/export-csv';
import { getServicePoints, AdminServicePoint } from 'src/services/admin';

// ----------------------------------------------------------------------

export default function ServicePointListView() {
    const router = useRouter();
    const [tableData, setTableData] = useState<AdminServicePoint[]>([]);
    const [filterName, setFilterName] = useState('');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getServicePoints();
            setTableData(data);
        };
        fetchData();
    }, []);

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

    const dataFiltered = tableData.filter((item) => {
        if (filterName && !item.name.toLowerCase().includes(filterName.toLowerCase()) && !item.address.toLowerCase().includes(filterName.toLowerCase())) {
            return false;
        }
        return true;
    });

    return (
        <Card>
            <Box sx={{ p: 3, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Quản lý cơ sở kinh doanh</Typography>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="soft"
                        startIcon={<Iconify icon="eva:cloud-download-fill" />}
                        onClick={() => {
                            const exportData = dataFiltered.map(item => ({
                                ID: item.id,
                                Name: item.name,
                                Address: item.address,
                                Phone: item.phone,
                                Radius: item.radius,
                                Status: item.status,
                                Points: item.rewardPoints
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
            </Box>

            <Stack
                direction="row"
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
            </Stack>

            <Divider />

            <Scrollbar>
                <TableContainer sx={{ overflow: 'unset' }}>
                    <Table sx={{ minWidth: 960 }}>
                        <TableHead sx={{ bgcolor: 'grey.200' }}>
                            <TableRow>
                                <TableCell>TÊN / ĐỊA CHỈ</TableCell>
                                <TableCell>LIÊN HỆ</TableCell>
                                <TableCell>THƯỞNG</TableCell>
                                <TableCell>BÁN KÍNH</TableCell>
                                <TableCell align="center">TRẠNG THÁI</TableCell>
                                <TableCell align="right">HÀNH ĐỘNG</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {dataFiltered
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>
                                            <Typography variant="subtitle2" noWrap>
                                                {row.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                                {row.address}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2">{row.phone}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                                                {row.rewardPoints}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2">{row.radius}m</Typography>
                                        </TableCell>

                                        <TableCell align="center">
                                            <Chip
                                                label={row.status === 'active' ? 'Hoạt động' : 'Ngưng'}
                                                color={row.status === 'active' ? 'success' : 'default'}
                                                size="small"
                                                variant="soft"
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            <IconButton onClick={() => handleEdit(row.id)}>
                                                <Iconify icon="eva:edit-fill" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
            />
        </Card>
    );
}
