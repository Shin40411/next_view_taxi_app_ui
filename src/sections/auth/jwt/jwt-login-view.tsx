import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// 👇 SỬA IMPORT NÀY (An toàn nhất):
import { Link as RouterLink } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Box, Link, alpha } from '@mui/material';
// import { RouterLink } from 'src/routes/components'; // 👈 BỎ DÒNG CŨ NÀY ĐI
import { paths } from 'src/routes/paths';
import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();
  const mdUp = useResponsive('up', 'md');

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    userName: Yup.string().required('Vui lòng điền tên đăng nhập'),
    password: Yup.string().required('Vui lòng nhập mật khẩu'),
  });

  const defaultValues = {
    userName: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login?.(data.userName, data.password);
      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error: any) {
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHeadDesktop = (
    <Stack py={5}>
      <Box width="100%" display="flex" justifyContent="center">
        <Logo
          src='/logo/goxuvn.png'
          sx={{
            width: '30%',
            height: '30%'
          }}
        />
      </Box>
      <Stack direction="column" alignItems="center" spacing={0.5}>
        <Typography variant="h4">TIẾP THỊ LIÊN KẾT</Typography>
        <Typography variant="subtitle2" color="text.disabled">HỢP TÁC: 0763 800 763</Typography>
      </Stack>
    </Stack>
  );

  const renderHeadMobile = (
    <Stack alignItems="center" spacing={2} sx={{ mb: 5, color: 'common.white' }}>
      <Box
        sx={{
          mb: 2,
          width: 190,
          height: 190,
          p: 1,
          display: 'flex',
          borderRadius: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'common.white',
          boxShadow: (theme) => theme.customShadows.z24,
        }}
      >
        <Logo
          src="/logo/goxuvn.png"
          sx={{
            width: 'auto',
            maxWidth: 500,
            height: '100%',
          }}
        />
      </Box>
      <Stack direction="column" alignItems="center" spacing={0.5}>
        <Typography variant="h4">TIẾP THỊ LIÊN KẾT</Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>HỢP TÁC: 0763 800 763</Typography>
      </Stack>
    </Stack>
  );

  const renderFormDesktop = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="userName" label="Tên đăng nhập" />

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

      {/* --- SỬA LẠI PHẦN LINK (THÊM "as any") --- */}
      <Stack direction="row" justifyContent="flex-end">
        <Link
          component={RouterLink as any} // 👈 QUAN TRỌNG: Thêm 'as any' để tránh lỗi đỏ
          to={paths.auth.jwt.forgotPassword}
          variant="body2"
          color="inherit"
          underline="always"
          sx={{ alignSelf: 'flex-end', cursor: 'pointer' }}
        >
          Quên mật khẩu?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="warning"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Đăng nhập
      </LoadingButton>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">Bạn chưa có tài khoản?</Typography>

        <Link
          component={RouterLink as any} // 👈 QUAN TRỌNG: Thêm 'as any'
          to={paths.auth.jwt.register}
          variant="subtitle2"
          color="primary"
        >
          Đăng ký ngay
        </Link>
      </Stack>
    </Stack>
  );

  const renderFormMobile = (
    <Stack spacing={3}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <Stack spacing={2.5}>
        <Stack spacing={0.5}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Tên đăng nhập</Typography>
          <RHFTextField
            name="userName"
            variant="standard"
            InputProps={{
              disableUnderline: false,
              sx: {
                '&:before': { borderBottomColor: alpha('#919EAB', 0.2) },
                '&:after': { borderBottomColor: '#FFC107' },
              }
            }}
          />
        </Stack>

        <Stack spacing={0.5}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Mật khẩu</Typography>
          <RHFTextField
            name="password"
            variant="standard"
            type={password.value ? 'text' : 'password'}
            InputProps={{
              disableUnderline: false,
              sx: {
                '&:before': { borderBottomColor: alpha('#919EAB', 0.2) },
                '&:after': { borderBottomColor: '#FFC107' },
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Link
          component={RouterLink as any} // 👈 QUAN TRỌNG: Thêm 'as any'
          to={paths.auth.jwt.forgotPassword}
          variant="caption"
          color="text.primary"
          sx={{ cursor: 'pointer', fontWeight: 'bold' }}
        >
          Quên mật khẩu?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{
          bgcolor: '#FFC107',
          color: 'common.black',
          borderRadius: 3,
          boxShadow: '0 8px 16px 0 rgba(106, 156, 120, 0.24)',
          '&:hover': {
            bgcolor: '#5a8c68',
          }
        }}
      >
        Đăng nhập
      </LoadingButton>

      <Stack direction="row" spacing={0.5} justifyContent="center">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Bạn chưa có tài khoản?</Typography>
        <Link
          component={RouterLink as any} // 👈 QUAN TRỌNG: Thêm 'as any'
          to={paths.auth.jwt.register}
          variant="subtitle2"
          sx={{ color: 'text.primary', fontWeight: 'bold' }}
        >
          Đăng ký ngay
        </Link>
      </Stack>
    </Stack>
  );

  if (!mdUp) {
    return (
      <Box
        sx={{
          width: '100vw',
          minHeight: '100vh',
          bgcolor: '#FFC107',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ flex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', pt: 4, pb: 2 }}>
          {renderHeadMobile}
        </Box>

        <Box
          flex={1}
          sx={{
            width: '100%',
            bgcolor: 'common.white',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            px: 4,
            py: 6,
            pb: 8,
            maxWidth: 850,
            mx: 'auto',
          }}
        >
          <FormProvider methods={methods} onSubmit={onSubmit}>
            {renderFormMobile}
          </FormProvider>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      maxWidth={450}
      boxShadow="rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px"
      borderRadius={2}
      borderTop="5px solid lab(83.2664% 8.65132 106.895)"
      sx={{
        pb: { xs: 5, md: 10 },
        px: { xs: 3, md: 10 }
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderHeadDesktop}
        {renderFormDesktop}
      </FormProvider>
    </Box>
  );
}