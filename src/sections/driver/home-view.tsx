import { useState } from 'react';

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

// ----------------------------------------------------------------------

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

// Mock data import (should be shared or exported from a clearer source)
import { MOCK_SERVICE_POINTS } from 'src/sections/home/home-map-view';

export default function DriverHomeView() {
    const theme = useTheme();
    const router = useRouter();
    const mdUp = useResponsive('up', 'md');

    const [filter, setFilter] = useState('today');
    const [selectedPoint, setSelectedPoint] = useState<typeof MOCK_SERVICE_POINTS[0] | null>(null);
    const [quantity, setQuantity] = useState(1);

    const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
        if (newFilter !== null) {
            setFilter(newFilter);
        }
    };

    const handleStartTrip = () => {
        if (!selectedPoint) {
            alert("Vui lòng chọn điểm dịch vụ trước!");
            return;
        }
        alert(`Bắt đầu chuyến đi với ${quantity} khách đến ${selectedPoint.name}`);
    };

    return (
        <Stack spacing={3} p={2} sx={{ height: 'calc(100vh - 100px)' }}>
            {/* 1. Booking Section: Search & Form */}
            <Card sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Chọn điểm đến</Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid xs={12} md={6}>
                        <Autocomplete
                            fullWidth
                            autoHighlight
                            options={MOCK_SERVICE_POINTS}
                            getOptionLabel={(option) => option.name}
                            renderOption={(props, option) => (
                                <Box component="li" {...props} key={option.id}>
                                    <Iconify icon="eva:pin-fill" sx={{ color: 'primary.main', mr: 1 }} />
                                    <Box flexGrow={1}>
                                        {option.name}
                                        <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                                            ({option.type})
                                        </Typography>
                                    </Box>
                                    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', color: 'primary.main', fontWeight: 'bold' }}>
                                        {`${option.point} GoXu`}
                                    </Box>
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Tìm điểm dịch vụ..."
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <>
                                                <InputAdornment position="start">
                                                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                                </InputAdornment>
                                                {params.InputProps.startAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            onChange={(event, newValue) => {
                                setSelectedPoint(newValue);
                            }}
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
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconButton
                                            size="small"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                            edge="start"
                                        >
                                            <Iconify icon="eva:minus-fill" width={16} />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => setQuantity(quantity + 1)}
                                            edge="end"
                                        >
                                            <Iconify icon="eva:plus-fill" width={16} />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Số lượng khách"
                                inputProps={{ style: { textAlign: 'center' } }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid xs={12} md={12}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleStartTrip}
                            sx={{ height: 56, background: 'linear-gradient(135deg, #FFF176 0%, #FBC02D 100%)', color: '#000' }} // Match TextField height
                        >
                            Gửi đơn ngay
                        </Button>
                    </Grid>
                </Grid>
            </Card>

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
                        Ví
                    </Typography>
                    <Typography variant="h3">
                        {fPoint(1500000)}
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
                        <ToggleButton value="7days">7 ngày</ToggleButton>
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

            {/* 3. Map View (Bottom) */}
            <Box sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}`, flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
                {/* Pass selected point to map to trigger flyTo */}
                <HomeMapView sx={{ height: '100%', width: '100%' }} activePoint={selectedPoint} />
            </Box>
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
