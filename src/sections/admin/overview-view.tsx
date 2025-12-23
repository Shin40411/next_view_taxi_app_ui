import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { fCurrency, fNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import { getDashboardStats, AdminDashboardStats } from 'src/services/admin';

// ----------------------------------------------------------------------

import AdminLiveMapView from './live-map-view';
import AppAreaInstalled from 'src/sections/overview/app/app-area-installed';
import AppTopAuthors from 'src/sections/overview/app/app-top-authors';

// ... (existing imports)

export default function AdminOverviewView() {
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getDashboardStats();
            setStats(data);
        };
        fetchStats();
    }, []);

    return (
        <Grid container spacing={3}>
            {/* Metric Cards */}
            <Grid xs={12} md={3}>
                <AppWidgetSummary
                    title="Tổng số Tài xế"
                    total={stats?.totalDrivers || 0}
                    icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
                />
            </Grid>

            <Grid xs={12} md={3}>
                <AppWidgetSummary
                    title="Tổng số Quán liên kết"
                    total={stats?.totalPartners || 0} // Using totalPartners for Partner Accounts, totalProperties for Service Points
                    color="info"
                    icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
                />
            </Grid>

            <Grid xs={12} md={3}>
                <AppWidgetSummary
                    title="Tổng số Chuyến đi"
                    total={stats?.totalTrips || 0}
                    color="warning"
                    icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
                />
            </Grid>

            <Grid xs={12} md={3}>
                <AppWidgetSummary
                    title="Tổng điểm thưởng đã cấp"
                    total={stats?.totalBonus || 0}
                    color="error"
                    icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
                    formatCurrency={false}
                    sx={{
                        '& .MuiTypography-h3': {
                            fontSize: '1.5rem',
                            '&::after': {
                                content: '" pts"',
                                fontSize: '1rem',
                                color: 'text.secondary',
                                ml: 0.5,
                            }
                        }
                    }}
                />
            </Grid>

            {/* Charts */}
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
        </Grid>
    );
}

// ----------------------------------------------------------------------

type Props = {
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    icon: React.ReactNode;
    title: string;
    total: number;
    sx?: object;
    formatCurrency?: boolean;
};

function AppWidgetSummary({ title, total, icon, color = 'primary', sx, formatCurrency, ...other }: Props) {
    const theme = useTheme();

    return (
        <Card
            sx={{
                display: 'flex',
                alignItems: 'center',
                p: 3,
                ...sx,
            }}
            {...other}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                    {title}
                </Typography>
                <Typography variant="h3">
                    {formatCurrency ? fCurrency(total) + ' ₫' : fNumber(total)}
                </Typography>
            </Box>

            <Box
                sx={{
                    width: 120,
                    height: 120,
                    lineHeight: 0,
                    borderRadius: '50%',
                    bgcolor: 'background.neutral',
                }}
            >
                {icon}
            </Box>
        </Card>
    );
}
