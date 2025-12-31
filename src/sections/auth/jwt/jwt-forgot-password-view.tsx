import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
// 👇 1. Import chuẩn để tránh lỗi "as any"
import { Link as RouterLink } from 'react-router-dom';

// 👇 2. Import Hook API vừa tạo
import { useAuthApi } from 'src/hooks/api/use-auth-api';

// MUI
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

// Components
// ❌ Bỏ dòng này: import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function JwtForgotPasswordView() {
    const navigate = useNavigate();

    // 👇 3. Gọi Hook ra để sử dụng
    const { forgotPassword } = useAuthApi();

    // Validate số điện thoại Việt Nam
    const ForgotPasswordSchema = Yup.object().shape({
        phoneNumber: Yup.string()
            .required('Vui lòng nhập số điện thoại')
            .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
    });

    const methods = useForm({
        resolver: yupResolver(ForgotPasswordSchema),
        defaultValues: { phoneNumber: '' },
    });

    const {
        handleSubmit,
        setError, // Lấy thêm hàm này để hiển thị lỗi từ API
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            // 👇 4. Gọi API thật (thay thế cho setTimeout)
            await forgotPassword(data.phoneNumber);

            console.info('Gửi mã thành công:', data);

            // Thành công -> Chuyển sang trang nhập mã OTP
            navigate(paths.auth.jwt.verify, { state: { phoneNumber: data.phoneNumber } });

        } catch (error: any) {
            console.error(error);
            // Hiển thị lỗi từ API lên ngay ô nhập liệu (hoặc Alert)
            setError('phoneNumber', {
                type: 'manual',
                message: error.message || 'Không thể gửi mã, vui lòng thử lại sau.'
            });
        }
    });

    return (
        <Stack sx={{ px: 2, py: 5, mx: 'auto', maxWidth: 480 }}>
            <Stack alignItems="center" sx={{ mb: 5 }}>
                <Iconify icon="fluent:password-reset-48-filled" width={64} sx={{ color: 'primary.main', mb: 2 }} />
                <Typography variant="h4">Quên mật khẩu?</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, textAlign: 'center' }}>
                    Nhập số điện thoại đã đăng ký, chúng tôi sẽ gửi mã xác thực qua Zalo.
                </Typography>
            </Stack>

            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Stack spacing={3}>
                    {/* Form sẽ tự hiện lỗi đỏ nếu API trả về lỗi */}
                    <RHFTextField name="phoneNumber" label="Số điện thoại" />

                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting} // Tự động xoay khi đang gọi API
                        sx={{ bgcolor: '#FFC107', color: 'black' }}
                    >
                        Gửi mã xác thực
                    </LoadingButton>

                    <Link
                        component={RouterLink as any} // ✅ Đã dùng import chuẩn, nhưng giữ 'as any' cho chắc chắn
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