import * as Yup from 'yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

// 👇 Import Hook API
import { useAuthApi } from 'src/hooks/api/use-auth-api';

// MUI
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

// Components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFCodes } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function VerifyCodeView() {
    const navigate = useNavigate();
    const location = useLocation();

    // 👇 Lấy số điện thoại được truyền từ trang Forgot Password
    const phoneNumber = location.state?.phoneNumber;

    // 👇 Gọi API ra dùng
    const { verifyOtp, forgotPassword, loading } = useAuthApi();

    const VerifySchema = Yup.object().shape({
        code: Yup.string()
            .required('Vui lòng nhập mã xác thực')
            .min(6, 'Mã xác thực phải có 6 số'),
    });

    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(VerifySchema),
        defaultValues: {
            code: '',
        },
    });

    const {
        handleSubmit,
        setError,
        formState: { isSubmitting },
    } = methods;

    // Nếu người dùng vào thẳng link mà không có SĐT -> Đẩy về trang login
    useEffect(() => {
        if (!phoneNumber) {
            navigate(paths.auth.jwt.login);
        }
    }, [phoneNumber, navigate]);

    // Xử lý Gửi lại mã (Resend)
    const handleResendCode = async () => {
        try {
            if (phoneNumber) {
                await forgotPassword(phoneNumber);
                alert('Đã gửi lại mã xác thực thành công!');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (!phoneNumber) return;

            // 1. Gọi API xác thực OTP
            const response = await verifyOtp(phoneNumber, data.code);

            console.info('Xác thực thành công!');

            // 2. Chuyển sang trang Đổi mật khẩu
            // QUAN TRỌNG: Truyền kèm 'resetToken' sang trang sau để Server cho phép đổi pass
            navigate(paths.auth.jwt.newPassword, {
                state: {
                    phoneNumber: phoneNumber,
                    resetToken: response.resetToken, // Token này lấy từ kết quả API verifyOtp
                },
            });

        } catch (error: any) {
            console.error(error);
            setError('root', {
                type: 'manual',
                message: error.message || 'Mã xác thực không đúng, vui lòng thử lại.',
            });
        }
    });

    return (
        <Stack sx={{ px: 2, py: 5, mx: 'auto', maxWidth: 480 }}>
            <Stack alignItems="center" sx={{ mb: 5 }}>
                <Iconify icon="solar:shield-check-bold" width={64} sx={{ color: 'primary.main', mb: 2 }} />

                <Typography variant="h4">Kiểm tra điện thoại</Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, textAlign: 'center' }}>
                    Chúng tôi đã gửi mã xác thực 6 số đến số điện thoại: <br />
                    <strong style={{ color: 'black' }}>{phoneNumber}</strong>
                </Typography>
            </Stack>

            {/* Hiển thị lỗi chung nếu có */}
            {!!methods.formState.errors.root && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {methods.formState.errors.root.message}
                </Alert>
            )}

            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Stack spacing={3}>
                    {/* Ô nhập mã 6 số */}
                    <RHFCodes
                        keyName="code"
                        inputs={['code1', 'code2', 'code3', 'code4', 'code5', 'code6']}
                    />

                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting || loading}
                        sx={{ bgcolor: '#FFC107', color: 'black' }}
                    >
                        Xác thực
                    </LoadingButton>

                    <Typography variant="body2" sx={{ mx: 'auto', mt: 3 }}>
                        Bạn không nhận được mã?{' '}
                        <Link
                            variant="subtitle2"
                            onClick={handleResendCode}
                            sx={{
                                cursor: 'pointer',
                                color: 'primary.main',
                                textDecoration: 'underline',
                            }}
                        >
                            Gửi lại ngay
                        </Link>
                    </Typography>

                    <Link
                        component={RouterLink as any}
                        to={paths.auth.jwt.login}
                        color="inherit"
                        variant="subtitle2"
                        sx={{
                            alignItems: 'center',
                            display: 'inline-flex',
                            mx: 'auto',
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