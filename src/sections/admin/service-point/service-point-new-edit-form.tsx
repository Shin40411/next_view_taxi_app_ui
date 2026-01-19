import { useState, useCallback, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { useForm, Controller, FormProvider } from 'react-hook-form';
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
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import debounce from 'lodash/debounce';

import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { _PROVINCES } from 'src/_mock/_provinces';
import { AdminServicePoint } from 'src/services/admin';
import { useSnackbar } from 'src/components/snackbar';
import { searchAddress, getPlaceDetail, VietmapAutocompleteResponse } from 'src/services/vietmap';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useWallet } from 'src/hooks/api/use-wallet';
import { IBank } from 'src/types/wallet';


import { VIETMAP_API_KEY, VIETMAP_TILE_KEY } from 'src/config-global';

// @ts-ignore
import vietmapGl from '@vietmap/vietmap-gl-js/dist/vietmap-gl.js';
import '@vietmap/vietmap-gl-js/dist/vietmap-gl.css';

// ----------------------------------------------------------------------

import { RHFUpload, RHFUploadAvatar } from 'src/components/hook-form';
import { ASSETS_API } from 'src/config-global';

import { useAuthContext } from 'src/auth/hooks';
import { FormValues } from './interface/form-value';
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
    const { enqueueSnackbar } = useSnackbar();
    const { useGetBanks } = useWallet();
    const { banks: banksList } = useGetBanks();

    const bankOptions = banksList.map((bank: IBank) => bank);

    const NewServicePointSchema = Yup.object().shape({
        name: Yup.string().required('Tên công ty / cơ sở là bắt buộc').max(100, 'Tên công ty tối đa 100 ký tự'),
        address: Yup.string().required('Địa chỉ là bắt buộc').max(255, 'Địa chỉ tối đa 255 ký tự'),
        phone: Yup.string().required('Số điện thoại là bắt buộc').default('').max(15, 'Số điện thoại tối đa 15 ký tự'),
        email: Yup.string().required('Email là bắt buộc').email('Email không hợp lệ').max(255, 'Email tối đa 255 ký tự'),
        rewardPoints: Yup.number().when([], {
            is: () => user?.role === 'ADMIN' || user?.role === 'MONITOR',
            then: (schema) => schema.min(10, 'Tối thiểu 10 Goxu').required('Bắt buộc'),
            otherwise: (schema) => schema.notRequired(),
        }),
        discount: Yup.number().when([], {
            is: () => user?.role === 'ADMIN' || user?.role === 'MONITOR',
            then: (schema) => schema.min(5, 'Tối thiểu 5%').required('Bắt buộc'),
            otherwise: (schema) => schema.notRequired(),
        }),
        radius: Yup.number().default(50),
        lat: Yup.number().default(21.028511),
        lng: Yup.number().default(105.854444),
        status: Yup.boolean().default(true),
        province: Yup.string().required('Tỉnh / Thành phố là bắt buộc').max(100, 'Tỉnh / Thành phố tối đa 100 ký tự'),
        tax_id: Yup.string().required('Mã số thuế là bắt buộc').max(15, 'Mã số thuế không hợp lệ'),
        bank_name: Yup.string().max(100, 'Tên ngân hàng tối đa 100 ký tự')
            .when([], {
                is: () => user?.role === 'ADMIN' || user?.role === 'MONITOR',
                then: (schema) => schema.notRequired(),
                otherwise: (schema) => schema.required('Tên ngân hàng là bắt buộc'),
            }),
        account_number: Yup.string().max(50, 'Số tài khoản tối đa 50 ký tự')
            .when([], {
                is: () => user?.role === 'ADMIN' || user?.role === 'MONITOR',
                then: (schema) => schema.notRequired(),
                otherwise: (schema) => schema.required('Số tài khoản là bắt buộc'),
            }),
        account_holder_name: Yup.string().max(100, 'Tên chủ tài khoản tối đa 100 ký tự')
            .when([], {
                is: () => user?.role === 'ADMIN' || user?.role === 'MONITOR',
                then: (schema) => schema.notRequired(),
                otherwise: (schema) => schema.required('Tên chủ tài khoản là bắt buộc'),
            }),
        password: Yup.string().when([], {
            is: () => !currentServicePoint,
            then: (schema) => schema.required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
            otherwise: (schema) => schema.notRequired(),
        }),
        contract: Yup.mixed().nullable().when([], {
            is: () => user?.role === 'ADMIN' || user?.role === 'MONITOR',
            then: (schema) => schema.notRequired(),
            otherwise: (schema) => schema.notRequired(),
        }),
        avatar: Yup.mixed().nullable(),
        wallet_expiry_date: Yup.date()
            .nullable()
            .when([], {
                is: () => user?.role === 'ADMIN' || user?.role === 'MONITOR',
                then: (schema) => schema.required('Hạn sử dụng ví là bắt buộc').typeError('Ngày hết hạn không hợp lệ'),
                otherwise: (schema) => schema.notRequired(),
            }),
    });

    const methods = useForm<FormValues>({
        resolver: yupResolver(NewServicePointSchema),
        defaultValues: {
            name: '',
            address: '',
            phone: '',
            email: '',
            rewardPoints: 0,
            discount: 0,
            radius: 50,
            lat: 21.028511,
            lng: 105.854444,
            status: true,
            province: '',
            password: '',
            tax_id: '',
            bank_name: '',
            account_number: '',
            account_holder_name: '',
            contract: null,
            avatar: null,
            wallet_expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        },
    });

    const { control, handleSubmit, setValue, watch, reset } = methods;

    useEffect(() => {
        if (currentServicePoint) {
            reset({
                name: currentServicePoint.name || '',
                address: currentServicePoint.address || '',
                phone: currentServicePoint.phone || '',
                email: currentServicePoint.email || '',
                rewardPoints: currentServicePoint.rewardPoints || 0,
                discount: currentServicePoint.discount || 0,
                radius: currentServicePoint.radius || 50,
                lat: currentServicePoint.lat || 21.028511,
                lng: currentServicePoint.lng || 105.854444,
                status: currentServicePoint.status === 'active' || true,
                province: (currentServicePoint as any).province || '',
                tax_id: (currentServicePoint).tax_id || '',
                bank_name: currentServicePoint.bank_name || (currentServicePoint as any).bankAccount?.bank_name || '',
                account_number: currentServicePoint.account_number || (currentServicePoint as any).bankAccount?.account_number || '',

                account_holder_name: currentServicePoint.account_holder_name || (currentServicePoint as any).bankAccount?.account_holder_name || '',
                contract: (currentServicePoint as any).contract
                    ? ((currentServicePoint as any).contract.startsWith('http')
                        ? (currentServicePoint as any).contract
                        : `${ASSETS_API}/${(currentServicePoint as any).contract.replace(/\\/g, '/')}`)
                    : null,
                avatar: (currentServicePoint as any).avatar
                    ? ((currentServicePoint as any).avatar.startsWith('http')
                        ? (currentServicePoint as any).avatar
                        : `${ASSETS_API}/${(currentServicePoint as any).avatar.replace(/\\/g, '/')}`)
                    : null,
                wallet_expiry_date: (currentServicePoint as any).wallet_expiry_date ? new Date((currentServicePoint as any).wallet_expiry_date) : null,
            });
        }
    }, [currentServicePoint, reset]);

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
        };
    }, [setValue]);

    useEffect(() => {
        if (currentServicePoint && mapRef.current) {
            // console.log("Updating map for service point:", currentServicePoint);
            const { lng, lat } = currentServicePoint;

            mapRef.current.flyTo({
                center: [lng, lat],
                zoom: 16
            });

            if (markerRef.current) {
                markerRef.current.setLngLat([lng, lat]);
            } else {
                markerRef.current = new vietmapGl.Marker({ color: 'red' })
                    .setLngLat([lng, lat])
                    .addTo(mapRef.current);
            }
        }
    }, [currentServicePoint]);


    const handleDropContract = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });
            if (file) {
                setValue('contract', newFile, { shouldValidate: true });
            }
        },
        [setValue]
    );

    const handleDropAvatar = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });
            if (file) {
                setValue('avatar', newFile, { shouldValidate: true });
            }
        },
        [setValue]
    );

    const handleRemoveContract = useCallback(() => {
        setValue('contract', null);
    }, [setValue]);

    const onSubmit = handleSubmit(
        async (data) => {
            setPendingData(data);
            confirm.onTrue();
        },
        (errors) => {
            console.error('Form Validation Errors:', errors);
            // Optional: enqueueSnackbar('Vui lòng kiểm tra lại thông tin', { variant: 'error' });
        }
    );

    const handleConfirmSubmit = async () => {
        if (!pendingData) return;

        setLoading(true);
        confirm.onFalse();
        const data = { ...pendingData };
        if (user?.role !== 'ADMIN') {
            delete (data as any).discount;
        }

        // console.log("Submitting:", data);

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

        setTimeout(() => {
            setLoading(false);
            alert(currentServicePoint ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
            navigate(paths.dashboard.admin.servicePoints.root);
        }, 1000);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
                <Grid container spacing={3}>
                    <Grid xs={12} md={12}>
                        <Card sx={{ p: 3, mb: 3 }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ mb: 1 }}>{currentServicePoint ? 'Chỉnh sửa thông tin công ty' : 'Thêm công ty mới'}</Typography>
                            </Box>

                            <Box sx={{ mb: 5 }}>
                                <RHFUploadAvatar
                                    name="avatar"
                                    maxSize={5242880}
                                    onDrop={handleDropAvatar}
                                    helperText={
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mt: 2,
                                                mx: 'auto',
                                                display: 'block',
                                                textAlign: 'center',
                                                color: 'text.secondary',
                                            }}
                                        >
                                            Cho phép *.jpeg, *.jpg, *.png, *.gif
                                            <br /> tối đa 5MB
                                        </Typography>
                                    }
                                />
                            </Box>

                            <Stack spacing={3}>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            label="Tên công ty / Cơ sở kinh doanh"
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
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                label="Số điện thoại"
                                                fullWidth
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                label="Email"
                                                fullWidth
                                                error={!!error}
                                                helperText={error?.message}
                                            />
                                        )}
                                    />
                                </Stack>

                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                    <Controller
                                        name="tax_id"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                label="Mã số thuế"
                                                fullWidth
                                                error={!!error}
                                                helperText={error?.message}
                                            />
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
                                </Stack>

                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                    <Controller
                                        name="rewardPoints"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                label="Hoa hồng (Goxu)"
                                                type="number"
                                                fullWidth
                                                disabled={isCustomer}
                                                error={!!error}
                                                helperText={error?.message}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">Goxu</InputAdornment>,
                                                }}
                                            />
                                        )}
                                    />
                                    {(user?.role === 'ADMIN' || user?.role === 'MONITOR') && (
                                        <>
                                            <Controller
                                                name="discount"
                                                control={control}
                                                render={({ field, fieldState: { error } }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Chiết khấu (%)"
                                                        type="number"
                                                        fullWidth
                                                        error={!!error}
                                                        helperText={error?.message}
                                                        InputProps={{
                                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                        }}
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="wallet_expiry_date"
                                                control={control}
                                                render={({ field, fieldState: { error } }) => (
                                                    <DatePicker
                                                        label="Hạn sử dụng ví"
                                                        value={field.value}
                                                        onChange={(newValue) => {
                                                            field.onChange(newValue);
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                error: !!error,
                                                                helperText: error?.message,
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </>
                                    )}
                                </Stack>

                                <Controller
                                    name="radius"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            label="Bán kính nhận diện (mét)"
                                            type="number"
                                            fullWidth
                                            error={!!error}
                                            sx={{ display: 'none' }}
                                            helperText={error?.message || "Khoảng cách tối đa để ghi nhận tài xế đến quán"}
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
                                                if (newValue && typeof newValue !== 'string') {
                                                    field.onChange(`${newValue.name}, ${newValue.address}`);

                                                    try {
                                                        const detail = await getPlaceDetail(newValue.ref_id);
                                                        if (detail) {
                                                            setValue('lat', detail.lat);
                                                            setValue('lng', detail.lng);

                                                            if (mapRef.current) {
                                                                mapRef.current.flyTo({
                                                                    center: [detail.lng, detail.lat],
                                                                    zoom: 16
                                                                });

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
                                    name="province"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField
                                            {...field}
                                            label="Tỉnh / Thành phố"
                                            select
                                            fullWidth
                                            error={!!error}
                                            helperText={error?.message}
                                            SelectProps={{ native: false }}
                                        >
                                            {_PROVINCES.map((option) => (
                                                <MenuItem key={option.code} value={option.name}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />

                                <Typography variant="h6" sx={{ mb: 1, mt: 3 }}>Thông tin ngân hàng</Typography>
                                <Stack spacing={2}>
                                    <Controller
                                        name="bank_name"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => {
                                            const selectedBank = bankOptions.find(
                                                (option: IBank) =>
                                                    option.shortName === field.value ||
                                                    `${option.shortName} - ${option.name}` === field.value || option.name === field.value
                                            );

                                            return (
                                                <Autocomplete
                                                    {...field}
                                                    options={bankOptions}
                                                    value={selectedBank || null}
                                                    getOptionLabel={(option: IBank | string) =>
                                                        typeof option === 'string' ? option : `${option.shortName} - ${option.name}`
                                                    }
                                                    isOptionEqualToValue={(option, value) => (option as IBank).id === (value as IBank).id}
                                                    onChange={(event, newValue) => {
                                                        const bank = newValue as IBank | null;
                                                        field.onChange(bank ? `${bank.shortName} - ${bank.name}` : '');
                                                    }}
                                                    renderOption={(props, option) => {
                                                        const bank = option as IBank;
                                                        return (
                                                            <li {...props} key={bank.id}>
                                                                <Box
                                                                    component="img"
                                                                    alt={bank.shortName}
                                                                    src={bank.logo}
                                                                    sx={{ width: 48, height: 48, flexShrink: 0, mr: 2, objectFit: 'contain' }}
                                                                />
                                                                {bank.shortName} - {bank.name}
                                                            </li>
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Tên ngân hàng"
                                                            placeholder='Chọn ngân hàng'
                                                            error={!!error}
                                                            helperText={error?.message}
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                startAdornment: (
                                                                    <>
                                                                        {selectedBank?.logo && (
                                                                            <Box
                                                                                component="img"
                                                                                alt="Bank Logo"
                                                                                src={selectedBank.logo}
                                                                                sx={{ width: 24, height: 24, mr: 1, objectFit: 'contain' }}
                                                                            />
                                                                        )}
                                                                        {params.InputProps.startAdornment}
                                                                    </>
                                                                ),
                                                            }}
                                                        />
                                                    )}
                                                />
                                            );
                                        }}
                                    />
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                        <Controller
                                            name="account_number"
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    label="Số tài khoản"
                                                    fullWidth
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="account_holder_name"
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    label="Chủ tài khoản"
                                                    fullWidth
                                                    error={!!error}
                                                    helperText={error?.message}
                                                />
                                            )}
                                        />
                                    </Stack>
                                </Stack>


                                {(user?.role === 'ADMIN' || user?.role === 'MONITOR') && (
                                    <>
                                        <Typography variant="h6" sx={{ mb: 1, mt: 3 }}>Hợp đồng</Typography>
                                        <RHFUpload
                                            name="contract"
                                            maxSize={20971520} // 20MB
                                            onDrop={handleDropContract}
                                            onDelete={handleRemoveContract}
                                            accept={{
                                                'application/pdf': [],
                                                'image/*': [],
                                                'application/msword': [],
                                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
                                            }}
                                            helperText={
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        mt: 2,
                                                        mx: 'auto',
                                                        display: 'block',
                                                        textAlign: 'center',
                                                        color: 'text.secondary',
                                                    }}
                                                >
                                                    Cho phép *.jpeg, *.jpg, *.png, *.pdf, *.doc, *.docx
                                                    <br /> tối đa 5MB
                                                </Typography>
                                            }
                                        />
                                    </>
                                )}
                            </Stack>
                            <Grid xs={12} md={12}>
                                {/* <Card sx={{ p: 0.5, height: 400, position: 'relative' }}>
                        <Typography variant="subtitle2" sx={{ position: 'absolute', top: 10, left: 10, zIndex: 9, bgcolor: 'common.white', px: 1, py: 0.5, borderRadius: 1, boxShadow: 1 }}>
                            Vị trí công ty
                        </Typography>

                        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
                    </Card> */}
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <LoadingButton type="submit" variant="contained" loading={loading} size="large">
                                        {currentServicePoint ? 'Lưu thay đổi' : 'Tạo mới'}
                                    </LoadingButton>
                                </Box>
                            </Grid>
                        </Card>
                    </Grid>

                </Grid>

                <ConfirmDialog
                    open={confirm.value}
                    onClose={confirm.onFalse}
                    title="Xác nhận"
                    content={
                        <>
                            Bạn có chắc chắn muốn {currentServicePoint ? 'lưu thay đổi' : 'tạo mới'} thông tin công ty này?
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
            </form >
        </FormProvider >
    );
}
