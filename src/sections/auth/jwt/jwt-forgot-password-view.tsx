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
import { paths } from 'src/routes/paths';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function JwtForgotPasswordView() {
    const navigate = useNavigate();

    const { forgotPassword } = useAuthApi();

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
        setError,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await forgotPassword(data.phoneNumber);
            // Navigate to verify page with phone number
            navigate(paths.auth.jwt.verify, {
                state: { phoneNumber: data.phoneNumber }
            });
        } catch (error: any) {
            console.error(error);
            setError('phoneNumber', {
                type: 'manual',
                message: 'Không thể gửi mã ngay lúc này, vui lòng thử lại sau.'
            });
        }
    });

    return (
        <Stack sx={{ px: 2, py: 5, mx: 'auto', maxWidth: 480 }}>
            <Stack alignItems="center" sx={{ mb: 5 }}>
                <Iconify icon="fluent:password-reset-48-filled" width={64} sx={{ color: 'primary.main', mb: 2 }} />
                <Typography variant="h4">Quên mật khẩu?</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, textAlign: 'center' }}>
                    Nhập số điện thoại hoặc email đã đăng ký, chúng tôi sẽ gửi mã xác thực qua Zalo hoặc email của bạn.
                </Typography>
            </Stack>

            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Stack spacing={3}>
                    <RHFTextField name="phoneNumber" label="Số điện thoại hoặc email" />

                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        sx={{ bgcolor: '#ddd', color: 'black' }}
                    >
                        Gửi mã xác thực
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