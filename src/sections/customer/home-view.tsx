
import { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';

import Label from 'src/components/label';

import { fNumber } from 'src/utils/format-number';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import CustomerOrderList from './order-list';
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { useServicePoint } from 'src/hooks/api/use-service-point';

import { ConfirmDialog } from 'src/components/custom-dialog';


import { ITrip } from 'src/types/service-point';

// ----------------------------------------------------------------------

export default function CustomerHomeView() {
    const [currentTab, setCurrentTab] = useState('pending');
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();

    const { trips, confirmRequest, rejectRequest, useGetCompletedRequests, useGetRejectedRequests, useGetArrivedRequests, useGetCancelledRequests } = useServicePoint();

    // Pending Orders
    const orders = trips?.map((trip: ITrip) => ({
        id: trip.trip_id,
        driverName: trip.partner?.full_name || 'Tài xế',
        avatarUrl: '/assets/images/avatars/avatar_1.jpg',
        licensePlate: trip.partner?.partnerProfile?.vehicle_plate || 'Unknown',
        phone: '---',
        createdAt: new Date(trip.created_at),
        declaredGuests: trip.guest_count,
        servicePointName: trip.servicePoint?.name,
        pointsPerGuest: trip.reward_snapshot,
        status: trip.status === 'PENDING_CONFIRMATION' ? 'pending' : trip.status === 'ARRIVED' ? 'arrived' : 'confirmed',
    })) || [];

    // Completed Orders
    const { completedTrips } = useGetCompletedRequests();
    const completedOrders = completedTrips?.map((trip: ITrip) => ({
        id: trip.trip_id,
        driverName: trip.partner?.full_name || 'Tài xế',
        avatarUrl: '/assets/images/avatars/avatar_1.jpg',
        licensePlate: trip.partner?.partnerProfile?.vehicle_plate || 'Unknown',
        phone: '---',
        createdAt: trip.created_at,
        arrivalTime: trip.arrival_time,
        declaredGuests: trip.guest_count,
        servicePointName: trip.servicePoint?.name,
        pointsPerGuest: trip.reward_snapshot,
        status: trip.status === 'COMPLETED' ? 'confirmed' : 'cancelled',
    })) || [];

    // Rejected Orders
    const { rejectedTrips } = useGetRejectedRequests();
    const rejectedOrders = rejectedTrips?.map((trip: ITrip) => ({
        id: trip.trip_id,
        driverName: trip.partner?.full_name || 'Tài xế',
        avatarUrl: '/assets/images/avatars/avatar_1.jpg',
        licensePlate: trip.partner?.partnerProfile?.vehicle_plate || 'Unknown',
        phone: '---',
        createdAt: trip.created_at,
        arrivalTime: trip.arrival_time,
        declaredGuests: trip.guest_count,
        servicePointName: trip.servicePoint?.name,
        pointsPerGuest: trip.reward_snapshot,
        rejectReason: trip.reject_reason,
        status: 'cancelled',
    })) || [];

    // Cancelled Orders
    const { cancelledTrips } = useGetCancelledRequests();
    const cancelledOrders = cancelledTrips?.map((trip: ITrip) => ({
        id: trip.trip_id,
        driverName: trip.partner?.full_name || 'Tài xế',
        avatarUrl: '/assets/images/avatars/avatar_1.jpg',
        licensePlate: trip.partner?.partnerProfile?.vehicle_plate || 'Unknown',
        phone: '---',
        createdAt: trip.created_at,
        arrivalTime: trip.arrival_time,
        declaredGuests: trip.guest_count,
        servicePointName: trip.servicePoint?.name,
        pointsPerGuest: trip.reward_snapshot,
        rejectReason: trip.reject_reason,
        status: 'cancelled',
    })) || [];

    const pendingOrders = orders.filter(order => order.status === 'pending');

    // Arrived Orders
    const { arrivedTrips } = useGetArrivedRequests();
    const arrivedOrders = arrivedTrips?.map((trip: ITrip) => ({
        id: trip.trip_id,
        driverName: trip.partner?.full_name || 'Tài xế',
        avatarUrl: '/assets/images/avatars/avatar_1.jpg',
        licensePlate: trip.partner?.partnerProfile?.vehicle_plate || 'Unknown',
        phone: '---',
        createdAt: trip.created_at,
        arrivalTime: trip.arrival_time,
        declaredGuests: trip.guest_count,
        servicePointName: trip.servicePoint?.name,
        pointsPerGuest: trip.reward_snapshot,
        status: 'arrived',
    })) || [];

    const pendingCount = pendingOrders.length;
    const arrivedCount = arrivedOrders.length;

    const [selectedOrder, setSelectedOrder] = useState<{ id: string, guests: number, action: 'confirm' | 'cancel' } | null>(null);

    const [rejectedReason, setRejectedReason] = useState('');

    const confirm = useBoolean();

    const handleRequestConfirm = (orderId: string, actualGuests: number) => {
        setSelectedOrder({ id: orderId, guests: actualGuests, action: 'confirm' });
        confirm.onTrue();
    };

    const handleRequestCancel = (orderId: string) => {
        setSelectedOrder({ id: orderId, guests: 0, action: 'cancel' });
        setRejectedReason('');
        confirm.onTrue();
    };

    const handleConfirmAction = async () => {
        if (!selectedOrder) return;

        try {
            if (selectedOrder.action === 'confirm') {
                await confirmRequest(selectedOrder.id);
                enqueueSnackbar('Đã xác nhận thành công!', { variant: 'success' });
            } else {
                if (!rejectedReason.trim()) {
                    enqueueSnackbar('Vui lòng nhập lý do từ chối', { variant: 'error' });
                    return;
                }
                await rejectRequest(selectedOrder.id, 0, rejectedReason);
                enqueueSnackbar('Đã hủy yêu cầu', { variant: 'success' });
            }
            confirm.onFalse();
            setSelectedOrder(null);
        } catch (error: any) {
            console.error(error);
            enqueueSnackbar(error?.message || 'Thao tác thất bại', { variant: 'error' });
        }
    };

    // Chart & Stats Data Config
    const PERIOD_OPTIONS = [
        { value: 'today', label: 'Hôm nay' },
        { value: 'yesterday', label: 'Hôm qua' },
        { value: 'week', label: '7 ngày' },
        { value: 'month', label: 'Tháng này' },
    ];

    const [period, setPeriod] = useState('today');

    const { useGetBudgetStats } = useServicePoint();
    const { stats, statsLoading } = useGetBudgetStats(period);

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
                                            px: 1,
                                            opacity: statsLoading ? 0.5 : 1 // Dim when loading
                                        }}
                                    >
                                        {fNumber(stats?.totalSpent || 0)}

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
                            <Card sx={{ mb: 2 }}>
                                <Tabs
                                    value={currentTab}
                                    onChange={(e, newValue) => setCurrentTab(newValue)}
                                    sx={{
                                        px: 2,
                                        bgcolor: 'linear-gradient(to right, #FFC300, #FF5722)',
                                    }}
                                >
                                    <Tab
                                        value="pending"
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                Đang trong chuyến
                                                <Label color="warning" sx={{ ml: 1 }}>{pendingCount}</Label>
                                            </Box>
                                        }
                                    />
                                    <Tab
                                        value="cancelled"
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                Tài xế đã hủy
                                                <Label color="default" sx={{ ml: 1 }}>{cancelledOrders.length}</Label>
                                            </Box>
                                        }
                                    />
                                    <Tab
                                        value="arrived"
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                Tài xế đã đến
                                                <Label color="info" sx={{ ml: 1 }}>{arrivedCount}</Label>
                                            </Box>
                                        }
                                    />
                                    <Tab
                                        value="rejected"
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                Đã từ chối
                                                <Label color="default" sx={{ ml: 1 }}>{rejectedOrders.length}</Label>
                                            </Box>
                                        }
                                    />
                                    <Tab
                                        value="completed"
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                Đã xác nhận
                                                <Label color="success" sx={{ ml: 1 }}>{completedOrders.length}</Label>
                                            </Box>
                                        }
                                    />
                                </Tabs>
                            </Card>

                            {currentTab === 'pending' && (
                                <CustomerOrderList orders={pendingOrders} onConfirm={handleRequestConfirm} onCancel={handleRequestCancel} />
                            )}
                            {currentTab === 'arrived' && (
                                <CustomerOrderList orders={arrivedOrders} onConfirm={handleRequestConfirm} onCancel={handleRequestCancel} />
                            )}
                            {currentTab === 'completed' && (
                                <CustomerOrderList orders={completedOrders} />
                            )}
                            {currentTab === 'rejected' && (
                                <CustomerOrderList orders={rejectedOrders} />
                            )}
                            {currentTab === 'cancelled' && (
                                <CustomerOrderList orders={cancelledOrders} />
                            )}
                        </Grid>
                    </Grid>
                </Stack>
            </Container>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title={selectedOrder?.action === 'confirm' ? 'Xác nhận yêu cầu' : 'Hủy yêu cầu'}
                content={
                    selectedOrder?.action === 'confirm'
                        ? `Bạn có chắc chắn muốn xác nhận yêu cầu này với ${selectedOrder.guests} khách không ? `
                        : <Stack spacing={2}>
                            <Typography>Bạn có chắc chắn muốn hủy yêu cầu này không?</Typography>
                            <TextField
                                autoFocus
                                fullWidth
                                type="text"
                                margin="dense"
                                variant="outlined"
                                label="Lý do hủy"
                                placeholder="Nhập lý do hủy..."
                                value={rejectedReason}
                                onChange={(event) => setRejectedReason(event.target.value)}
                            />
                        </Stack>
                }
                action={
                    <Button variant="contained" color={selectedOrder?.action === 'confirm' ? 'primary' : 'error'} onClick={handleConfirmAction}>
                        {selectedOrder?.action === 'confirm' ? 'Xác nhận' : 'Hủy bỏ'}
                    </Button>
                }
            />
        </FormProvider>
    );
}
