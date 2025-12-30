import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
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

import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFUpload, RHFSelect, RHFRadioGroup } from 'src/components/hook-form';
import { _TAXIBRANDS } from 'src/_mock/_brands';

import { useAdmin } from 'src/hooks/api/use-admin';
import { useBoolean } from 'src/hooks/use-boolean';

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

    const NewUserSchema = Yup.object().shape({
        full_name: Yup.string().required('Họ tên là bắt buộc'),
        username: Yup.string().required('Số điện thoại là bắt buộc'),
        password: Yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu ít nhất 6 ký tự'),

        id_card_front: Yup.mixed<any>().required('Vui lòng tải lên mặt trước CCCD'),
        id_card_back: Yup.mixed<any>().required('Vui lòng tải lên mặt sau CCCD'),

        role: Yup.string(),

        vehicle_plate: Yup.string().when('role', (role, schema) => {
            return role[0] === 'PARTNER' ? schema.required('Biển số là bắt buộc') : schema.nullable();
        }),
        brand: Yup.string().when('role', (role, schema) => {
            return role[0] === 'PARTNER' ? schema.required('Hãng taxi là bắt buộc') : schema.nullable();
        }),
        driver_license_front: Yup.mixed<any>().when('role', (role, schema) => {
            return role[0] === 'PARTNER' ? schema.nullable() : schema.nullable(); // Initially optional for Partner too based on previous code, but typically required. Keeping logic similar to current state but prepared for strictness if needed.
        }),
        driver_license_back: Yup.mixed<any>().nullable(),
    });

    const defaultValues = {
        full_name: '',
        username: '',
        password: '',
        vehicle_plate: '',
        id_card_front: null,
        id_card_back: null,
        driver_license_front: null,
        driver_license_back: null,
        brand: '',
        role: 'PARTNER',
    };

    const methods = useForm({
        resolver: yupResolver(NewUserSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const role = watch('role');

    const onSubmit = handleSubmit(async (data) => {
        try {
            await createUser({ ...data, role: data.role } as any);
            enqueueSnackbar('Tạo đối tác thành công!', { variant: 'success' });
            reset();
            onUpdate?.();
            onClose();
        } catch (error: any) {
            console.error(error);
            enqueueSnackbar(error?.message || 'Có lỗi xảy ra, vui lòng thử lại', { variant: 'error' });
        }
    });

    const handleDrop = (acceptedFiles: File[], fieldName: any) => {
        const file = acceptedFiles[0];
        const newFile = Object.assign(file, {
            preview: URL.createObjectURL(file),
        });
        if (file) {
            setValue(fieldName, newFile, { shouldValidate: true });
        }
    };

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
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
                        <Grid xs={12} md={6}>
                            <RHFTextField name="full_name" label="Họ tên" />
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
                            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                                CCCD / Giấy tờ tùy thân (Mặt trước - Mặt sau)
                            </Typography>
                            <Stack direction="row" spacing={2}>
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
                        {role === 'PARTNER' && (
                            <Grid xs={12} md={12}>
                                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                                    Giấy phép lái xe (Mặt trước - Mặt sau)
                                </Typography>
                                <Stack direction="row" spacing={2}>
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
                    Tạo mới
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
