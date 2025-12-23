import { useState, useCallback, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { AdminServicePoint } from 'src/services/admin';
import { VIETMAP_API_KEY, VIETMAP_TILE_KEY } from 'src/config-global';
// @ts-ignore
import vietmapGl from '@vietmap/vietmap-gl-js/dist/vietmap-gl.js';
import '@vietmap/vietmap-gl-js/dist/vietmap-gl.css';

// ----------------------------------------------------------------------

type FormValues = {
    name: string;
    address: string;
    phone: string;
    rewardPoints: number;
    radius: number;
    lat: number;
    lng: number;
    status: boolean;
};

type Props = {
    currentServicePoint?: AdminServicePoint;
};

export default function ServicePointNewEditForm({ currentServicePoint }: Props) {
    const navigate = useNavigate();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
        defaultValues: {
            name: currentServicePoint?.name || '',
            address: currentServicePoint?.address || '',
            phone: currentServicePoint?.phone || '',
            rewardPoints: currentServicePoint?.rewardPoints || 0,
            radius: currentServicePoint?.radius || 50,
            lat: currentServicePoint?.lat || 21.028511,
            lng: currentServicePoint?.lng || 105.854444,
            status: currentServicePoint?.status === 'active' || true,
        },
    });

    // Initialize Map
    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {

            // Set Access Token
            (vietmapGl as any).accessToken = VIETMAP_TILE_KEY;

            mapRef.current = new vietmapGl.Map({
                container: mapContainerRef.current,
                style: `https://maps.vietmap.vn/api/maps/light/styles.json?apikey=${VIETMAP_TILE_KEY}`,
                center: [currentServicePoint?.lng || 105.854444, currentServicePoint?.lat || 21.028511],
                zoom: 13,
                pitch: 0,
            });

            mapRef.current.addControl(new vietmapGl.NavigationControl(), 'bottom-right');

            // Add initial marker if editing
            if (currentServicePoint) {
                const el = document.createElement('div');
                el.className = 'marker';
                el.style.backgroundImage = 'url(https://docs.vietmap.vn/assets/images/custom_marker-56d156555b41315510688d01d182281c.png)'; // Use a standard marker image or custom div
                el.style.width = '32px';
                el.style.height = '32px';
                el.style.backgroundSize = '100%';
                // Fallback to simple color div if image fails or use Vietmap default

                markerRef.current = new vietmapGl.Marker({ color: 'red' })
                    .setLngLat([currentServicePoint.lng, currentServicePoint.lat])
                    .addTo(mapRef.current);
            }

            mapRef.current.on('click', (e: any) => {
                const { lng, lat } = e.lngLat;

                // Update form
                setValue('lat', lat);
                setValue('lng', lng);
                setValue('address', `Đã chọn: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);

                // Update/Add Marker
                if (markerRef.current) {
                    markerRef.current.setLngLat([lng, lat]);
                } else {
                    markerRef.current = new vietmapGl.Marker({ color: 'red' })
                        .setLngLat([lng, lat])
                        .addTo(mapRef.current);
                }
            });
        }

        return () => {
            // Cleanup if needed
        };
    }, [currentServicePoint, setValue]);


    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        console.log("Submitting:", data);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert(currentServicePoint ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
            navigate(paths.dashboard.admin.servicePoints.root);
        }, 1000);
    });

    return (
        <form onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Thông tin cơ sở kinh doanh</Typography>
                        </Box>

                        <Stack spacing={3}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Tên quán / Cơ sở kinh doanh" required fullWidth />
                                )}
                            />

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label="Số điện thoại" fullWidth />
                                    )}
                                />
                                <Controller
                                    name="rewardPoints"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Điểm thưởng (pts)"
                                            type="number"
                                            fullWidth
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">pts</InputAdornment>,
                                            }}
                                        />
                                    )}
                                />
                            </Stack>

                            <Controller
                                name="radius"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Bán kính nhận diện (mét)"
                                        type="number"
                                        fullWidth
                                        helperText="Khoảng cách tối đa để ghi nhận tài xế đến quán"
                                    />
                                )}
                            />

                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Địa chỉ / Toạ độ"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        helperText="Click trên bản đồ để tự động lấy toạ độ"
                                    />
                                )}
                            />

                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Switch {...field} checked={field.value} />}
                                        label="Đang hoạt động"
                                    />
                                )}
                            />
                        </Stack>
                    </Card>
                </Grid>

                <Grid xs={12} md={4}>
                    <Card sx={{ p: 0.5, height: 400, position: 'relative' }}>
                        <Typography variant="subtitle2" sx={{ position: 'absolute', top: 10, left: 10, zIndex: 9, bgcolor: 'common.white', px: 1, py: 0.5, borderRadius: 1, boxShadow: 1 }}>
                            Chọn vị trí
                        </Typography>

                        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
                    </Card>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <LoadingButton type="submit" variant="contained" loading={loading} size="large">
                            {currentServicePoint ? 'Lưu thay đổi' : 'Tạo mới'}
                        </LoadingButton>
                    </Box>
                </Grid>
            </Grid>
        </form>
    );
}
