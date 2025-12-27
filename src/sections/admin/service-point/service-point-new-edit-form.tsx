import { useState, useCallback, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';

import debounce from 'lodash/debounce';

import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { AdminServicePoint } from 'src/services/admin';
import { searchAddress, getPlaceDetail, VietmapAutocompleteResponse } from 'src/services/vietmap';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { VIETMAP_API_KEY, VIETMAP_TILE_KEY } from 'src/config-global';

// @ts-ignore
import vietmapGl from '@vietmap/vietmap-gl-js/dist/vietmap-gl.js';
import '@vietmap/vietmap-gl-js/dist/vietmap-gl.css';

// ----------------------------------------------------------------------

import { useAuthContext } from 'src/auth/hooks';

export type FormValues = {
    name: string;
    address: string;
    phone: string;
    rewardPoints: number;
    radius: number;
    lat: number;
    lng: number;
    status: boolean;
    password?: string;
    tax_id?: string;
};

type Props = {
    currentServicePoint?: AdminServicePoint;
    onSubmit?: (data: FormValues) => Promise<void>;
};

export default function ServicePointNewEditForm({ currentServicePoint, ...other }: Props) {
    const navigate = useNavigate();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    const { user } = useAuthContext();
    const isCustomer = user?.role === 'CUSTOMER';

    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<VietmapAutocompleteResponse[]>([]);

    const confirm = useBoolean();
    const [pendingData, setPendingData] = useState<FormValues | null>(null);

    const handleSearchAddress = useCallback(
        debounce(async (newValue: string) => {
            if (newValue) {
                const results = await searchAddress(newValue);
                setOptions(results);
            } else {
                setOptions([]);
            }
        }, 500),
        []
    );

    const NewServicePointSchema = Yup.object().shape({
        name: Yup.string().required('Tên quán / cơ sở là bắt buộc'),
        address: Yup.string().required('Địa chỉ là bắt buộc'),
        phone: Yup.string().default(''),
        rewardPoints: Yup.number().default(0),
        radius: Yup.number().required('Bán kính là bắt buộc').moreThan(0, 'Bán kính phải lớn hơn 0'),
        lat: Yup.number().default(21.028511),
        lng: Yup.number().default(105.854444),
        status: Yup.boolean().default(true),
        tax_id: Yup.string(), // Optional
        password: Yup.string().when([], {
            is: () => !currentServicePoint,
            then: (schema) => schema.required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
            otherwise: (schema) => schema.notRequired(),
        }),
    });

    const { control, handleSubmit, setValue, watch, reset } = useForm<FormValues>({
        resolver: yupResolver(NewServicePointSchema),
        defaultValues: {
            name: '',
            address: '',
            phone: '',
            rewardPoints: 0,
            radius: 50,
            lat: 21.028511,
            lng: 105.854444,
            status: true,
            password: '',
            tax_id: '',
        },
    });

    useEffect(() => {
        if (currentServicePoint) {
            reset({
                name: currentServicePoint.name || '',
                address: currentServicePoint.address || '',
                phone: currentServicePoint.phone || '',
                rewardPoints: currentServicePoint.rewardPoints || 0,
                radius: currentServicePoint.radius || 50,
                lat: currentServicePoint.lat || 21.028511,
                lng: currentServicePoint.lng || 105.854444,
                status: currentServicePoint.status === 'active' || true,
                tax_id: (currentServicePoint as any).tax_id || '', // Cast if AdminServicePoint doesn't have it yet, or check service definitions
            });
        }
    }, [currentServicePoint, reset]);

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
    }, [setValue]); // Remove currentServicePoint dependency from init to avoid re-init

    // Handle updates to currentServicePoint separate from map init
    useEffect(() => {
        if (currentServicePoint && mapRef.current) {
            console.log("Updating map for service point:", currentServicePoint);
            const { lng, lat } = currentServicePoint;

            // Fly to location
            mapRef.current.flyTo({
                center: [lng, lat],
                zoom: 16
            });

            // Update/Create Marker
            if (markerRef.current) {
                markerRef.current.setLngLat([lng, lat]);
            } else {
                markerRef.current = new vietmapGl.Marker({ color: 'red' })
                    .setLngLat([lng, lat])
                    .addTo(mapRef.current);
            }
        }
    }, [currentServicePoint]);


    const onSubmit = handleSubmit(async (data) => {
        setPendingData(data);
        confirm.onTrue();
    });

    const handleConfirmSubmit = async () => {
        if (!pendingData) return;

        setLoading(true);
        confirm.onFalse();
        const data = pendingData;

        console.log("Submitting:", data);

        if (other.onSubmit) {
            try {
                await other.onSubmit(data);
                setLoading(false);
                if (!currentServicePoint) {
                    navigate(paths.dashboard.admin.servicePoints.root);
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
            return;
        }

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert(currentServicePoint ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
            navigate(paths.dashboard.admin.servicePoints.root);
        }, 1000);
    };

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
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Tên quán / Cơ sở kinh doanh"
                                        error={!!error}
                                        helperText={error?.message}
                                        fullWidth
                                    />
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
                                    name="tax_id"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label="Mã số thuế" fullWidth />
                                    )}
                                />
                                {!currentServicePoint && (
                                    <Controller
                                        name="password"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                label="Mật khẩu"
                                                type="password"
                                                fullWidth
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                )}
                                <Controller
                                    name="rewardPoints"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Hoa hồng (GoXu)"
                                            type="number"
                                            fullWidth
                                            disabled={isCustomer}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">GoXu</InputAdornment>,
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
                                render={({ field, fieldState }) => (
                                    <Autocomplete
                                        fullWidth
                                        freeSolo
                                        options={options}
                                        getOptionLabel={(option) => {
                                            if (typeof option === 'string') return option;
                                            return option.address ? `${option.name}, ${option.address}` : option.name;
                                        }}
                                        filterOptions={(x) => x}
                                        value={field.value}
                                        onChange={async (event, newValue) => {
                                            // Handle selection
                                            if (newValue && typeof newValue !== 'string') {
                                                field.onChange(`${newValue.name}, ${newValue.address}`);

                                                // Get details and zoom
                                                try {
                                                    const detail = await getPlaceDetail(newValue.ref_id);
                                                    if (detail) {
                                                        setValue('lat', detail.lat);
                                                        setValue('lng', detail.lng);

                                                        // Update map
                                                        if (mapRef.current) {
                                                            mapRef.current.flyTo({
                                                                center: [detail.lng, detail.lat],
                                                                zoom: 16
                                                            });

                                                            // Update marker
                                                            if (markerRef.current) {
                                                                markerRef.current.setLngLat([detail.lng, detail.lat]);
                                                            } else {
                                                                markerRef.current = new vietmapGl.Marker({ color: 'red' })
                                                                    .setLngLat([detail.lng, detail.lat])
                                                                    .addTo(mapRef.current);
                                                            }
                                                        }
                                                    }
                                                } catch (error) {
                                                    console.error(error);
                                                }
                                            } else {
                                                field.onChange(newValue);
                                            }
                                        }}
                                        onInputChange={(event, newInputValue) => {
                                            field.onChange(newInputValue);
                                            handleSearchAddress(newInputValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Địa chỉ / Tìm kiếm"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error ? fieldState.error.message : "Nhập địa chỉ để tìm kiếm và tự động lấy toạ độ"}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {/* Add loading indicator if needed */}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                }}
                                            />
                                        )}
                                        renderOption={(props, option) => {
                                            return (
                                                <li {...props}>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                            {typeof option === 'string' ? option : option.name}
                                                        </Typography>
                                                        {typeof option !== 'string' && (
                                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                                {option.address}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </li>
                                            );
                                        }}
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

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Xác nhận"
                content={
                    <>
                        Bạn có chắc chắn muốn {currentServicePoint ? 'lưu thay đổi' : 'tạo mới'} điểm dịch vụ này?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirmSubmit}
                    >
                        Xác nhận
                    </Button>
                }
            />
        </form>
    );
}
