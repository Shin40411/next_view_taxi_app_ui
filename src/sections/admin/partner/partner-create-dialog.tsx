import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { parse, format } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import FormProvider, { RHFTextField, RHFUpload, RHFSelect, RHFRadioGroup, RHFUploadAvatar, RHFCheckbox } from 'src/components/hook-form';
import { _TAXIBRANDS } from 'src/_mock/_brands';

import { useAdmin } from 'src/hooks/api/use-admin';
import { useBoolean } from 'src/hooks/use-boolean';
import { useScanIdentityCard, IdentityCardData } from 'src/hooks/use-scan-identity-card';
import { useWallet } from 'src/hooks/api/use-wallet';
import { IBank } from 'src/types/wallet';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: VoidFunction;
    onUpdate?: VoidFunction;
};

export default function PartnerCreateDialog({ open, onClose, onUpdate }: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const { createUser } = useAdmin();
    const password = useBoolean();
    const { useGetBanks } = useWallet();
    const { banks: banksList } = useGetBanks();
    const { scanIdentityCard, scanIdentityCardBack, loading: scanning } = useScanIdentityCard();

    const bankOptions = banksList.map((bank: IBank) => bank);

    const PartnerSchema = Yup.object().shape({
        full_name: Yup.string().required('Họ tên là bắt buộc'),
        email: Yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
        username: Yup.string().required('Số điện thoại là bắt buộc'),
        password: Yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        role: Yup.string().required('Vai trò là bắt buộc'),
        id_card_num: Yup.string().required('Số CCCD là bắt buộc'),
        date_of_birth: Yup.date().nullable().required('Ngày sinh là bắt buộc'),
        sex: Yup.string().required('Giới tính là bắt buộc'),
        // Partner specific
        vehicle_plate: Yup.string().when('role', {
            is: 'PARTNER',
            then: (schema) => schema.required('Biển số xe là bắt buộc'),
            otherwise: (schema) => schema.notRequired(),
        }),
        brand: Yup.string().when('role', {
            is: 'PARTNER',
            then: (schema) => schema.required('Hãng taxi là bắt buộc'),
            otherwise: (schema) => schema.notRequired(),
        }),
        driver_license_front: Yup.mixed().when('role', {
            is: 'PARTNER',
            then: (schema) => schema.required('Ảnh mặt trước bằng lái là bắt buộc'),
            otherwise: (schema) => schema.notRequired(),
        }),
        driver_license_back: Yup.mixed().when('role', {
            is: 'PARTNER',
            then: (schema) => schema.required('Ảnh mặt sau bằng lái là bắt buộc'),
            otherwise: (schema) => schema.notRequired(),
        }),
        // Common uploads
        avatar: Yup.mixed().nullable(),
        id_card_front: Yup.mixed().required('Ảnh mặt trước CCCD là bắt buộc'),
        id_card_back: Yup.mixed().required('Ảnh mặt sau CCCD là bắt buộc'),

        // Bank info
        bank_name: Yup.string(),
        account_number: Yup.string(),
        account_holder_name: Yup.string(),
    });

    const defaultValues = {
        full_name: '',
        email: '',
        username: '',
        password: '',
        role: 'PARTNER',
        id_card_num: '',
        date_of_birth: null as Date | null,
        sex: 'Nam',
        vehicle_plate: '',
        brand: '',
        avatar: null,
        id_card_front: null,
        id_card_back: null,
        driver_license_front: null,
        driver_license_back: null,
        bank_name: '',
        account_number: '',
        account_holder_name: '',
    };

    const methods = useForm({
        resolver: yupResolver(PartnerSchema) as any,
        defaultValues,
    });

    const {
        reset,
        watch,
        setValue,
        setError,
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = methods;

    const role = watch('role');

    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = { ...data };
            if (formData.date_of_birth && (formData.date_of_birth as any) instanceof Date) {
                (formData as any).date_of_birth = format((formData.date_of_birth as any), 'dd/MM/yyyy');
            }
            await createUser(formData as any);
            enqueueSnackbar('Tạo đối tác thành công!', { variant: 'success' });
            reset();
            onUpdate?.();
            onClose();
        } catch (error: any) {
            console.error(error);
            enqueueSnackbar(error?.message || 'Có lỗi xảy ra, vui lòng thử lại', { variant: 'error' });
        }
    });

    const handleDrop = async (acceptedFiles: File[], fieldName: any) => {
        const file = acceptedFiles[0];
        const newFile = Object.assign(file, {
            preview: URL.createObjectURL(file),
            ocrResult: null,
        });
        if (file) {
            setValue(fieldName, newFile, { shouldValidate: true });
        }
    };

    const handleScan = async () => {
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
    };

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} >
            <DialogTitle>Thêm đối tác mới</DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid xs={12} md={12}>
                            <RHFRadioGroup
                                row
                                name="role"
                                label="Loại tài khoản"
                                options={[
                                    { label: 'Tài xế', value: 'PARTNER' },
                                    { label: 'Cộng tác viên', value: 'INTRODUCER' },
                                ]}
                            />
                        </Grid>

                        <Grid xs={12} md={12} display="flex" justifyContent="center">
                            <RHFUploadAvatar
                                name="avatar"
                                maxSize={5242880}
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
                                        <br /> tối đa 5MB
                                    </Typography>
                                }
                            />
                        </Grid>

                        <Grid xs={12} md={6}>
                            <RHFTextField name="full_name" label="Họ tên" />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <RHFTextField name="email" label="Email" />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <RHFTextField name="username" label="Số điện thoại" />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <RHFTextField
                                name="password"
                                label="Mật khẩu"
                                type={password.value ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={password.onToggle} edge="end">
                                                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid xs={12} md={12}>
                            <RHFTextField name="id_card_num" label="Số CCCD" />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <Controller
                                name="date_of_birth"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Ngày sinh"
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
                            <RHFSelect name="sex" label="Giới tính">
                                <MenuItem value="Nam">Nam</MenuItem>
                                <MenuItem value="Nữ">Nữ</MenuItem>
                            </RHFSelect>
                        </Grid>

                        {role === 'PARTNER' && (
                            <Grid xs={12} md={6}>
                                <RHFTextField name="vehicle_plate" label="Biển số xe" />
                            </Grid>
                        )}

                        {role === 'PARTNER' && (
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
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                    <RHFTextField name="account_number" label="Số tài khoản" />
                                    <RHFTextField name="account_holder_name" label="Tên chủ tài khoản" />
                                </Stack>
                            </Stack>
                        </Grid>

                        <Grid xs={12} md={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                                CCCD / Giấy tờ tùy thân (Mặt trước - Mặt sau)
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <RHFUpload
                                    name="id_card_front"
                                    maxSize={5242880}
                                    onDrop={(files) => handleDrop(files, 'id_card_front')}
                                    onDelete={() => setValue('id_card_front', null, { shouldValidate: true })}
                                />
                                <RHFUpload
                                    name="id_card_back"
                                    maxSize={5242880}
                                    onDrop={(files) => handleDrop(files, 'id_card_back')}
                                    onDelete={() => setValue('id_card_back', null, { shouldValidate: true })}
                                />
                            </Stack>
                        </Grid>
                        {(role === 'PARTNER' || role === 'INTRODUCER') && (
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
                        )}
                        {role === 'PARTNER' && (
                            <Grid xs={12} md={12}>
                                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                                    Giấy phép lái xe (Mặt trước - Mặt sau)
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <RHFUpload
                                        name="driver_license_front"
                                        maxSize={5242880}
                                        onDrop={(files) => handleDrop(files, 'driver_license_front')}
                                        onDelete={() => setValue('driver_license_front', null, { shouldValidate: true })}
                                    />
                                    <RHFUpload
                                        name="driver_license_back"
                                        maxSize={5242880}
                                        onDrop={(files) => handleDrop(files, 'driver_license_back')}
                                        onDelete={() => setValue('driver_license_back', null, { shouldValidate: true })}
                                    />
                                </Stack>
                            </Grid>
                        )}
                    </Grid>
                </FormProvider>
            </DialogContent >

            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Hủy bỏ
                </Button>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting} onClick={onSubmit}>
                    Tạo mới
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
