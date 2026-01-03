'use client';

import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { useAuthApi } from 'src/hooks/api/use-auth-api';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

export default function PasswordChange() {
    const router = useRouter();
    const { logout } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const { changePassword } = useAuthApi();

    const password = useBoolean();
    const confirmPassword = useBoolean();

    const ChangePasswordSchema = Yup.object().shape({
        oldPassword: Yup.string()
            .required('Mật khẩu cũ là bắt buộc'),
        newPassword: Yup.string()
            .required('Mật khẩu mới là bắt buộc')
            .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
            .test(
                'no-match',
                'Mật khẩu mới không được trùng với mật khẩu cũ',
                (value, { parent }) => value !== parent.oldPassword
            ),
        confirmNewPassword: Yup.string().required('Mật khẩu xác nhận là bắt buộc')
            .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp'),
    });

    const defaultValues = {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    };

    const methods = useForm({
        resolver: yupResolver(ChangePasswordSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await changePassword(data.oldPassword, data.newPassword);
            reset();
            enqueueSnackbar('Đổi mật khẩu thành công!', { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    });

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/');
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Unable to logout!', { variant: 'error' });
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid xs={12} md={12}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Đổi mật khẩu
                </Typography>

                <FormProvider methods={methods} onSubmit={onSubmit}>
                    <Stack spacing={3} alignItems="flex-end">
                        <RHFTextField
                            name="oldPassword"
                            type={password.value ? 'text' : 'password'}
                            label="Mật khẩu hiện tại"
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

                        <RHFTextField
                            name="newPassword"
                            type={password.value ? 'text' : 'password'}
                            label="Mật khẩu mới"
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

                        <RHFTextField
                            name="confirmNewPassword"
                            type={confirmPassword.value ? 'text' : 'password'}
                            label="Xác nhận mật khẩu mới"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={confirmPassword.onToggle} edge="end">
                                            <Iconify icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Lưu thay đổi
                        </LoadingButton>
                    </Stack>
                </FormProvider>
            </Grid>

            <Grid xs={12} md={12}>
                <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
                <Button fullWidth variant="soft" color="error" size="large" onClick={handleLogout}>
                    Đăng xuất
                </Button>
            </Grid>
        </Grid>
    );
}
