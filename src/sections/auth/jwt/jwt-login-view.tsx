import * as Yup from 'yup';
import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
import FormProvider, { RHFTextField, RHFCode } from 'src/components/hook-form';
import { Box, Link, alpha, Button, Divider, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { paths } from 'src/routes/paths';
import Logo from 'src/components/logo';
import { useAuthApi } from 'src/hooks/api/use-auth-api';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();
  const { loginWithGoogle } = useAuthApi();
  const mdUp = useResponsive('up', 'md');

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const [isPartner, setIsPartner] = useState(true);

  const returnTo = searchParams.get('returnTo');

  const [isVideoOpen, setVideoOpen] = useState(false);

  const accessToken = searchParams.get('accessToken');
  const userId = searchParams.get('userId');
  const role = searchParams.get('role');
  const fullName = searchParams.get('fullName');

  useEffect(() => {
    if (accessToken && userId && role) {
      const user = {
        id: userId,
        role: role,
        accessToken: accessToken,
        displayName: fullName || 'User',
        email: '',
        photoURL: '',
      };
      Cookies.set('accessToken', accessToken, { path: '/' });
      Cookies.set('user', JSON.stringify(user), { path: '/' });
      window.location.href = returnTo || PATH_AFTER_LOGIN;
    }
  }, [accessToken, userId, role, returnTo, fullName]);



  const [step, setStep] = useState(0);
  const { requestLoginOtp } = useAuthApi();

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    userName: Yup.string().required('Vui lòng điền tên đăng nhập').max(100, 'Tên đăng nhập không được quá 100 ký tự'),
    password: Yup.string().required('Vui lòng nhập mật khẩu').max(100, 'Mật khẩu không được quá 100 ký tự'),
    otp: Yup.string().optional(),
  });

  const defaultValues = {
    userName: '',
    password: '',
    otp: '',
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
      if (step === 0) {
        const res = await requestLoginOtp({ username: data.userName, password: data.password });
        const requireOtp = res.requireOtp !== undefined ? res.requireOtp : res.data?.requireOtp;

        if (requireOtp || requireOtp === undefined) {
          if (requireOtp !== false) {
            setStep(1);
            return;
          }
        }
      }

      const res = await login?.(data.userName, data.password, data.otp);
      const userRole = res?.data?.role;

      if (userRole === 'ACCOUNTANT' || userRole === 'MONITOR') {
        router.push(paths.dashboard.admin.overview);
      } else {
        router.push(returnTo || PATH_AFTER_LOGIN);
      }

    } catch (error: any) {
      if (step === 0) {
        reset();
      }
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

  const renderVerifyCode = (
    <Stack sx={{ py: 5, mx: 'auto', maxWidth: 480 }}>
      {!!errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}
      <Stack alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h4">Xác thực mã OTP</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, textAlign: 'center' }}>
          Vui lòng kiểm tra mã OTP đã được gửi!
        </Typography>
      </Stack>

      <Stack spacing={3}>
        <RHFCode
          name="otp"
          length={6}
        />

        <Typography variant="body2" sx={{ mx: 'auto', mt: 3 }}>
          Bạn không nhận được mã?{' '}
          <Link
            variant="subtitle2"
            onClick={async () => {
              try {
                await requestLoginOtp({
                  username: methods.getValues('userName'),
                  password: methods.getValues('password'),
                });
                setErrorMsg('');
              } catch (e) {
                setErrorMsg('Gửi lại mã thất bại');
              }
            }}
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
          component="button"
          onClick={() => setStep(0)}
          color="inherit"
          variant="subtitle2"
          sx={{
            alignItems: 'center',
            display: 'inline-flex',
            mx: 'auto',
          }}
        >
          <Iconify icon="eva:arrow-ios-back-fill" width={16} />
          Quay lại
        </Link>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{
            bgcolor: '#ddd',
            color: 'common.black',
            borderRadius: 3,
            boxShadow: '0 8px 16px 0 rgba(106, 156, 120, 0.24)',
            '&:hover': {
              bgcolor: '#5a8c68',
            }
          }}
        >
          Xác thực
        </LoadingButton>

      </Stack>
    </Stack>
  );

  const renderHeadMobile = (
    <Stack alignItems="center" spacing={0} sx={{ mb: 2, color: 'common.white' }}>
      <Box
        sx={{
          mb: 2,
          width: 100,
          height: 100,
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

      <RHFTextField name="userName" label="Tên đăng nhập" placeholder='Số điện thoại hoặc email đã đăng ký' />

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

      <Stack direction="row" justifyContent="flex-end">
        <Link
          component={RouterLink as any}
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
        size="large"
        type="submit"
        sx={{ bgcolor: '#ddd', color: '#000' }}
        variant="contained"
        loading={isSubmitting}
      >
        Đăng nhập
      </LoadingButton>

      {/* <Divider sx={{ mt: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>HOẶC</Typography>
      </Divider> */}

      {/* <RadioGroup
        row
        value={isPartner}
        onChange={(e) => setIsPartner(e.target.value === 'true')}
        sx={{ justifyContent: 'center' }}
      >
        <FormControlLabel value={true} control={<Radio />} label="Tài xế" />
        <FormControlLabel value={false} control={<Radio />} label="CTV" />
      </RadioGroup> */}

      {/* <Button
        fullWidth
        size="large"
        variant="outlined"
        onClick={() => loginWithGoogle(isPartner)}
        startIcon={<Iconify icon="devicon:google" />}
      >
        Đăng nhập bằng Google
      </Button> */}

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">Bạn chưa có tài khoản?</Typography>

        <Link
          component={RouterLink as any}
          to={paths.auth.jwt.register}
          variant="subtitle2"
          color="black"
        >
          Đăng ký ngay
        </Link>
      </Stack>

      <Typography variant="caption" align="center" sx={{ color: 'text.secondary' }}>
        Việc đăng nhập vào Goxu.vn nghĩa là bạn đã chấp nhận với{' '}
        <Link component={RouterLink} target='_blank' to={paths.legal.termsOfService} underline="always" color="text.primary">
          điều khoản
        </Link>
        {' '}và{' '}
        <Link component={RouterLink} target='_blank' to={paths.legal.privacyPolicy} underline="always" color="text.primary">
          chính sách bảo mật
        </Link>
        {' '}của chúng tôi
      </Typography>
    </Stack>
  );

  const renderFormMobile = (
    <Stack spacing={3}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <Stack spacing={2.5}>
        <Stack spacing={0.5}>
          <Typography variant="body2" sx={{ color: 'text.danger' }} fontWeight={700}>Tên đăng nhập</Typography>
          <RHFTextField
            name="userName"
            variant="standard"
            placeholder='Số điện thoại hoặc email đã đăng ký'
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
          <Typography variant="body2" sx={{ color: 'text.danger' }} fontWeight={700}>Mật khẩu</Typography>
          <RHFTextField
            name="password"
            variant="standard"
            placeholder='Mật khẩu của bạn'
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
          component={RouterLink as any}
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
          bgcolor: '#ddd',
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

      {/* <Divider sx={{ mt: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>HOẶC</Typography>
      </Divider> */}

      {/* <RadioGroup
        row
        value={isPartner}
        onChange={(e) => setIsPartner(e.target.value === 'true')}
        sx={{ justifyContent: 'center' }}
      >
        <FormControlLabel value={true} control={<Radio />} label="Tài xế" />
        <FormControlLabel value={false} control={<Radio />} label="CTV" />
      </RadioGroup> */}

      {/* <Button
        fullWidth
        size="large"
        variant="outlined"
        onClick={() => loginWithGoogle(isPartner)}
        startIcon={<Iconify icon="devicon:google" />}
        sx={{ borderRadius: 3 }}
      >
        Đăng nhập bằng Google
      </Button> */}

      <Stack direction="row" spacing={0.5} justifyContent="center">
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Bạn chưa có tài khoản?</Typography>
        <Link
          component={RouterLink as any}
          to={paths.auth.jwt.register}
          variant="subtitle2"
          sx={{ color: 'text.primary', fontWeight: 'bold' }}
        >
          Đăng ký ngay
        </Link>
      </Stack>

      <Stack alignItems="center" sx={{ pb: 0 }}>
        <Button
          size="medium"
          startIcon={<Iconify icon="solar:play-bold" />}
          onClick={() => setVideoOpen(true)}
          sx={{
            color: '#FFC107',
            fontWeight: 'bold',
            bgcolor: alpha('#FFC107', 0.08),
            borderRadius: 20,
            px: 2,
            '&:hover': {
              bgcolor: alpha('#FFC107', 0.16),
            }
          }}
        >
          Hướng dẫn sử dụng Goxu
        </Button>
      </Stack>

      <Typography variant="caption" align="center" sx={{ color: 'text.secondary' }}>
        Việc đăng nhập vào Goxu.vn là bạn đã chấp nhận với{' '}
        <Link component={RouterLink} to={paths.legal.termsOfService} underline="always" color="text.primary">
          điều khoản
        </Link>
        {' '}và{' '}
        <Link component={RouterLink} to={paths.legal.privacyPolicy} underline="always" color="text.primary">
          chính sách bảo mật
        </Link>
        {' '}của chúng tôi
      </Typography>
    </Stack>
  );

  const videoRef = useRef<HTMLVideoElement>(null);

  if (!mdUp) {
    return (
      <Box
        sx={{
          width: '100vw',
          minHeight: '100vh',
          bgcolor: '#FFC107',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isVideoOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              bgcolor: '#000',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconButton
              onClick={() => setVideoOpen(false)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: 'common.white',
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' }
              }}
            >
              <Iconify icon="mingcute:close-line" width={24} />
            </IconButton>

            <Typography variant="subtitle1" sx={{ position: 'absolute', top: 20, left: 24, color: 'common.white' }}>
              Hướng dẫn sử dụng
            </Typography>

            <video
              src="/assets/files/VIDEO-HDSD-GOXU-Edited.mp4"
              controls
              autoPlay
              playsInline
              style={{ width: '100%', maxHeight: '100%' }}
            />
          </Box>
        )}


        <Box sx={{
          flex: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          pt: 2,
          // pb: 2
        }}>
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
            {step === 0 ? renderFormMobile : renderVerifyCode}
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
        {step === 0 ? renderFormDesktop : renderVerifyCode}
      </FormProvider>
    </Box>
  );
}