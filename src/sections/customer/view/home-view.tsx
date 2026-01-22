import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { mutate as globalMutate } from 'swr';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { useSocketListener } from 'src/hooks/use-socket';
import { useServicePoint, useGetAllRequests, useGetBudgetStats } from 'src/hooks/api/use-service-point';

import { endpoints } from 'src/utils/axios';
import { fNumber } from 'src/utils/format-number';
import { getFullImageUrl } from 'src/utils/get-image';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { ITrip, ICustomerOrder } from 'src/types/service-point';
import CustomerOrderList from '../order-list';
import ActiveDriversDrawer from '../active-drivers-drawer';
import ConversationsDrawer from 'src/sections/chat/conversations-drawer';

// ----------------------------------------------------------------------

export default function CustomerHomeView() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();

    useSocketListener('customer:new_trip_request', () => {
        globalMutate((key) => Array.isArray(key) && key[0] === endpoints.customer.allRequests);
        mutateList();
    });

    useSocketListener('customer:driver_arrived', () => {
        globalMutate((key) => Array.isArray(key) && key[0] === endpoints.customer.allRequests);
        mutateList();
    });

    useSocketListener('customer:trip_cancelled', () => {
        globalMutate((key) => Array.isArray(key) && key[0] === endpoints.customer.allRequests);
        mutateList();
    });



    const {
        confirmRequest,
        rejectRequest,
        tipDriver,
    } = useServicePoint();

    const activeDriversDrawer = useBoolean();
    const chatDrawer = useBoolean();

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 500);
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);

    const { trips, tripsTotal, mutate: mutateList } = useGetAllRequests(
        page,
        rowsPerPage,
        debouncedSearch,
        fromDate ? fromDate.toISOString() : undefined,
        toDate ? toDate.toISOString() : undefined
    );

    const orders: ICustomerOrder[] = trips?.map((trip: ITrip) => ({
        id: trip.trip_id,
        driverName: trip.partner?.full_name || 'Tài xế',
        avatarUrl: trip.partner?.avatar ? getFullImageUrl(trip.partner.avatar) : "",
        licensePlate: trip.partner?.partnerProfile?.vehicle_plate || 'Unknown',
        phone: '---',
        createdAt: new Date(trip.created_at),
        arrivalTime: trip.arrival_time ? new Date(trip.arrival_time) : undefined,
        declaredGuests: trip.guest_count,
        rejectReason: trip.reject_reason,
        tripCode: trip.trip_code,
        actualGuestCount: trip.actual_guest_count,
        servicePointName: trip.servicePoint?.name,
        pointsPerGuest: trip.reward_snapshot,
        status: trip.status === 'PENDING_CONFIRMATION' ? 'pending'
            : trip.status === 'ARRIVED' ? 'arrived'
                : trip.status === 'COMPLETED' ? 'confirmed'
                    : 'cancelled',
    })) || [];

    const getPaginationProps = (count: number) => ({
        page,
        rowsPerPage,
        count,
        onPageChange: (e: any, newPage: number) => setPage(newPage),
        onRowsPerPageChange: (e: any) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
        }
    });

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
                await confirmRequest(selectedOrder.id, selectedOrder.guests);
                enqueueSnackbar('Đã xác nhận thành công!', { variant: 'success' });
            } else {
                if (!rejectedReason.trim()) {
                    enqueueSnackbar('Vui lòng nhập lý do từ chối', { variant: 'error' });
                    return;
                }
                await rejectRequest(selectedOrder.id, 0, rejectedReason);
                enqueueSnackbar('Đã hủy yêu cầu', { variant: 'success' });
            }
            mutate();
            confirm.onFalse();
            setSelectedOrder(null);
        } catch (error: any) {
            console.error(error);
            enqueueSnackbar(error?.message || 'Thao tác thất bại', { variant: 'error' });
        }
    };

    const [tipDialogOpen, setTipDialogOpen] = useState(false);
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
    const [tipAmount, setTipAmount] = useState('');

    const handleTip = (tripId: string) => {
        setSelectedTripId(tripId);
        setTipAmount('');
        setTipDialogOpen(true);
    };

    const handleCloseTipDialog = () => {
        setTipDialogOpen(false);
        setSelectedTripId(null);
        setTipAmount('');
    };

    const handleConfirmTip = async () => {
        if (!selectedTripId || !tipAmount) return;

        const amount = Number(tipAmount.replace(/,/g, ''));
        if (isNaN(amount) || amount <= 0) {
            enqueueSnackbar('Vui lòng nhập số hoa hồng hợp lệ', { variant: 'error' });
            return;
        }

        try {
            await tipDriver(selectedTripId, amount);
            enqueueSnackbar('Đã gửi thưởng thành công!', { variant: 'success' });
            handleCloseTipDialog();
        } catch (error: any) {
            console.error(error);
            const errorMessage = Array.isArray(error?.message)
                ? error.message.join(', ')
                : error?.message || 'Gửi thưởng thất bại';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    };

    const PERIOD_OPTIONS = [
        { value: 'today', label: 'Hôm nay' },
        { value: 'yesterday', label: 'Hôm qua' },
        { value: 'week', label: '7 ngày' },
        { value: 'month', label: 'Tháng này' },
    ];

    const [period, setPeriod] = useState('today');

    const { stats, statsLoading, mutate } = useGetBudgetStats(period);

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
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Iconify icon="mdi:car-connected" />}
                                        onClick={activeDriversDrawer.onTrue}
                                        sx={{ borderRadius: 20, mb: 1, minWidth: 'fit-content' }}
                                    >
                                        Tài xế đang trực tuyến
                                    </Button>
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
                                            opacity: statsLoading ? 0.5 : 1
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
                                            Goxu
                                        </Box>
                                    </Typography>
                                </Box>

                            </Card>
                        </Grid>

                        <Grid xs={12}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="Tìm theo mã chuyến..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Stack direction="row" spacing={1} sx={{ width: { xs: 1, md: 'auto' } }}>
                                    <DatePicker
                                        label="Từ ngày"
                                        value={fromDate}
                                        maxDate={new Date()}
                                        onChange={(newValue) => {
                                            setFromDate(newValue);
                                            setPage(0);
                                        }}
                                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        sx={{ width: { xs: 1, md: 160 } }}
                                    />
                                    <DatePicker
                                        label="Đến ngày"
                                        value={toDate}
                                        maxDate={new Date()}
                                        onChange={(newValue) => {
                                            setToDate(newValue);
                                            setPage(0);
                                        }}
                                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        sx={{ width: { xs: 1, md: 160 } }}
                                    />
                                    {(fromDate || toDate) && (
                                        <Tooltip title="Xóa bộ lọc">
                                            <IconButton size="small" onClick={() => {
                                                setFromDate(null);
                                                setToDate(null);
                                                setSearchQuery('');
                                                setPage(0);
                                            }}>
                                                <Iconify icon="eva:trash-2-outline" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Stack>
                            </Stack>
                            <Card sx={{ mb: 2 }}>
                                <CustomerOrderList
                                    orders={orders}
                                    onConfirm={handleRequestConfirm}
                                    onCancel={handleRequestCancel}
                                    onTip={handleTip}
                                    pagination={getPaginationProps(tripsTotal)}
                                />
                            </Card>
                        </Grid>
                    </Grid>
                </Stack>
            </Container>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title={selectedOrder?.action === 'confirm' ? 'Xác nhận yêu cầu' : 'Từ chối yêu cầu'}
                content={
                    selectedOrder?.action === 'confirm'
                        ? `Bạn có chắc chắn muốn xác nhận yêu cầu này với ${selectedOrder.guests} khách không ? `
                        : <Stack spacing={2}>
                            <Typography>Bạn có chắc chắn muốn từ chối yêu cầu này không?</Typography>
                            <TextField
                                autoFocus
                                fullWidth
                                type="text"
                                margin="dense"
                                variant="outlined"
                                label="Lý do từ chối"
                                placeholder="Nhập lý do từ chối..."
                                value={rejectedReason}
                                onChange={(event) => setRejectedReason(event.target.value)}
                            />
                        </Stack>
                }
                action={
                    <Button variant="contained" color={selectedOrder?.action === 'confirm' ? 'primary' : 'error'} onClick={handleConfirmAction}>
                        {selectedOrder?.action === 'confirm' ? 'Xác nhận' : 'Từ chối'}
                    </Button>
                }
            />

            <Dialog open={tipDialogOpen} onClose={handleCloseTipDialog}>
                <DialogTitle>Thưởng hoa hồng thêm</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Nhập số hoa hồng bạn muốn thưởng thêm.
                    </Typography>
                    <TextField
                        autoFocus
                        fullWidth
                        type="number"
                        label="Số hoa hồng"
                        placeholder="Nhập số hoa hồng..."
                        value={tipAmount}
                        onChange={(e) => setTipAmount(e.target.value)}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">Goxu</InputAdornment>,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTipDialog} color="inherit">
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmTip} variant="contained" color="primary">
                        Thưởng
                    </Button>
                </DialogActions>
            </Dialog>

            <ActiveDriversDrawer
                open={activeDriversDrawer.value}
                onClose={activeDriversDrawer.onFalse}
                onOpenChat={chatDrawer.onTrue}
            />
        </FormProvider>
    );
}
