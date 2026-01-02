import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { fDateTime } from 'src/utils/format-time';
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';

import debounce from 'lodash/debounce';
import { useState, useMemo, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card, { CardProps } from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { fNumber, fPoint } from 'src/utils/format-number';
import Iconify from 'src/components/iconify';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import HomeMapView from 'src/sections/home/home-map-view';
import { useResponsive } from 'src/hooks/use-responsive';
import { usePartner } from 'src/hooks/api/use-partner';

import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

import { MOCK_SERVICE_POINTS } from 'src/sections/home/home-map-view';
import { enqueueSnackbar } from 'notistack';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { TablePaginationCustom } from 'src/components/table';

export default function DriverHomeView() {
    const theme = useTheme();
    const router = useRouter();
    const mdUp = useResponsive('up', 'md');

    const {
        useSearchDestination,
        createTripRequest,
        useGetMyRequests,
        useGetStats,
        confirmArrival,
        cancelRequest
    } = usePartner();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [searchKeyword, setSearchKeyword] = useState('');
    const { searchResults, searchLoading } = useSearchDestination(searchKeyword);
    const { requests, requestsLoading, requestsEmpty, requestsTotal, mutate: refetchRequests } = useGetMyRequests(page, rowsPerPage);

    const [filter, setFilter] = useState('today');
    const { stats, statsLoading } = useGetStats(filter as any);

    const [selectedPoint, setSelectedPoint] = useState<typeof MOCK_SERVICE_POINTS[0] | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Action Loading State
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const confirm = useBoolean();
    const confirmCancel = useBoolean();
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState('');

    // New State for Location and Routing
    const [userLocation, setUserLocation] = useState<{ lat: number; long: number } | null>(null);
    const [directionsTo, setDirectionsTo] = useState<{ lat: number; long: number } | null>(null);

    // Get User Location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }
    }, []);


    const handleSearch = useCallback(
        debounce((newValue: string) => {
            setSearchKeyword(newValue);
        }, 500),
        []
    );

    const searchOptions = useMemo(() => {
        return searchResults.map((item) => {
            let lat = 21.028511;
            let long = 105.854444;

            if (item.location) {
                const matches = item.location.match(/POINT\(([\d\.]+) ([\d\.]+)\)/);
                if (matches && matches.length === 3) {
                    lat = parseFloat(matches[1]);
                    long = parseFloat(matches[2]);
                }
            }

            return {
                id: item.id,
                name: item.name,
                address: item.address,
                lat: lat,
                long: long,
                type: 'Cơ sở kinh doanh',
                description: item.address,
                coverUrl: '',
                point: Number(parseFloat(item.reward_amount || '0')),
                budget: Number(parseFloat(item.advertising_budget || '0')),
            };
        });
    }, [searchResults]);


    const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
        if (newFilter !== null) {
            setFilter(newFilter);
        }
    };

    const handleClickStart = () => {
        if (!selectedPoint) {
            enqueueSnackbar("Vui lòng chọn điểm dịch vụ trước!", { variant: 'warning' });
            return;
        }
        confirm.onTrue();
    };

    const handleConfirmTrip = async () => {
        if (!selectedPoint) return;

        try {
            setSubmitLoading(true);
            const response = await createTripRequest(selectedPoint.id, quantity);
            enqueueSnackbar(response.message || `Đã gửi yêu cầu đến ${selectedPoint.name}`, { variant: 'success' });

            // Trigger Navigation
            setDirectionsTo({ lat: selectedPoint.lat, long: selectedPoint.long });
            refetchRequests();
            confirm.onFalse();
        } catch (error) {
            console.error(error);
            enqueueSnackbar(typeof error === 'string' ? error : (error as any).message || 'Có lỗi xảy ra khi gửi yêu cầu', { variant: 'error' });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleConfirmArrival = async (tripId: string) => {
        try {
            setActionLoading(tripId);
            await confirmArrival(tripId);
            enqueueSnackbar('Đã xác nhận đến điểm đón', { variant: 'success' });
            refetchRequests();
        } catch (error) {
            console.error(error);
            enqueueSnackbar(typeof error === 'string' ? error : (error as any).message || 'Có lỗi xảy ra', { variant: 'error' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleCancelRequestClick = (tripId: string) => {
        setSelectedTripId(tripId);
        setCancelReason('');
        confirmCancel.onTrue();
    }

    const handleCancelRequest = async () => {
        if (!selectedTripId) return;
        try {
            setActionLoading(selectedTripId);
            await cancelRequest(selectedTripId, cancelReason);
            enqueueSnackbar('Đã hủy yêu cầu', { variant: 'success' });
            refetchRequests();
            confirmCancel.onFalse();
        } catch (error) {
            console.error(error);
            enqueueSnackbar(typeof error === 'string' ? error : (error as any).message || 'Có lỗi xảy ra', { variant: 'error' });
        } finally {
            setActionLoading(null);
            setSelectedTripId(null);
        }
    };

    return (
        <Stack spacing={3} p={2} sx={{ height: mdUp ? '100%' : 'auto' }}>
            <Card sx={{
                p: 2,
                background: 'linear-gradient(135deg, #FFF176 0%, #FBC02D 100%)',
                color: '#000',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
            }}>
                <Stack spacing={1} sx={{ width: { xs: 1, md: 'auto' }, zIndex: 1 }}>
                    <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                        Tổng điểm
                    </Typography>
                    <Typography variant="h3">
                        {statsLoading ? '...' : fPoint(stats?.total_points || 0)}
                    </Typography>

                    <ToggleButtonGroup
                        value={filter}
                        exclusive
                        onChange={handleFilterChange}
                        size="small"
                        sx={{
                            mt: 2,
                            width: { xs: 1, md: 'auto' },
                            display: 'flex',
                            overflow: 'auto',
                            '& .MuiToggleButton-root': {
                                flex: { xs: 1, md: 'none' },
                                whiteSpace: 'nowrap',
                                color: 'rgba(0,0,0,0.6)',
                                borderColor: 'rgba(0,0,0,0.12)',
                                '&.Mui-selected': {
                                    bgcolor: 'rgba(0,0,0,0.08)',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        bgcolor: 'rgba(0,0,0,0.12)',
                                    }
                                }
                            }
                        }}
                    >
                        <ToggleButton value="today">Hôm nay</ToggleButton>
                        <ToggleButton value="yesterday">Hôm qua</ToggleButton>
                        <ToggleButton value="week">7 ngày</ToggleButton>
                        <ToggleButton value="month">Tháng này</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>

                <Box
                    component="img"
                    src="/assets/illustrations/wallet_illustration.png"
                    alt="wallet"
                    sx={{
                        width: 140,
                        height: 140,
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.24))',
                        position: { xs: 'absolute', md: 'relative' },
                        right: { xs: -20, md: -16 },
                        bottom: { xs: -20, md: -16 },
                        opacity: { xs: 0.48, md: 1 },
                        mr: { xs: 0, md: -2 },
                        my: { xs: 0, md: -2 },
                    }}
                />
            </Card>

            <Card sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Chọn điểm đến</Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid xs={12} md={6}>
                        <Autocomplete
                            fullWidth
                            size='medium'
                            autoHighlight
                            options={searchOptions}
                            loading={searchLoading}
                            getOptionLabel={(option) => option.name}
                            onInputChange={(event, newInputValue) => {
                                handleSearch(newInputValue);
                            }}
                            onChange={(event, newValue) => {
                                setSelectedPoint(newValue);
                            }}
                            noOptionsText="Chưa có dữ liệu"
                            renderOption={(props, option) => (
                                <Box component="li" {...props} key={option.id}>
                                    <Iconify key={`${option.id}-icon`} icon="eva:pin-fill" sx={{ color: 'primary.main', mr: 1 }} />
                                    <Box flexGrow={1} key={`${option.id}-name`}>
                                        {option.name}
                                        <Typography variant='caption' key={`${option.id}-type`}>
                                            {` (${option.type})`}
                                        </Typography>
                                    </Box>
                                    <Box key={`${option.id}-point`} sx={{ ml: 2, display: 'flex', alignItems: 'center', color: 'primary.main', fontWeight: 'bold' }}>
                                        {`${fNumber(option.point)} GoXu`}
                                    </Box>
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size='medium'
                                    placeholder="Tìm điểm đến..."
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <IconButton size="large" disabled edge="start" disableRipple>
                                                        <Iconify icon="eva:search-fill" width={30} sx={{ color: 'text.disabled' }} />
                                                    </IconButton>
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                    }}
                                    inputProps={{
                                        ...params.inputProps,
                                        style: { ...params.inputProps.style, fontSize: 20, fontWeight: 'bold' }
                                    }}
                                />
                            )}
                            value={selectedPoint}
                        />
                    </Grid>
                    <Grid xs={12} md={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="quantity-input">Số lượng khách</InputLabel>
                            <OutlinedInput
                                id="quantity-input"
                                type="number"
                                value={quantity}
                                size='medium'
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconButton
                                            size="large"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                            edge="start"
                                        >
                                            <Iconify icon="eva:minus-fill" width={30} />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="large"
                                            onClick={() => setQuantity(quantity + 1)}
                                            edge="end"
                                        >
                                            <Iconify icon="eva:plus-fill" width={30} />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Số lượng khách"
                                inputProps={{ style: { textAlign: 'center', fontSize: 20, fontWeight: 'bold' } }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid xs={12} md={12}>
                        <LoadingButton
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleClickStart}
                            sx={{ height: 56, background: 'linear-gradient(135deg, #FFF176 0%, #FBC02D 100%)', color: '#000' }} // Match TextField height
                        >
                            Gửi đơn ngay
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Card>

            {/* <Box sx={{
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                flexGrow: 1,
                position: 'relative',
                overflow: 'hidden',
            }}>
                <HomeMapView
                    sx={{ height: mdUp ? '100%' : 400, width: '100%' }}
                    activePoint={selectedPoint}
                    points={selectedPoint ? [selectedPoint] : MOCK_SERVICE_POINTS}
                    userLocation={userLocation}
                    directionsTo={directionsTo}
                />
            </Box> */}

            <Card>
                <Typography variant="h6" sx={{ p: 2, pb: 0 }}>Lịch sử yêu cầu</Typography>
                {mdUp ? (
                    <TableContainer sx={{ mt: 2, overflow: 'unset' }}>
                        <Scrollbar>
                            <Table sx={{ minWidth: 800 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Công ty</TableCell>
                                        <TableCell>Địa chỉ</TableCell>
                                        <TableCell>Số khách đã báo</TableCell>
                                        <TableCell>Số khách công ty báo</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Điểm của chuyến</TableCell>
                                        <TableCell>Thời gian</TableCell>
                                        <TableCell align='center'></TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {requests.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.service_point_name}</TableCell>
                                            <TableCell>{row.service_point_address}</TableCell>
                                            <TableCell align="center">{row.guest_count}</TableCell>
                                            <TableCell align="center">{row.actual_guest_count || 'Chưa cập nhật'}</TableCell>
                                            <TableCell>
                                                <Label
                                                    variant="soft"
                                                    color={
                                                        (row.status === 'COMPLETED' && 'success') ||
                                                        (row.status === 'ARRIVED' && 'primary') ||
                                                        (row.status === 'PENDING_CONFIRMATION' && 'warning') ||
                                                        (row.status === 'REJECTED' && 'error') ||
                                                        'default'
                                                    }
                                                >
                                                    {row.status === 'PENDING_CONFIRMATION' ? 'Đang trong chuyến' :
                                                        row.status === 'ARRIVED' ? 'Đã đến nơi' :
                                                            row.status === 'COMPLETED' ? 'Đã hoàn thành' :
                                                                row.status === 'CANCELLED' ? 'Đã hủy' :
                                                                    row.status === 'REJECTED' ? 'Bị từ chối' : row.status}
                                                </Label>
                                            </TableCell>
                                            <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                                {fPoint(row.reward_goxu)}
                                            </TableCell>
                                            <TableCell>{fDateTime(row.created_at)}</TableCell>
                                            <TableCell align='center'>
                                                {row.status === 'PENDING_CONFIRMATION' && (
                                                    <Stack direction="row" spacing={1} justifyContent="center">
                                                        <LoadingButton
                                                            size="large"
                                                            variant="contained"
                                                            color="success"
                                                            loading={actionLoading === row.id}
                                                            onClick={() => handleConfirmArrival(row.id)}
                                                            sx={{ whiteSpace: 'nowrap' }}
                                                        >
                                                            Đã đến nơi
                                                        </LoadingButton>
                                                        <LoadingButton
                                                            size="large"
                                                            variant="outlined"
                                                            color="error"
                                                            onClick={() => handleCancelRequestClick(row.id)}
                                                        >
                                                            Hủy
                                                        </LoadingButton>
                                                    </Stack>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {requestsEmpty && (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ p: 3 }}>
                                                <Typography variant="body2">Chưa có yêu cầu nào</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Scrollbar>

                        <TablePaginationCustom
                            count={requestsTotal}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={(e, newPage) => setPage(newPage)}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                            rowsPerPageOptions={[5, 10, 25]}
                        />
                    </TableContainer>
                ) : (
                    <Stack spacing={2} sx={{ mt: 2, p: 2 }}>
                        {requests.map((row) => (
                            <Card key={row.id} sx={{ p: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', bgcolor: 'background.neutral' }}>
                                <Stack spacing={1} sx={{ flexGrow: 1, minWidth: 0, mr: 1 }}>
                                    <Typography variant="subtitle2" noWrap>{row.service_point_name}</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>{row.service_point_address}</Typography>

                                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" rowGap={1}>
                                        <Label
                                            variant="soft"
                                            color={
                                                (row.status === 'COMPLETED' && 'success') ||
                                                (row.status === 'ARRIVED' && 'primary') ||
                                                (row.status === 'PENDING_CONFIRMATION' && 'warning') ||
                                                (row.status === 'REJECTED' && 'error') ||
                                                'default'
                                            }
                                        >
                                            {row.status === 'PENDING_CONFIRMATION' ? 'Đang trong chuyến' :
                                                row.status === 'ARRIVED' ? 'Đã đến nơi' :
                                                    row.status === 'COMPLETED' ? 'Đã hoàn thành' :
                                                        row.status === 'CANCELLED' ? 'Đã hủy' :
                                                            row.status === 'REJECTED' ? 'Bị từ chối' : row.status}
                                        </Label>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>• {fDateTime(row.created_at)}</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>• Đã báo: {row.guest_count} khách</Typography>
                                        {row.actual_guest_count &&
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>• Công ty báo: {row.actual_guest_count} khách</Typography>
                                        }
                                    </Stack>

                                    {row.status === 'PENDING_CONFIRMATION' && (
                                        <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                                            <LoadingButton
                                                size="large"
                                                variant="contained"
                                                color="success"
                                                loading={actionLoading === row.id}
                                                onClick={() => handleConfirmArrival(row.id)}
                                                sx={{ px: 2 }}
                                            >
                                                Đã đến
                                            </LoadingButton>
                                            <LoadingButton
                                                size="large"
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleCancelRequestClick(row.id)}
                                            >
                                                Hủy
                                            </LoadingButton>
                                        </Stack>
                                    )}
                                </Stack>

                                <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
                                    <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                        +{fPoint(row.reward_goxu)}
                                    </Typography>
                                </Stack>
                            </Card>
                        ))}

                        {requestsEmpty && (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Chưa có yêu cầu nào</Typography>
                            </Box>
                        )}
                    </Stack>
                )}
            </Card>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Xác nhận gửi yêu cầu"
                content={
                    <>
                        Bạn có chắc chắn muốn gửi yêu cầu <strong>{quantity} khách</strong> đến <strong>{selectedPoint?.name}</strong> không?
                        <br />
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                            Dự kiến nhận: <strong>{fPoint((selectedPoint?.point || 0) * quantity)}</strong>
                        </Typography>
                    </>
                }
                action={
                    <LoadingButton
                        variant="contained"
                        color="warning"
                        loading={submitLoading}
                        onClick={handleConfirmTrip}
                    >
                        Xác nhận gửi
                    </LoadingButton>
                }
            />

            <ConfirmDialog
                open={confirmCancel.value}
                onClose={confirmCancel.onFalse}
                title="Xác nhận hủy yêu cầu"
                content={
                    <Stack spacing={2}>
                        <Typography>Bạn có chắc chắn muốn hủy yêu cầu này không?</Typography>
                        <TextField
                            autoFocus
                            fullWidth
                            type="text"
                            margin="dense"
                            variant="outlined"
                            label="Lý do hủy"
                            placeholder="Nhập lý do hủy..."
                            value={cancelReason}
                            onChange={(event) => setCancelReason(event.target.value)}
                        />
                    </Stack>
                }
                action={
                    <LoadingButton
                        variant="contained"
                        color="error"
                        loading={actionLoading === selectedTripId}
                        onClick={handleCancelRequest}
                    >
                        Xác nhận hủy
                    </LoadingButton>
                }
            />
        </Stack>
    );
}

// ----------------------------------------------------------------------

interface StatCardProps extends CardProps {
    title: string;
    total: number;
    icon: React.ReactNode;
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    suffix?: string;
    isPoint?: boolean;
}

function StatCard({ title, total, icon, color = 'primary', suffix, isPoint, sx, ...other }: StatCardProps) {
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
                    {isPoint ? fPoint(total) : fNumber(total)}
                    {suffix && <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary', ml: 0.5 }}>{suffix}</Typography>}
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
