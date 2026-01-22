import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { useAuthApi, useAuthContext } from 'src/auth/hooks';
// import { PATH_AFTER_LOGIN } from 'src/config-global';

import { Box, Radio, alpha, MenuItem, FormLabel, RadioGroup, FormControl, FormControlLabel } from '@mui/material';

import { _TAXIBRANDS } from 'src/_mock/_brands';
import { _PROVINCES } from 'src/_mock/_provinces';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFCode, RHFSelect, RHFTextField } from 'src/components/hook-form';

import { Step1Schema } from './schema/register-schema';


interface FormValuesStep1 {
  fullName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  password: string;
  confirmPassword: string;
  role: 'ctv' | 'driver' | 'cosokd';
  taxiBrand?: string;
  licensePlate?: string;
  pointsPerGuest?: number;
  taxCode?: string;
  branches?: string;
  rewardAmount?: number;
  otp?: string;
}



export default function JwtRegisterView() {
  const { register } = useAuthContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const mdUp = useResponsive('up', 'md');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const password = useBoolean();
  const cfpassword = useBoolean();
  const { requestRegisterOtp } = useAuthApi();
  const [step, setStep] = useState(0);


  const [loadingNext, setLoadingNext] = useState(false);
  const [isVideoOpen, setVideoOpen] = useState(false);

  const defaultValuesStep1: FormValuesStep1 = useMemo(() => ({
    fullName: '',
    password: '',
    confirmPassword: '',
    role: 'ctv',
    email: '',
    phoneNumber: '',
    address: '',
    taxiBrand: '',
    licensePlate: '',
    pointsPerGuest: undefined,
    taxCode: '',
    branches: '',
    rewardAmount: 0,
    otp: '',
  }), []);

  const methodsStep1 = useForm<FormValuesStep1>({
    resolver: yupResolver(Step1Schema),
    defaultValues: defaultValuesStep1,
  });


  const { handleSubmit: handleSubmitStep1, watch, control } = methodsStep1;

  const role = watch('role');


  const onSubmitForm = handleSubmitStep1(async (data) => {
    try {
      if (step === 0) {
        setLoadingNext(true);
        await requestRegisterOtp({
          username: data.phoneNumber,
          email: data.email,
          fullName: data.fullName
        });
        setStep(1);
        setLoadingNext(false);
        return;
      }

      setLoadingNext(true);
      const formData = new FormData();
      formData.append('username', data.phoneNumber || '');
      formData.append('full_name', data.fullName);
      formData.append('email', data.email);
      formData.append('phone_number', data.phoneNumber || '');
      formData.append('password', data.password);
      formData.append('otp', data.otp || '');

      let backendRole: string = data.role;
      if (data.role === 'driver') {
        backendRole = 'PARTNER';
      } else if (data.role === 'ctv') {
        backendRole = 'INTRODUCER';
      } else if (data.role === 'cosokd') {
        backendRole = 'CUSTOMER';
      }

      formData.append('role', backendRole);

      if (data.role === 'driver' || data.role === 'ctv') {
        if (data.licensePlate) formData.append('vehicle_plate', data.licensePlate);
      }

      if (data.role === 'cosokd') {
        if (data.taxCode) formData.append('tax_id', data.taxCode);
        if (data.branches) formData.append('province', data.branches);
        if (data.address) formData.append('address', data.address);
        if (data.rewardAmount) formData.append('reward_amount', String(data.rewardAmount));
      }

      await register?.(formData as any);

      setSuccessMsg('Đăng ký thành công!');
      enqueueSnackbar('Đăng ký thành công!', { variant: 'success' });
      setTimeout(() => {
        router.push(paths.auth.jwt.login);
      }, 2000);
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
      setLoadingNext(false);
    }
  });

  const renderHeadDesktop = (
    <Stack sx={{ position: 'relative' }} mb={2}>
      <Box width="100%" display="flex" justifyContent="center" my={2}>
        <Logo
          src='/logo/goxuvn.png'
          sx={{
            width: '10%',
            height: '10%'
          }}
        />
      </Box>
      <Stack direction="column" alignItems="center" spacing={0.5}>
        <Typography variant="h5">TIẾP THỊ LIÊN KẾT</Typography>

        <Typography variant="caption" color="InactiveCaptionText">HỢP TÁC: 0763 800 763</Typography>
      </Stack>
    </Stack>
  );

  const renderHeadMobile = (
    <Stack alignItems="center" spacing={0} sx={{ mb: 2, color: 'common.white' }}>
      <Box
        sx={{
          mb: 0.5,
          width: 50,
          height: 50,
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
            maxWidth: 200,
            height: 30,
          }}
        />
      </Box>
      <Stack direction="column" alignItems="center">
        <Typography variant="h6">TIẾP THỊ LIÊN KẾT</Typography>

        <Typography variant="caption" color="ActiveCaption">HỢP TÁC: 0763 800 763</Typography>
      </Stack>
    </Stack>
  );

  const renderFormDesktop = (
    <>
      <FormControl>
        <FormLabel sx={{ color: '#000', '&.MuiFormLabel-root.Mui-focused': { color: '#000' } }}>Bạn đăng ký với vai trò</FormLabel>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <RadioGroup row {...field}>
              <FormControlLabel value="ctv" control={<Radio sx={{ color: '#ddd', '&.Mui-checked': { color: '#000' } }} />} label="CTV" />
              <FormControlLabel value="driver" control={<Radio sx={{ color: '#ddd', '&.Mui-checked': { color: '#000' } }} />} label="Tài xế" />
            </RadioGroup>
          )}
        />
      </FormControl>
      <Stack spacing={2} width="100%" py={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} width="100%">
          <Stack spacing={2.5} flex={1}>
            <RHFTextField name="fullName" label={role === 'cosokd' ? "Tên công ty" : "Họ và tên"} fullWidth autoComplete='OFF' />
            <RHFTextField
              name="phoneNumber"
              type='tel'
              label="Số điện thoại"
              fullWidth
              autoComplete='OFF'
              inputProps={{
                maxLength: 11,
                inputMode: 'numeric',
                pattern: '0[0-9]{9,10}'
              }}
              placeholder="0xxx xxx xxx"
            />
          </Stack>

          {(role === 'driver' || role === 'cosokd') && (
            <Stack spacing={2.5} flex={1}>
                {role === 'driver' && (
                  <>
                    <RHFSelect name="taxiBrand" label="Hãng taxi" fullWidth>
                      {_TAXIBRANDS.map((brand) => (
                        <MenuItem key={brand.code} value={brand.code}>
                          {brand.name}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                    <RHFTextField name="licensePlate" label="Biển số xe" fullWidth />
                  </>
                )}
                {role === 'cosokd' && (
                  <>
                    <RHFTextField name="taxCode" label="Mã số thuế" fullWidth />
                    <RHFTextField name="rewardAmount" label="Số điểm thưởng" placeholder='10 điểm/khách' type="number" fullWidth InputProps={{ sx: { '&:before': { borderBottomColor: alpha('#919EAB', 0.2) }, '&:after': { borderBottomColor: '#FFC107' } } }} />
                  </>
                )}
              </Stack>
          )}
        </Stack>
        <RHFTextField
          name="email"
          label="Email"
          fullWidth
          autoComplete="email"
          placeholder="example@domain.com"
        />

        <Stack direction="column" spacing={2} width="100%">
          {role === 'cosokd' && (
            <Stack spacing={2.5} flex={1}>
              <>
                <RHFSelect
                  name="branches"
                  label="Tỉnh/ Thành phố"
                  fullWidth
                >
                  {_PROVINCES.map((province) => (
                    <MenuItem key={province.code} value={province.name}>
                      {province.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFTextField name="address" label="Địa chỉ" fullWidth />
              </>
            </Stack>
          )}
          <RHFTextField
            name="password"
            label="Mật khẩu"
            type={password.value ? 'text' : 'password'}
            fullWidth
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
            type={cfpassword.value ? 'text' : 'password'}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={cfpassword.onToggle} edge="end">
                    <Iconify icon={cfpassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>
    </>
  );

  const renderFormMobile = (
    <Stack direction="row" spacing={2} sx={{ height: '100%' }}>
      <Stack
        spacing={2}
        sx={{
          width: 100,
          flexShrink: 0,
          // borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          pr: 1,
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 1 }}>
          VAI TRÒ
        </Typography>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field} sx={{ flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                value="ctv"
                control={<Radio sx={{ color: '#ddd', '&.Mui-checked': { color: '#000' } }} />}
                label={<Typography variant="caption" sx={{ fontWeight: 'bold' }}>CTV</Typography>}
                sx={{ mx: 0 }}
              />
              <FormControlLabel
                value="driver"
                control={<Radio sx={{ color: '#ddd', '&.Mui-checked': { color: '#000' } }} />}
                label={<Typography variant="caption" sx={{ fontWeight: 'bold' }}>Tài xế</Typography>}
                sx={{ mx: 0 }}
              />
            </RadioGroup>
          )}
        />
      </Stack>

      {/* Main Content: Form Fields */}
      <Stack spacing={2} sx={{ flex: 1, pb: 3 }}>
        <Stack spacing={0.5}>
          <Typography variant="body2" sx={{ color: 'text.danger' }} fontWeight={700}>{role === 'cosokd' ? "Tên công ty" : "Họ và tên"}</Typography>
          <RHFTextField
            name="fullName"
            variant="standard"
            fullWidth
            autoComplete='OFF'
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
          <Typography variant="body2" sx={{ color: 'text.danger' }} fontWeight={700}>Số điện thoại</Typography>
          <RHFTextField
            name="phoneNumber"
            type='tel'
            variant="standard"
            fullWidth
            autoComplete='OFF'
            inputProps={{
              maxLength: 11,
              inputMode: 'numeric',
              pattern: '0[0-9]{9,10}'
            }}
            placeholder="0xxx xxx xxx"
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
          <Typography variant="body2" sx={{ color: 'text.danger' }} fontWeight={700}>Email</Typography>
          <RHFTextField
            name="email"
            variant="standard"
            fullWidth
            autoComplete="email"
            placeholder="example@domain.com"
            InputProps={{
              disableUnderline: false,
              sx: {
                '&:before': { borderBottomColor: alpha('#919EAB', 0.2) },
                '&:after': { borderBottomColor: '#FFC107' },
              },
            }}
          />
        </Stack>

        {(role === 'driver' || role === 'cosokd') && (
          <>
            {role === 'driver' && (
              <>
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ color: 'text.danger' }} fontWeight={700}>Hãng taxi</Typography>
                  <RHFSelect name="taxiBrand" variant="standard" fullWidth InputProps={{ sx: { '&:before': { borderBottomColor: alpha('#919EAB', 0.2) }, '&:after': { borderBottomColor: '#FFC107' } } }}>
                    {_TAXIBRANDS.map((brand) => (
                      <MenuItem key={brand.code} value={brand.code}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Stack>
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ color: 'text.danger' }} fontWeight={700}>Biển số xe</Typography>
                  <RHFTextField name="licensePlate" placeholder='30B-xxx.xx' variant="standard" fullWidth InputProps={{ sx: { '&:before': { borderBottomColor: alpha('#919EAB', 0.2) }, '&:after': { borderBottomColor: '#FFC107' } } }} />
                </Stack>
              </>
            )}
            {role === 'cosokd' && (
              <>
                <RHFTextField name="pointsPerGuest" label="Điểm/khách" type="number" fullWidth value={0} sx={{ display: 'none' }} />
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ color: 'text.danger' }} fontWeight={700}>Tỉnh/ Thành phố</Typography>
                  <RHFSelect
                    name="branches"
                    variant="standard"
                    fullWidth
                    InputProps={{ sx: { '&:before': { borderBottomColor: alpha('#919EAB', 0.2) }, '&:after': { borderBottomColor: '#FFC107' } } }}
                  >
                    {_PROVINCES.map((province) => (
                      <MenuItem key={province.code} value={province.name}>
                        {province.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Stack>
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ color: 'text.danger' }} fontWeight={700}>Mã số thuế</Typography>
                  <RHFTextField name="taxCode" variant="standard" fullWidth InputProps={{ sx: { '&:before': { borderBottomColor: alpha('#919EAB', 0.2) }, '&:after': { borderBottomColor: '#FFC107' } } }} />
                </Stack>
              </>
            )}
          </>
        )}

        <Stack direction="column" spacing={2} width="100%">
          {role === 'cosokd' &&
            <Stack spacing={0.5}>
              <Typography variant="body2" sx={{ color: 'text.danger' }} fontWeight={700}>Địa chỉ</Typography>
              <RHFTextField name="address" variant="standard" fullWidth InputProps={{ sx: { '&:before': { borderBottomColor: alpha('#919EAB', 0.2) }, '&:after': { borderBottomColor: '#FFC107' } } }} />
            </Stack>
          }
          <Stack spacing={0.5}>
            <Typography variant="body2" sx={{ color: 'text.danger' }} fontWeight={700}>Mật khẩu</Typography>
            <RHFTextField
              name="password"
              variant="standard"
              type={password.value ? 'text' : 'password'}
              fullWidth
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
          <Stack spacing={0.5}>
            <Typography variant="body2" sx={{ color: 'text.danger' }} fontWeight={700}>Xác nhận mật khẩu</Typography>
            <RHFTextField
              name="confirmPassword"
              variant="standard"
              type={cfpassword.value ? 'text' : 'password'}
              fullWidth
              InputProps={{
                disableUnderline: false,
                sx: {
                  '&:before': { borderBottomColor: alpha('#919EAB', 0.2) },
                  '&:after': { borderBottomColor: '#FFC107' },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={cfpassword.onToggle} edge="end">
                      <Iconify icon={cfpassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );

  const renderVerifyCode = (
    <Stack sx={{ py: 5, mx: 'auto', maxWidth: 480 }}>
      <Stack alignItems="center" sx={{ mb: 5 }}>
        <Iconify icon="solar:shield-check-bold" width={64} sx={{ color: 'primary.main', mb: 2 }} />

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
                await requestRegisterOtp({
                  username: methodsStep1.getValues('phoneNumber'),
                  email: methodsStep1.getValues('email'),
                  fullName: methodsStep1.getValues('fullName')
                });
                enqueueSnackbar('Đã gửi lại mã xác thực thành công!', { variant: 'success' });
              } catch (e) {
                enqueueSnackbar('Gửi lại mã thất bại', { variant: 'error' });
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
      </Stack>
    </Stack>
  );

  const renderCommonFormContent = (
    <>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      {!!successMsg && <Alert severity="success">{successMsg}</Alert>}

      <FormProvider methods={methodsStep1} onSubmit={onSubmitForm}>
        {step === 0 && (mdUp ? renderFormDesktop : renderFormMobile)}
        {step === 1 && renderVerifyCode}
        <LoadingButton
          type='submit'
          fullWidth
          color="warning"
          size="large"
          variant="contained"
          loading={loadingNext}
          sx={{
            bgcolor: '#ddd',
            ...(!mdUp && {
              color: 'common.black',
              borderRadius: 3,
              boxShadow: '0 8px 16px 0 rgba(106, 156, 120, 0.24)',
              '&:hover': {
                bgcolor: '#5a8c68',
              }
            })
          }}
        >
          {step === 0 ? 'Đăng ký' : 'Hoàn tất đăng ký'}
        </LoadingButton>
        <Stack direction="row" spacing={0.5} mt={2} justifyContent="center">
          <Typography variant="body2"> Bạn đã có tài khoản? </Typography>

          <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2" color={!mdUp ? "text.primary" : "MenuText"} sx={!mdUp ? { fontWeight: 'bold' } : {}}>
            Quay lại đăng nhập
          </Link>
        </Stack>
        {!mdUp &&
          <Stack alignItems="center" sx={{ pb: 2, mt: 2 }} spacing={3}>
            <LoadingButton
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
              Video hướng dẫn sử dụng Goxu
            </LoadingButton>
            <Typography variant="caption" align="center" sx={{ color: 'text.secondary' }}>
              Việc đăng nhập vào Goxu.vn là bạn đã chấp nhận <br /> với{' '}
              <Link component={RouterLink} href={paths.legal.termsOfService} underline="always" color="text.primary">
                điều khoản
              </Link>
              {' '}và{' '}
              <Link component={RouterLink} href={paths.legal.privacyPolicy} underline="always" color="text.primary">
                chính sách bảo mật
              </Link>
              {' '}của chúng tôi
            </Typography>
          </Stack>
        }
      </FormProvider>
    </>
  )

  if (!mdUp) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          bgcolor: '#FFC107',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1200,
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



        <Box sx={{ flex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', pt: 2 }}>
          {renderHeadMobile}
        </Box>
        <Box
          flex={1}
          sx={{
            width: '100%',
            bgcolor: 'common.white',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            p: 4,
            maxWidth: 850,
            mx: 'auto',
            flex: 1,
            overflowY: 'auto'
          }}
        >
          {renderCommonFormContent}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      maxWidth={600}
      boxShadow="rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px"
      borderRadius={2}
      borderTop="5px solid lab(83.2664% 8.65132 106.895)"
      sx={{
        pb: { xs: 3, md: 5 },
        px: { xs: 2.5, md: 5 }
      }}
    >
      {renderHeadDesktop}
      {renderCommonFormContent}
    </Box>
  );
}
