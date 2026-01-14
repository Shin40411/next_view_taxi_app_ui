import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback, useRef } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { parse, format } from 'date-fns';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import MenuItem from '@mui/material/MenuItem';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUpload, RHFSelect, RHFCheckbox, RHFUploadAvatar } from 'src/components/hook-form';
import { _TAXIBRANDS } from 'src/_mock/_brands';

import { useWallet } from 'src/hooks/api/use-wallet';
import { IBank } from 'src/types/wallet';

import { useBoolean } from 'src/hooks/use-boolean';
import { useScanIdentityCard, IdentityCardData } from 'src/hooks/use-scan-identity-card';
import { useAdmin } from 'src/hooks/api/use-admin';
import { IUserAdmin } from 'src/types/user';
import { ASSETS_API } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: VoidFunction;
    currentUser?: IUserAdmin;
    onUpdate?: VoidFunction;
};

const getPreviewUrl = (file: string | File | null) => {
    if (!file) return '';
    if (typeof file === 'string') {
        const normalizedPath = file.replace(/\\/g, '/');
        return file.startsWith('http') ? file : `${ASSETS_API}/${normalizedPath}`;
    }
    if ((file as any).preview) return (file as any).preview;
    return '';
};

export default function ProfileUpdateDialog({ open, onClose, currentUser, onUpdate }: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const { useGetBanks } = useWallet();
    const { banks: banksList } = useGetBanks();

    const bankOptions = banksList.map((bank: IBank) => bank);

    const { updateUser } = useAdmin();
    const { scanIdentityCard, scanIdentityCardBack, loading: scanning } = useScanIdentityCard();

    const UpdateUserSchema = Yup.object().shape({
        full_name: Yup.string().required('Họ tên là bắt buộc').max(100, 'Họ tên tối đa 100 ký tự'),
        email: Yup.string().email('Email không hợp lệ').nullable().max(255, 'Email tối đa 255 ký tự'),
        phone_number: Yup.string().required('Số điện thoại là bắt buộc').max(15, 'Số điện thoại tối đa 15 ký tự'),
        avatar: Yup.mixed<any>().nullable(),
        role: Yup.string(),
        vehicle_plate: Yup.string().when('role', {
            is: 'PARTNER',
            then: (schema) => schema.required('Biển số xe là bắt buộc').max(20, 'Biển số xe tối đa 20 ký tự'),
        }),
        brand: Yup.string().when('role', {
            is: 'PARTNER',
            then: (schema) => schema.required('Hãng taxi là bắt buộc').max(50, 'Hãng taxi tối đa 50 ký tự'),
        }),
        id_card_front: Yup.mixed<any>().when('role', {
            is: (role: string) => ['PARTNER', 'INTRODUCER'].includes(role),
            then: (schema) =>
                schema
                    .nullable()
                    .test('required', 'Vui lòng tải lên mặt trước CCCD', (value) => !!value)
                    .test('fileFormat', 'Chỉ chấp nhận file định dạng .jpeg, .jpg, .png, .gif, .webp', (value) => {
                        if (!value) return true;
                        if (typeof value === 'string') return true;
                        return ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp'].includes(value.type);
                    }),
            otherwise: (schema) => schema.nullable(),
        }),
        id_card_back: Yup.mixed<any>().when('role', {
            is: (role: string) => ['PARTNER', 'INTRODUCER'].includes(role),
            then: (schema) =>
                schema
                    .nullable()
                    .test('required', 'Vui lòng tải lên mặt sau CCCD', (value) => !!value)
                    .test('fileFormat', 'Chỉ chấp nhận file định dạng .jpeg, .jpg, .png, .gif, .webp', (value) => {
                        if (!value) return true;
                        if (typeof value === 'string') return true;
                        return ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp'].includes(value.type);
                    }),
            otherwise: (schema) => schema.nullable(),
        }),
        driver_license_front: Yup.mixed<any>().when('role', {
            is: 'PARTNER',
            then: (schema) =>
                schema
                    .nullable()
                    .test('required', 'Vui lòng tải lên mặt trước bằng lái', (value) => !!value),
            otherwise: (schema) => schema.nullable(),
        }),
        driver_license_back: Yup.mixed<any>().when('role', {
            is: 'PARTNER',
            then: (schema) =>
                schema
                    .nullable()
                    .test('required', 'Vui lòng tải lên mặt sau bằng lái', (value) => !!value),
            otherwise: (schema) => schema.nullable(),
        }),
        bank_name: Yup.string().when('role', {
            is: (role: string) => ['PARTNER', 'INTRODUCER'].includes(role),
            then: (schema) => schema.required('Tên ngân hàng là bắt buộc').max(100, 'Tên ngân hàng tối đa 100 ký tự'),
        }),
        account_number: Yup.string().when('role', {
            is: (role: string) => ['PARTNER', 'INTRODUCER'].includes(role),
            then: (schema) => schema.required('Số tài khoản là bắt buộc').max(50, 'Số tài khoản tối đa 50 ký tự'),
        }),
        account_holder_name: Yup.string().when('role', {
            is: (role: string) => ['PARTNER', 'INTRODUCER'].includes(role),
            then: (schema) => schema.required('Tên chủ tài khoản là bắt buộc').max(100, 'Tên chủ tài khoản tối đa 100 ký tự'),
        }),
        id_card_num: Yup.string().when('role', {
            is: (role: string) => ['PARTNER', 'INTRODUCER'].includes(role),
            then: (schema) => schema
                .required('Số CCCD là bắt buộc')
                .matches(/^\d{12}$/, 'Số CCCD phải bao gồm 12 chữ số'),
        }),
        date_of_birth: Yup.date().nullable().when('role', {
            is: (role: string) => ['PARTNER', 'INTRODUCER'].includes(role),
            then: (schema) => schema.required('Ngày sinh là bắt buộc'),
        }),
        sex: Yup.string().when('role', {
            is: (role: string) => ['PARTNER', 'INTRODUCER'].includes(role),
            then: (schema) => schema.required('Giới tính là bắt buộc'),
        }),
    });

    const defaultValues = useMemo(
        () => ({
            full_name: currentUser?.full_name || '',
            email: currentUser?.email || '',
            phone_number: currentUser?.phone_number || '',
            avatar: getPreviewUrl(currentUser?.avatarUrl || (currentUser as any).avatar || null) || null,
            role: currentUser?.role || '',
            vehicle_plate: currentUser?.partnerProfile?.vehicle_plate || '',
            brand: currentUser?.partnerProfile?.brand || '',
            id_card_front: getPreviewUrl(currentUser?.partnerProfile?.id_card_front ?? null) || null,
            id_card_back: getPreviewUrl(currentUser?.partnerProfile?.id_card_back ?? null) || null,
            driver_license_front: getPreviewUrl(currentUser?.partnerProfile?.driver_license_front ?? null) || null,
            driver_license_back: getPreviewUrl(currentUser?.partnerProfile?.driver_license_back ?? null) || null,
            bank_name: currentUser?.bankAccount?.bank_name || '',
            account_number: currentUser?.bankAccount?.account_number || '',

            account_holder_name: currentUser?.bankAccount?.account_holder_name || '',
            id_card_num: currentUser?.partnerProfile?.id_card_num || '',
            date_of_birth: currentUser?.partnerProfile?.date_of_birth ? parse(currentUser?.partnerProfile?.date_of_birth, 'dd/MM/yyyy', new Date()) : null,
            sex: currentUser?.partnerProfile?.sex || '',
        }),
        [currentUser]
    );

    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues,
    });

    const {
        reset,
        control,
        handleSubmit,
        setValue,
        setError,
        formState: { isSubmitting },
    } = methods;

    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!open) {
            hasInitialized.current = false;
        }
    }, [open]);

    useEffect(() => {
        if (open && currentUser && !hasInitialized.current) {
            reset(defaultValues);
            hasInitialized.current = true;
        }
    }, [open, currentUser, defaultValues, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = { ...data };

            if (formData.date_of_birth && formData.date_of_birth instanceof Date) {
                (formData as any).date_of_birth = format(formData.date_of_birth, 'dd/MM/yyyy');
            }

            if (typeof data.id_card_front === 'string') delete formData.id_card_front;
            if (typeof data.id_card_back === 'string') delete formData.id_card_back;
            if (typeof data.driver_license_front === 'string') delete formData.driver_license_front;
            if (typeof data.driver_license_back === 'string') delete formData.driver_license_back;
            if (typeof data.avatar === 'string') delete formData.avatar;

            const idCardFile = data.id_card_front;
            let ocrData = {};
            if (idCardFile && (idCardFile as any).ocrResult) {
                const result = (idCardFile as any).ocrResult;
                ocrData = {
                };
            }

            await updateUser(currentUser?.id as string, {
                ...formData,
                ...ocrData,
            } as any);

            enqueueSnackbar('Cập nhật hồ sơ thành công!');
            onUpdate?.();
            onClose();
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại', { variant: 'error' });
        }
    });

    const handleDrop = useCallback(
        async (acceptedFiles: File[], fieldName: any) => {
            const file = acceptedFiles[0];

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
                ocrResult: null,
            });

            if (file) {
                setValue(fieldName, newFile, { shouldValidate: true });
            }
        },
        [setValue]
    );

    const handleScan = useCallback(async () => {
        const fileFront = methods.getValues('id_card_front');
        const fileBack = methods.getValues('id_card_back');

        if (!fileFront && !fileBack) {
            enqueueSnackbar('Vui lòng tải lên ảnh CCCD để quét', { variant: 'warning' });
            return;
        }

        try {
            enqueueSnackbar('Đang quét thông tin...', { variant: 'info' });

            const [frontResult, backResult] = await Promise.all([
                fileFront ? scanIdentityCard(fileFront as File) : Promise.resolve(null),
                fileBack ? scanIdentityCardBack(fileBack as File) : Promise.resolve(null),
            ]);

            // Handle Front Scan
            if (fileFront) {
                if (!frontResult) {
                    setError('id_card_front', {
                        type: 'manual',
                        message: 'Không thể quét thông tin từ ảnh. Vui lòng thử lại hoặc tải ảnh rõ nét hơn.'
                    });
                    enqueueSnackbar('Không thể quét thông tin mặt trước từ ảnh', { variant: 'error' });
                } else {
                    const missingFields = [];
                    if (!frontResult.id) missingFields.push('Số CCCD');
                    if (!frontResult.fullName) missingFields.push('Họ tên');
                    if (!frontResult.dob) missingFields.push('Ngày sinh');

                    const isEnoughData = frontResult.id && frontResult.fullName && frontResult.dob;

                    if (!isEnoughData) {
                        const errorMsg = 'Vui lòng tải lên ảnh căn cước công dân hợp lệ (Không tìm thấy đủ thông tin: ' + missingFields.join(', ') + ')';
                        setError('id_card_front', {
                            type: 'manual',
                            message: errorMsg
                        });
                        enqueueSnackbar(errorMsg, { variant: 'warning' });
                    } else {
                        if (frontResult.fullName) {
                            setValue('full_name', frontResult.fullName, { shouldValidate: true });
                            if (frontResult.id) setValue('id_card_num', frontResult.id, { shouldValidate: true });

                            if (frontResult.dob) {
                                try {
                                    const parsedDate = parse(frontResult.dob, 'dd/MM/yyyy', new Date());
                                    if (!isNaN(parsedDate.getTime())) {
                                        setValue('date_of_birth', parsedDate, { shouldValidate: true });
                                    }
                                } catch (e) {
                                    console.error('Invalid date format from OCR:', frontResult.dob);
                                }
                            }
                            if (frontResult.sex) setValue('sex', frontResult.sex, { shouldValidate: true });
                        }

                        const newFile = Object.assign(fileFront, { ocrResult: frontResult });
                        setValue('id_card_front', newFile, { shouldValidate: true });
                    }
                }
            }

            // Handle Back Scan
            if (fileBack && backResult !== null) {
                if (!backResult) {
                    setError('id_card_back', {
                        type: 'manual',
                        message: 'Ảnh mặt sau không hợp lệ'
                    });
                    enqueueSnackbar('Ảnh mặt sau không hợp lệ', { variant: 'error' });
                } else {
                    const newFileBack = Object.assign(fileBack, { ocrResult: { valid: true } });
                    setValue('id_card_back', newFileBack, { shouldValidate: true });
                    enqueueSnackbar('Mặt sau hợp lệ', { variant: 'success' });
                }
            }

            if ((fileFront && frontResult) && (fileBack && backResult)) {
                enqueueSnackbar('Quét thành công 2 mặt', { variant: 'success' });
            } else if (fileFront && frontResult && !fileBack) {
                enqueueSnackbar('Quét mặt trước thành công', { variant: 'success' });
            }

        } catch (err) {
            enqueueSnackbar('Lỗi khi quét ảnh CCCD', { variant: 'error' });
        }
    }, [methods, scanIdentityCard, scanIdentityCardBack, setValue, setError, enqueueSnackbar]);

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <DialogTitle>Cập nhật hồ sơ</DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid xs={12} md={12} display="flex" justifyContent="center">
                            <RHFUploadAvatar
                                name="avatar"
                                maxSize={3145728}
                                onDrop={(files) => handleDrop(files, 'avatar')}
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
                                        <br /> tối đa 3MB
                                    </Typography>
                                }
                            />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <RHFTextField name="full_name" label="Họ tên" />
                            <RHFTextField name="role" sx={{ display: 'none' }} />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <RHFTextField name="email" label="Email" />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <RHFTextField name="phone_number" label="Số điện thoại" />
                        </Grid>

                        {(currentUser?.role === 'PARTNER' || currentUser?.role === 'INTRODUCER') && (
                            <>
                                <Grid xs={12} md={12}>
                                    <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                                        Số CCCD
                                    </Typography>
                                    <RHFTextField name="id_card_num" label="Số căn cước công dân" />
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                                        Ngày sinh
                                    </Typography>
                                    <Controller
                                        name="date_of_birth"
                                        control={control}
                                        render={({ field, fieldState: { error } }) => (
                                            <DatePicker
                                                label="Ngày sinh trên căn cước"
                                                format="dd/MM/yyyy"
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        error: !!error,
                                                        helperText: error?.message,
                                                    },
                                                }}
                                                {...field}
                                                value={field.value || null}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                                        Giới tính
                                    </Typography>
                                    <RHFSelect name="sex" label="Giới tính trên căn cước">
                                        <MenuItem value="Nam">Nam</MenuItem>
                                        <MenuItem value="Nữ">Nữ</MenuItem>
                                    </RHFSelect>
                                </Grid>
                            </>
                        )}

                        {currentUser?.role === 'PARTNER' && (
                            <>
                                <Grid xs={12} md={6}>
                                    <RHFTextField name="vehicle_plate" label="Biển số xe" />
                                </Grid>
                            </>
                        )}

                        <Grid xs={12} md={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Thông tin ngân hàng</Typography>
                            <Stack spacing={2}>
                                <Controller
                                    name="bank_name"
                                    control={methods.control}
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
                                <Grid container spacing={2}>
                                    <Grid xs={12} md={6}>
                                        <RHFTextField name="account_number" label="Số tài khoản" />
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <RHFTextField
                                            name="account_holder_name"
                                            label="Tên chủ tài khoản"
                                            InputProps={{
                                                inputProps: {
                                                    style: { textTransform: 'uppercase' }
                                                }
                                            }}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.toUpperCase();
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Grid>

                        {currentUser?.role === 'PARTNER' && (
                            <Grid xs={12} md={6}>
                                <RHFSelect name="brand" label="Hãng taxi">
                                    {_TAXIBRANDS.map((brand) => (
                                        <MenuItem key={brand.code} value={brand.code}>
                                            {brand.name}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                            </Grid>
                        )}

                        <Grid xs={12} md={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                                CCCD / Giấy tờ tùy thân (Mặt trước - Mặt sau)
                            </Typography>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <RHFUpload
                                    name="id_card_front"
                                    maxSize={3145728}
                                    onDrop={(files) => handleDrop(files, 'id_card_front')}
                                    onDelete={() => setValue('id_card_front', null, { shouldValidate: true })}
                                />
                                <RHFUpload
                                    name="id_card_back"
                                    maxSize={3145728}
                                    onDrop={(files) => handleDrop(files, 'id_card_back')}
                                    onDelete={() => setValue('id_card_back', null, { shouldValidate: true })}
                                />
                            </Stack>
                        </Grid>
                        {/* {(currentUser?.role === 'PARTNER' || currentUser?.role === 'INTRODUCER') && (
                            <Grid xs={12} md={12} my={2} display="flex" justifyContent="center">
                                <LoadingButton
                                    variant="outlined"
                                    onClick={handleScan}
                                    sx={{ mt: -2, mb: 2 }}
                                    startIcon={<Iconify icon="eva:camera-fill" />}
                                >
                                    Quét thông tin
                                </LoadingButton>
                            </Grid>
                        )} */}

                        {currentUser?.role === 'PARTNER' && (
                            <Grid xs={12} md={12}>
                                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                                    Giấy phép lái xe (Mặt trước - Mặt sau)
                                </Typography>
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                    <RHFUpload
                                        name="driver_license_front"
                                        maxSize={3145728}
                                        onDrop={(files) => handleDrop(files, 'driver_license_front')}
                                        onDelete={() => setValue('driver_license_front', null, { shouldValidate: true })}
                                    />
                                    <RHFUpload
                                        name="driver_license_back"
                                        maxSize={3145728}
                                        onDrop={(files) => handleDrop(files, 'driver_license_back')}
                                        onDelete={() => setValue('driver_license_back', null, { shouldValidate: true })}
                                    />
                                </Stack>
                            </Grid>
                        )}
                    </Grid>
                </FormProvider>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Hủy bỏ
                </Button>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting} onClick={onSubmit}>
                    Cập nhật
                </LoadingButton>
            </DialogActions>

            <Backdrop
                sx={{
                    zIndex: (theme) => theme.zIndex.modal + 1,
                    color: '#fff',
                    flexDirection: 'column',
                    gap: 2,
                }}
                open={scanning}
            >
                <CircularProgress color="inherit" />
                <Typography variant="h6">Đang quét thông tin CCCD...</Typography>
            </Backdrop>
        </Dialog >
    );
}
