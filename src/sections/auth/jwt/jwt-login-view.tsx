import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

// import { paths } from 'src/routes/paths';
// import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Box, Link } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import Logo from 'src/components/logo';
// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();

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
    } catch (error) {
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
    <Stack py={5}>
      <Box width="100%" display="flex" justifyContent="center">
        <Logo
          sx={{
            width: '30%',
            height: '30%'
          }}
        />
      </Box>
      <Stack direction="column" alignItems="center" spacing={0.5}>
        <Typography variant="h4">TIẾP THỊ LIÊN KẾT</Typography>

        <Typography variant="subtitle2" color="InactiveCaptionText">HỢP TÁC: 0763 800 763</Typography>
      </Stack>
    </Stack>
  );

  const renderForm = (
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

      {/* <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link> */}

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

        <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2" color="MenuText">
          Đăng ký ngay
        </Link>
      </Stack>
    </Stack>
  );

  return (
    <Box
      width={450}
      boxShadow="rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px"
      borderRadius={2}
      borderTop="5px solid lab(83.2664% 8.65132 106.895)"
      sx={{
        pb: 10,
        px: 10
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderHead}

        {renderForm}
      </FormProvider>
    </Box>
  );
}
