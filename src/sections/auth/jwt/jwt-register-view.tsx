import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
// import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFUpload, RHFCheckbox, RHFSelect } from 'src/components/hook-form';
import { Box, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, MenuItem, alpha } from '@mui/material';
import Logo from 'src/components/logo';
import { useSnackbar } from 'src/components/snackbar';
import { RegisterPayload } from 'src/types/payloads';
import { Step1Schema } from './schema/register-schema';

import { _TAXIBRANDS } from 'src/_mock/_brands';
import { _PROVINCES } from 'src/_mock/_provinces';


interface FormValuesStep1 {
  fullName: string;
  email?: string;
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


  const [loadingNext, setLoadingNext] = useState(false);

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
  }), []);

  const methodsStep1 = useForm<FormValuesStep1>({
    resolver: yupResolver(Step1Schema),
    defaultValues: defaultValuesStep1,
  });


  const { handleSubmit: handleSubmitStep1, watch, control } = methodsStep1;

  const role = watch('role');


  const onSubmitForm = handleSubmitStep1(async (data) => {
    try {
      setLoadingNext(true);
      const formData = new FormData();
      formData.append('username', data.phoneNumber || '');
      formData.append('full_name', data.fullName);
      if (data.email) formData.append('email', data.email);
      formData.append('phone_number', data.phoneNumber || '');
      formData.append('password', data.password);

      // Role Mapping
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
              {/* <FormControlLabel value="cosokd" control={<Radio sx={{ color: '#ddd', '&.Mui-checked': { color: '#000' } }} />} label="Công ty" /> */}
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
            <RHFTextField name="email" label="Email" fullWidth autoComplete='email' placeholder="example@domain.com" />
          </Stack>

          {(role === 'driver' || role === 'cosokd') && (
            <>
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
            </>
          )}
        </Stack>

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
              <FormControlLabel
                value="cosokd"
                control={<Radio sx={{ color: '#ddd', '&.Mui-checked': { color: '#000' } }} />}
                label={<Typography variant="caption" sx={{ fontWeight: 'bold' }}>Công ty</Typography>}
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
            autoComplete='email'
            placeholder="example@domain.com"
            InputProps={{
              disableUnderline: false,
              sx: {
                '&:before': { borderBottomColor: alpha('#919EAB', 0.2) },
                '&:after': { borderBottomColor: '#FFC107' },
              }
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




  const renderCommonFormContent = (
    <>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      {!!successMsg && <Alert severity="success">{successMsg}</Alert>}

      <FormProvider methods={methodsStep1} onSubmit={onSubmitForm}>
        {mdUp ? renderFormDesktop : renderFormMobile}
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
          Đăng ký
        </LoadingButton>
        <Stack direction="row" spacing={0.5} mt={2} justifyContent="center">
          <Typography variant="body2"> Bạn đã có tài khoản? </Typography>

          <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2" color={!mdUp ? "text.primary" : "MenuText"} sx={!mdUp ? { fontWeight: 'bold' } : {}}>
            Quay lại đăng nhập
          </Link>
        </Stack>
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
        {/* Top Section */}
        <Box sx={{ flex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', pt: 2 }}>
          {renderHeadMobile}
        </Box>

        {/* Bottom Section (Form) */}
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

  // Desktop View
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
