import { useState, useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
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
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import { fCurrency } from 'src/utils/format-number';
import { exportToCSV } from 'src/utils/export-csv';
import { getPartners, PartnerSummary } from 'src/services/admin';

// ----------------------------------------------------------------------

export default function PartnerListView() {
    const router = useRouter();
    const [tableData, setTableData] = useState<PartnerSummary[]>([]);
    const [filterName, setFilterName] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRole, setFilterRole] = useState('driver'); // 'driver' or 'collaborator'

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchPartners = async () => {
            const data = await getPartners();
            setTableData(data);
        };
        fetchPartners();
    }, []);

    const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterName(event.target.value);
        setPage(0);
    };

    const handleFilterStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterStatus(event.target.value);
        setPage(0);
    };

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setFilterRole(newValue);
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewDetail = (id: string) => {
        router.push(paths.dashboard.admin.partners.detail(id));
    };

    const dataFiltered = tableData.filter((item) => {
        if (item.role !== filterRole) {
            return false;
        }
        if (filterStatus !== 'all' && item.status !== filterStatus) {
            return false;
        }
        if (filterName && !item.fullName.toLowerCase().includes(filterName.toLowerCase()) && !item.id.toLowerCase().includes(filterName.toLowerCase()) && !item.phoneNumber.includes(filterName)) {
            return false;
        }
        return true;
    });

    return (
        <Card>
            <Box sx={{ p: 3, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Danh sách {filterRole === 'driver' ? 'Tài xế' : 'CTV'}</Typography>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="soft"
                        startIcon={<Iconify icon="eva:cloud-download-fill" />}
                        onClick={() => {
                            const exportData = dataFiltered.map(item => ({
                                ID: item.id,
                                Name: item.fullName,
                                Phone: item.phoneNumber,
                                Plate: item.vehiclePlate,
                                Role: item.role,
                                Status: item.status,
                                Points: item.rewardPoints
                            }));
                            exportToCSV(exportData, `partners_report_${new Date().toISOString().split('T')[0]}.csv`);
                        }}
                    >
                        Xuất báo cáo
                    </Button>
                    {/* Placeholder for Add New if needed, though previously I thought it existed. 
                         If it didn't exist, I'm adding Export only? 
                         Wait, the user wants "Export". 
                         Let's check if there is an Add button. Step 1122 doesn't show one in the Box. 
                         So I will just add the Export button for now, or maybe the Add button was missing? 
                         I'll add Export. And maybe Add New if I see fit. 
                         Actually, let's just add the Export button to the right. */}
                </Stack>
            </Box>

            <Tabs
                value={filterRole}
                onChange={handleChangeTab}
                sx={{
                    px: 2.5,
                    boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.palette.divider}`,
                }}
            >
                <Tab value="driver" label="Tài xế" iconPosition="start" icon={<Iconify icon="eva:car-fill" />} />
                <Tab value="collaborator" label="Cộng tác viên (CTV)" iconPosition="start" icon={<Iconify icon="eva:people-fill" />} />
            </Tabs>

            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ p: 2.5 }}
            >
                <TextField
                    value={filterName}
                    onChange={handleFilterName}
                    placeholder="Tìm tên, SĐT, biển số..."
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
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="active">Hoạt động</MenuItem>
                    <MenuItem value="pending">Chờ duyệt</MenuItem>
                    <MenuItem value="banned">Đã khóa</MenuItem>
                </TextField>
            </Stack>

            <Divider />

            <Scrollbar>
                <TableContainer sx={{ overflow: 'unset' }}>
                    <Table sx={{ minWidth: 960 }}>
                        <TableHead sx={{ bgcolor: 'grey.200' }}>
                            <TableRow>
                                <TableCell>ĐỐI TÁC</TableCell>
                                <TableCell>LIÊN HỆ</TableCell>
                                <TableCell>ĐIỂM THƯỞNG</TableCell>
                                <TableCell align="center">TRẠNG THÁI</TableCell>
                                <TableCell align="right">HÀNH ĐỘNG</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {dataFiltered
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow key={row.id} hover onClick={() => handleViewDetail(row.id)} sx={{ cursor: 'pointer' }}>
                                        <TableCell>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Avatar alt={row.fullName} src={row.avatarUrl || ''}>
                                                    {row.fullName.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {row.fullName}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                                                        {row.id}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                        {row.vehiclePlate}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2">{row.phoneNumber}</Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="subtitle2" sx={{ color: 'warning.main' }}>
                                                {row.rewardPoints.toLocaleString()} pts
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="center">
                                            <Chip
                                                label={row.status === 'active' ? 'Active' : row.status === 'pending' ? 'Pending' : 'Banned'}
                                                color={row.status === 'active' ? 'success' : row.status === 'pending' ? 'warning' : 'error'}
                                                size="small"
                                                variant="soft"
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            <IconButton onClick={(e) => { e.stopPropagation(); handleViewDetail(row.id); }}>
                                                <Iconify icon="eva:arrow-ios-forward-fill" />
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
