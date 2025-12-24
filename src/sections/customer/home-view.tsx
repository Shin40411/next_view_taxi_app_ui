import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form';
import Container from '@mui/material/Container';
import { useSettingsContext } from 'src/components/settings';
import CustomerOrderList from './order-list';
import { useSnackbar } from 'src/components/snackbar';

// Mock Incoming Orders (Moved from order-list)
const MOCK_ORDERS = [
    {
        id: '1',
        driverName: 'Nguyễn Văn A',
        avatarUrl: '/assets/images/avatars/avatar_1.jpg',
        licensePlate: '30A-123.45',
        phone: '0987654321',
        createdAt: new Date(),
        declaredGuests: 2,
        servicePointName: 'Cà phê Trung Nguyên - Duy Tân',
        pointsPerGuest: 50,
        status: 'pending', // pending, confirmed
    },
    {
        id: '2',
        driverName: 'Trần Thị B',
        avatarUrl: '/assets/images/avatars/avatar_2.jpg',
        licensePlate: '29H-999.99',
        phone: '0123456789',
        createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
        declaredGuests: 4,
        servicePointName: 'Cà phê Trung Nguyên - Cầu Giấy',
        pointsPerGuest: 50,
        status: 'pending',
    },
    {
        id: '3',
        driverName: 'Lê Văn C',
        avatarUrl: '/assets/images/avatars/avatar_3.jpg',
        licensePlate: '30E-555.55',
        phone: '0901234567',
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        declaredGuests: 1,
        servicePointName: 'Nhà hàng Biển Đông',
        pointsPerGuest: 50,
        status: 'pending',
    },
    {
        id: '4',
        driverName: 'Phạm Thị D',
        avatarUrl: '/assets/images/avatars/avatar_4.jpg',
        licensePlate: '29A-678.90',
        phone: '0912345678',
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        declaredGuests: 6,
        servicePointName: 'Karaoke Top One',
        pointsPerGuest: 50,
        status: 'pending',
    },
    {
        id: '5',
        driverName: 'Hoàng Văn E',
        avatarUrl: '/assets/images/avatars/avatar_5.jpg',
        licensePlate: '30F-111.22',
        phone: '0988888888',
        createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
        declaredGuests: 3,
        servicePointName: 'Khách sạn Metropole',
        pointsPerGuest: 50,
        status: 'pending',
    },
    {
        id: '6',
        driverName: 'Đỗ Thị F',
        avatarUrl: '/assets/images/avatars/avatar_6.jpg',
        licensePlate: '17B-666.88',
        phone: '0977777777',
        createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        declaredGuests: 2,
        servicePointName: 'Massage Sen Tài Thu',
        pointsPerGuest: 50,
        status: 'pending',
    },
    {
        id: '7',
        driverName: 'Ngô Văn G',
        avatarUrl: '/assets/images/avatars/avatar_7.jpg',
        licensePlate: '99A-999.99',
        phone: '0966666666',
        createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        declaredGuests: 8,
        servicePointName: 'Buffet Sen Tây Hồ',
        pointsPerGuest: 50,
        status: 'pending',
    },
];
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

export default function CustomerHomeView() {

    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();

    const [orders, setOrders] = useState(MOCK_ORDERS);

    const pendingCount = orders.filter(order => order.status === 'pending').length;

    const handleConfirmOrder = (orderId: string, actualGuests: number) => {
        // Update status logic
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status: 'confirmed' } : o
        ));
        enqueueSnackbar('Đã xác nhận thành công!', { variant: 'success' });
        console.log(`Confirmed Order ${orderId}: Actual Guests ${actualGuests}`);
    };

    // Chart & Stats Data Config
    const PERIOD_OPTIONS = [
        { value: 'today', label: 'Hôm nay' },
        { value: 'yesterday', label: 'Hôm qua' },
        { value: 'week', label: '7 ngày qua' },
        { value: 'month', label: 'Tháng này' },
    ];

    const [period, setPeriod] = useState('today');

    // Extended Mock Data with Totals
    const statsMockData: Record<string, {
        totalGuests: number;
        totalPoints: number;
        categories: string[];
        data: number[]
    }> = {
        today: {
            totalGuests: 12,
            totalPoints: 600000,
            categories: ['0-2h', '2-4h', '4-6h', '6-8h', '8-10h', '10-12h', '12-14h', '14-16h', '16-18h', '18-20h', '20-22h', '22-24h'],
            data: [0, 0, 0, 50000, 100000, 50000, 20000, 0, 0, 150000, 230000, 0],
        },
        yesterday: {
            totalGuests: 25,
            totalPoints: 1250000,
            categories: ['0-2h', '2-4h', '4-6h', '6-8h', '8-10h', '10-12h', '12-14h', '14-16h', '16-18h', '18-20h', '20-22h', '22-24h'],
            data: [20000, 0, 0, 30000, 80000, 150000, 40000, 20000, 90000, 100000, 50000, 10000],
        },
        week: {
            totalGuests: 156,
            totalPoints: 7800000,
            categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
            data: [500000, 350000, 200000, 450000, 600000, 800000, 750000],
        },
        month: {
            totalGuests: 650,
            totalPoints: 32500000,
            categories: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
            data: [2500000, 3200000, 1800000, 4100000],
        },
    };

    const currentStats = statsMockData[period];

    const methods = useForm({
        defaultValues: {
            chartPeriod: 'today'
        }
    });

    const settings = useSettingsContext();

    return (
        <FormProvider methods={methods}>
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <Stack spacing={3} sx={{ height: '100%' }}>
                    <Grid container spacing={3}>
                        <Grid xs={12}>
                            <Card sx={{ p: 0, boxShadow: 'none', border: 'none' }}>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    useFlexGap
                                    flexWrap="wrap"
                                    sx={{ my: 2 }}
                                >
                                    {PERIOD_OPTIONS.map((option) => {
                                        const isSelected = period === option.value;
                                        return (
                                            <Button
                                                key={option.value}
                                                variant={isSelected ? 'contained' : 'outlined'}
                                                onClick={() => setPeriod(option.value)}
                                                sx={{
                                                    borderRadius: 20,
                                                    textTransform: 'none',
                                                    fontWeight: isSelected ? 'bold' : 'normal',
                                                    boxShadow: 'none',
                                                    minWidth: 'fit-content',
                                                    mb: 1,

                                                    ...(isSelected && {
                                                        bgcolor: '#1C252E',
                                                        color: '#fff',
                                                        border: 'none',
                                                        '&:hover': { bgcolor: '#454F5B' },
                                                    }),
                                                    ...(!isSelected && {
                                                        borderColor: '#E0E0E0',
                                                        color: 'text.secondary',
                                                        bgcolor: 'transparent',
                                                        '&:hover': { bgcolor: 'action.hover', borderColor: '#E0E0E0' },
                                                    }),
                                                }}
                                            >
                                                {option.label}
                                            </Button>
                                        );
                                    })}
                                </Stack>

                                <Box
                                    sx={{
                                        borderRadius: 2,
                                        textAlign: 'center',
                                        bgcolor: '#FFD600',
                                        color: '#212B36',
                                        py: 1.5,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '50px',
                                        boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25)',
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            opacity: 0.8,
                                            mb: 1,
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        TỔNG ĐIỂM THƯỞNG
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                                            lineHeight: 1,
                                            wordBreak: 'break-word',
                                            width: '100%',
                                            px: 1
                                        }}
                                    >
                                        {fNumber(currentStats.totalPoints)}

                                        <Box
                                            component="span"
                                            sx={{
                                                fontSize: { xs: '0.85rem', md: '0.85rem' },
                                                fontWeight: 600,
                                                ml: 1
                                            }}
                                        >
                                            GoXu
                                        </Box>
                                    </Typography>
                                </Box>

                            </Card>
                        </Grid>

                        <Grid xs={12}>
                            <Typography variant="h6" sx={{ mb: 2, px: 2 }}>
                                Yêu cầu đang chờ <Box component="span" sx={{ color: 'error.main' }}>({pendingCount})</Box>
                            </Typography>
                            <CustomerOrderList orders={orders} onConfirm={handleConfirmOrder} />
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        </FormProvider>
    );
}
