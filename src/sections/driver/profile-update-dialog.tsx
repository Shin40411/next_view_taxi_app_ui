import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

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

import MenuItem from '@mui/material/MenuItem';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUpload, RHFSelect, RHFCheckbox } from 'src/components/hook-form';
import { _TAXIBRANDS } from 'src/_mock/_brands';

import { useAdmin } from 'src/hooks/api/use-admin';
import { IUserAdmin } from 'src/types/user';
import { ASSETS_API } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';

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
    const { updateUser } = useAdmin();
    const { user: loggedInUser } = useAuthContext();

    const UpdateUserSchema = Yup.object().shape({
        full_name: Yup.string().required('Họ tên là bắt buộc'),
        vehicle_plate: Yup.string(),
        brand: Yup.string(),
        id_card_front: Yup.mixed<any>().nullable(),
        id_card_back: Yup.mixed<any>().nullable(),
        driver_license_front: Yup.mixed<any>().nullable(),
        driver_license_back: Yup.mixed<any>().nullable(),
        bank_name: Yup.string(),
        account_number: Yup.string(),
        account_holder_name: Yup.string(),
    });

    const defaultValues = useMemo(
        () => ({
            full_name: currentUser?.full_name || '',
            vehicle_plate: currentUser?.partnerProfile?.vehicle_plate || '',
            brand: currentUser?.partnerProfile?.brand || '',
            id_card_front: getPreviewUrl(currentUser?.partnerProfile?.id_card_front ?? null) || null,
            id_card_back: getPreviewUrl(currentUser?.partnerProfile?.id_card_back ?? null) || null,
            driver_license_front: getPreviewUrl(currentUser?.partnerProfile?.driver_license_front ?? null) || null,
            driver_license_back: getPreviewUrl(currentUser?.partnerProfile?.driver_license_back ?? null) || null,
            bank_name: currentUser?.bankAccount?.bank_name || '',
            account_number: currentUser?.bankAccount?.account_number || '',
            account_holder_name: currentUser?.bankAccount?.account_holder_name || '',
        }),
        [currentUser]
    );

    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (currentUser) {
            reset(defaultValues);
        }
    }, [currentUser, defaultValues, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = { ...data };

            // Handle file objects vs url strings
            // If it's a string (existing URL), exclude it from upload payload
            // If it's a File/Blob (new upload), keep it

            if (typeof data.id_card_front === 'string') delete formData.id_card_front;
            if (typeof data.id_card_back === 'string') delete formData.id_card_back;
            if (typeof data.driver_license_front === 'string') delete formData.driver_license_front;
            if (typeof data.driver_license_back === 'string') delete formData.driver_license_back;

            await updateUser(currentUser?.id as string, formData);

            enqueueSnackbar('Cập nhật hồ sơ thành công!');
            onUpdate?.();
            onClose();
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại', { variant: 'error' });
        }
    });

    const handleDrop = useCallback(
        (acceptedFiles: File[], fieldName: any) => {
            const file = acceptedFiles[0];

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            if (file) {
                setValue(fieldName, newFile, { shouldValidate: true });
            }
        },
        [setValue]
    );



    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <DialogTitle>Cập nhật hồ sơ</DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid xs={12} md={6}>
                            <RHFTextField name="full_name" label="Họ tên" />
                        </Grid>
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
                                <RHFTextField name="bank_name" label="Tên ngân hàng" />
                                <Grid container spacing={2}>
                                    <Grid xs={12} md={6}>
                                        <RHFTextField name="account_number" label="Số tài khoản" />
                                    </Grid>
                                    <Grid xs={12} md={6}>
                                        <RHFTextField name="account_holder_name" label="Tên chủ tài khoản" />
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

                        {currentUser?.role === 'PARTNER' && (
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
                    Cập nhật
                </LoadingButton>
            </DialogActions>
        </Dialog >
    );
}
