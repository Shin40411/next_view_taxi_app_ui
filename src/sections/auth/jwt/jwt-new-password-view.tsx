import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Hook API
import { useAuthApi } from 'src/hooks/api/use-auth-api';

// MUI
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

// Components
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function JwtNewPasswordView() {
    const navigate = useNavigate();
    const location = useLocation();

    // 👇 Lấy dữ liệu quan trọng từ trang OTP chuyển sang
    const phoneNumber = location.state?.phoneNumber;
    const resetToken = location.state?.resetToken;

    const password = useBoolean();
    const confirmPassword = useBoolean();
    const { resetPassword, loading } = useAuthApi();

    const NewPasswordSchema = Yup.object().shape({
        newPassword: Yup.string()
            .required('Vui lòng nhập mật khẩu mới')
            .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        confirmPassword: Yup.string()
            .required('Vui lòng xác nhận mật khẩu')
            .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp'),
    });

    const methods = useForm({
        resolver: yupResolver(NewPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    const {
        handleSubmit,
        setError,
        formState: { isSubmitting },
    } = methods;

    // Nếu không có Token (truy cập lậu), đá về trang login
    useEffect(() => {
        if (!resetToken || !phoneNumber) {
            navigate(paths.auth.jwt.login);
        }
    }, [resetToken, phoneNumber, navigate]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            // Gọi API Reset Password
            await resetPassword({
                phoneNumber: phoneNumber,
                resetToken: resetToken, // Token chứng minh đã xác thực OTP
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            });

            console.info('Đổi mật khẩu thành công!');

            // Chuyển về trang Login để đăng nhập lại
            navigate(paths.auth.jwt.login);
            enqueueSnackbar('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.', {
                variant: 'success',
            });

        } catch (error: any) {
            console.error(error);
            setError('root', {
                type: 'manual',
                message: error.message || 'Không thể đổi mật khẩu, vui lòng thử lại.',
            });
        }
    });

    return (
        <Stack sx={{ px: 2, py: 5, mx: 'auto', maxWidth: 480 }}>
            <Stack alignItems="center" sx={{ mb: 5 }}>
                <Iconify icon="solar:lock-password-broken" width={64} sx={{ color: 'primary.main', mb: 2 }} />
                <Typography variant="h4">Đặt lại mật khẩu</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, textAlign: 'center' }}>
                    Vui lòng nhập mật khẩu mới cho tài khoản <br /> <strong>{phoneNumber}</strong>
                </Typography>
            </Stack>

            {!!methods.formState.errors.root && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {methods.formState.errors.root.message}
                </Alert>
            )}

            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Stack spacing={3}>
                    <RHFTextField
                        name="newPassword"
                        label="Mật khẩu mới"
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

                    <RHFTextField
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        type={confirmPassword.value ? 'text' : 'password'}
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

                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting || loading}
                        sx={{ bgcolor: '#ddd', color: 'black' }}
                    >
                        Cập nhật mật khẩu
                    </LoadingButton>

                    <Link
                        component={RouterLink as any}
                        to={paths.auth.jwt.login}
                        color="inherit"
                        variant="subtitle2"
                        sx={{
                            alignItems: 'center',
                            display: 'inline-flex',
                            mx: 'auto',
                            mt: 3,
                        }}
                    >
                        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
                        Quay lại đăng nhập
                    </Link>
                </Stack>
            </FormProvider>
        </Stack>
    );
}