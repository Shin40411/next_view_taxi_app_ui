import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { fCurrency, fNumber } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';

import CustomDateRangePicker, { useDateRangePicker } from 'src/components/custom-date-range-picker';

import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import { getDashboardStats, AdminDashboardStats } from 'src/services/admin';

// ----------------------------------------------------------------------

import AdminLiveMapView from './live-map-view';
import AppAreaInstalled from 'src/sections/overview/app/app-area-installed';
import AppTopAuthors from 'src/sections/overview/app/app-top-authors';

// ----------------------------------------------------------------------

export default function AdminOverviewView() {
    const theme = useTheme();
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [period, setPeriod] = useState('today');

    const rangePicker = useDateRangePicker(new Date(), new Date());

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getDashboardStats();
            setStats(data);
        };
        fetchStats();
    }, []);

    const PERIOD_OPTIONS = [
        { value: 'today', label: 'Hôm Nay' },
        { value: 'yesterday', label: 'Hôm Qua' },
        { value: 'week', label: '7 Ngày' },
        { value: 'month', label: 'Tháng Này' },
    ];

    const RENDER_FILTER = (
        <Card sx={{ mb: 1, p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Stack direction="row" spacing={1} sx={{ bgcolor: 'background.neutral', p: 0.5, borderRadius: 1 }}>
                    {PERIOD_OPTIONS.map((option) => (
                        <Box
                            key={option.value}
                            onClick={() => setPeriod(option.value)}
                            sx={{
                                px: 2,
                                py: 1,
                                borderRadius: 0.75,
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                transition: 'all 0.2s',
                                ...(period === option.value
                                    ? {
                                        bgcolor: 'common.white',
                                        color: 'primary.main',
                                        boxShadow: (theme) => theme.customShadows.z1,
                                    }
                                    : {
                                        color: 'text.secondary',
                                        '&:hover': {
                                            color: 'text.primary',
                                        },
                                    }),
                            }}
                        >
                            {option.label}
                        </Box>
                    ))}
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 0.5 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        TÙY CHỌN:
                    </Typography>
                    {/* Placeholder for Date Picker */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                            onClick={rangePicker.onOpen}
                            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0.75, px: 2, py: 1, bgcolor: 'background.paper', fontSize: '0.875rem', cursor: 'pointer' }}
                        >
                            {fDate(rangePicker.startDate)}
                        </Box>
                        <Iconify icon="eva:arrow-forward-fill" width={16} sx={{ color: 'text.disabled' }} />
                        <Box
                            onClick={rangePicker.onOpen}
                            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0.75, px: 2, py: 1, bgcolor: 'background.paper', fontSize: '0.875rem', cursor: 'pointer' }}
                        >
                            {fDate(rangePicker.endDate)}
                        </Box>
                    </Stack>
                </Stack>
            </Stack>
        </Card>
    );

    const RENDER_DRIVER_REPORT = (
        <Card>
            <Box sx={{ p: 3, pb: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ width: 48, height: 48, borderRadius: 1.5, bgcolor: alpha(theme.palette.warning.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Iconify icon="mdi:taxi" width={28} sx={{ color: 'warning.main' }} />
                        </Box>
                        <Stack>
                            <Typography variant="h6">Tài xế / CTV</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Thống kê hoạt động ({period})</Typography>
                        </Stack>
                    </Stack>
                    <Button variant="outlined" color="inherit" size="small" startIcon={<Iconify icon="mdi:file-excel" />}>
                        Xuất Excel
                    </Button>
                </Stack>
            </Box>

            <Scrollbar>
                <TableContainer sx={{ px: 3, pb: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width={10} sx={{ color: 'text.secondary', fontWeight: 600 }}>ĐỐI TÁC</TableCell>
                                <TableCell width={5} align="center" sx={{ color: 'text.secondary', fontWeight: 600 }}>ĐƠN</TableCell>
                                <TableCell width={5} align="center" sx={{ color: 'text.secondary', fontWeight: 600 }}>KHÁCH</TableCell>
                                <TableCell width={5} align="center" sx={{ color: 'text.secondary', fontWeight: 600 }}>TỔNG ĐIỂM</TableCell>
                                <TableCell width={10} align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Mock Data based on Image */}
                            {[
                                { name: 'Tài xế Tuấn', role: 'TX', code: 'TX001', orders: 12, guests: 45, points: 250000, color: 'info' },
                                { name: 'CTV Hoàn Tính', role: 'CTV', code: 'CTV01', orders: 8, guests: 22, points: 120000, color: 'success' },
                                { name: 'Tài xế Minh', role: 'TX', code: 'TX002', orders: 5, guests: 15, points: 80000, color: 'info' },
                            ].map((row, index) => (
                                <TableRow key={index} hover>
                                    <TableCell sx={{ px: 1 }}>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Stack>
                                                <Typography variant="subtitle2" noWrap>
                                                    {row.name}
                                                </Typography>
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <Box component="span" sx={{
                                                        bgcolor: alpha(theme.palette[row.color as 'info' | 'success'].main, 0.16),
                                                        color: theme.palette[row.color as 'info' | 'success'].dark,
                                                        px: 0.5, py: 0, borderRadius: 0.5,
                                                        fontSize: '0.65rem', fontWeight: 'bold'
                                                    }}>
                                                        {row.role}
                                                    </Box>
                                                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>{row.code}</Typography>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="center" sx={{ pl: 0 }}>
                                        <Typography variant="subtitle2">{row.orders}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ pl: 0 }}>
                                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{row.guests}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ pl: 0 }}>
                                        <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                                            {fNumber(row.points)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ pl: 0 }}>
                                        <Button variant="soft" size="small" color="inherit" sx={{ borderRadius: 1 }}>
                                            Chi tiết
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Scrollbar>
        </Card>
    );

    const RENDER_PARTNER_REPORT = (
        <Card>
            <Box sx={{ p: 3, pb: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ width: 48, height: 48, borderRadius: 1.5, bgcolor: alpha(theme.palette.error.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Iconify icon="mdi:office-building" width={28} sx={{ color: 'error.main' }} />
                        </Box>
                        <Stack>
                            <Typography variant="h6">Điểm Dịch Vụ</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Thống kê hoạt động ({period})</Typography>
                        </Stack>
                    </Stack>
                    <Button variant="outlined" color="inherit" size="small" startIcon={<Iconify icon="mdi:file-excel" />}>
                        Xuất Excel
                    </Button>
                </Stack>
            </Box>

            <Scrollbar>
                <TableContainer sx={{ px: 3, pb: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width={10} sx={{ color: 'text.secondary', fontWeight: 600 }}>CƠ SỞ</TableCell>
                                <TableCell align="center" width={10} sx={{ color: 'text.secondary', fontWeight: 600 }}>ĐƠN</TableCell>
                                <TableCell align="center" width={10} sx={{ color: 'text.secondary', fontWeight: 600 }}>KHÁCH</TableCell>
                                <TableCell align="center" width={10} sx={{ color: 'text.secondary', fontWeight: 600 }}>TỔNG ĐIỂM</TableCell>
                                <TableCell align="right" width={10}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Mock Data based on Image */}
                            {[
                                { name: 'Massage Tô Châu', code: 'TOCHAU', orders: 15, guests: 15, points: 750000 },
                                { name: 'Y Khoa Thái Dương', code: 'YKTD', orders: 4, guests: 8, points: 200000 },
                                { name: 'Karaoke Top One', code: 'KARA01', orders: 10, guests: 50, points: 500000 }
                            ].map((row, index) => (
                                <TableRow key={index} hover>
                                    <TableCell sx={{ px: 1 }}>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Stack>
                                                <Typography variant="subtitle2">
                                                    {row.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.disabled' }}>{row.code}</Typography>
                                            </Stack>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="center" sx={{ p: 0 }}>
                                        <Typography variant="subtitle2" sx={{ color: 'error.main' }}>{row.orders}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ pl: 0 }}>
                                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{row.guests}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ pl: 0 }}>
                                        <Typography variant="subtitle2" sx={{ color: 'warning.main' }}>{fNumber(row.points)}</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ pl: 0 }}>
                                        <Button variant="soft" size="small" color="inherit" sx={{ borderRadius: 1 }}>
                                            Chi tiết
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Scrollbar>
        </Card>
    );

    return (
        <Grid container spacing={3} my={0.5}>
            {/* Filter Section */}
            <Grid xs={12}>
                {RENDER_FILTER}
            </Grid>

            {/* Reports Section */}
            <Grid xs={12} md={6}>
                {RENDER_DRIVER_REPORT}
            </Grid>
            <Grid xs={12} md={6}>
                {RENDER_PARTNER_REPORT}
            </Grid>

            {/* Charts (Moved Down) */}
            <Grid xs={12} md={8}>
                <AppAreaInstalled
                    title="Số lượng chuyến đi theo giờ"
                    subheader="(+43%) so với hôm qua"
                    chart={{
                        categories: stats?.tripsByHour?.categories || [],
                        series: stats?.tripsByHour?.series.map(s => ({
                            year: s.name, // Mapping 'name' to 'year' prop expected by component
                            data: [
                                { name: s.name, data: s.data }
                            ]
                        })) || [],
                    }}
                />
            </Grid>

            <Grid xs={12} md={4}>
                <Stack spacing={3}>
                    <AdminLiveMapView />
                </Stack>
            </Grid>

            <Grid xs={12} md={6}>
                <AppTopAuthors
                    title="Top 5 Tài xế năng nổ"
                    list={stats?.topDrivers.map((driver) => ({
                        id: driver.id,
                        name: driver.name,
                        avatarUrl: driver.avatarUrl || '',
                        totalFavorites: driver.totalTrips, // Mapping totalTrips to totalFavorites
                    })) || []}
                />
            </Grid>

            <Grid xs={12} md={6}>
                <AppTopAuthors
                    title="Top 5 Điểm dịch vụ hot"
                    list={stats?.topServicePoints.map((sp) => ({
                        id: sp.id,
                        name: sp.name,
                        avatarUrl: '/assets/icons/glass/ic_glass_buy.png', // Placeholder icon
                        totalFavorites: sp.totalVisits, // Mapping totalVisits to totalFavorites
                    })) || []}
                />
            </Grid>

            <CustomDateRangePicker
                open={rangePicker.open}
                startDate={rangePicker.startDate}
                endDate={rangePicker.endDate}
                onChangeStartDate={rangePicker.onChangeStartDate}
                onChangeEndDate={rangePicker.onChangeEndDate}
                onClose={rangePicker.onClose}
                error={rangePicker.error}
            />
        </Grid>
    );
}
