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
import { Step1Schema, Step2Schema, Step2SchemaOptional } from './schema/register-schema';
import { _TAXIBRANDS } from 'src/_mock/_brands';


interface FormValuesStep1 {
  fullName: string;
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
}

interface FormValuesStep2 {
  cccdFront?: File;
  cccdBack?: File;
  policy: boolean;
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

  const [step, setStep] = useState<1 | 2>(1);
  const [payload, setPayload] = useState<any>(null);
  const [loadingNext, setLoadingNext] = useState(false);

  const defaultValuesStep1: FormValuesStep1 = useMemo(() => ({
    fullName: '',
    password: '',
    confirmPassword: '',
    role: 'ctv',
    phoneNumber: '',
    address: '',
    taxiBrand: '',
    licensePlate: '',
    pointsPerGuest: undefined,
    taxCode: '',
    branches: '',
  }), []);

  const methodsStep1 = useForm<FormValuesStep1>({
    resolver: yupResolver(Step1Schema),
    defaultValues: defaultValuesStep1,
  });


  const { handleSubmit: handleSubmitStep1, watch, control } = methodsStep1;

  const role = watch('role');

  const methodsStep2 = useForm<FormValuesStep2>({
    resolver: yupResolver(role === 'cosokd' ? Step2SchemaOptional : Step2Schema),
    defaultValues: {
      cccdFront: undefined as unknown as File,
      cccdBack: undefined as unknown as File,
      policy: false,
    },
  });

  const { handleSubmit: handleSubmitStep2, setValue, watch: watch2 } = methodsStep2;

  const watchFront = watch2('cccdFront');
  const watchBack = watch2('cccdBack');

  const handleDrop = (fieldName: 'cccdFront' | 'cccdBack') => (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const newFile = Object.assign(file, { preview: URL.createObjectURL(file) });
    setValue(fieldName, newFile, { shouldValidate: true });
  };
  const onNextStep = handleSubmitStep1((data) => {
    const tempPayload = {
      username: data.fullName,
      password: data.password,
      role: data.role,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      address: data.address,
      taxiBrand: data.role === 'driver' || data.role === 'ctv' ? data.taxiBrand : undefined,
      licensePlate: data.role === 'driver' || data.role === 'ctv' ? data.licensePlate : undefined,
      pointsPerGuest: data.role === 'cosokd' ? data.pointsPerGuest : undefined,
      taxCode: data.role === 'cosokd' ? data.taxCode : undefined,
      branches: data.role === 'cosokd'
        ? data.branches?.split(',').map(s => s.trim()).filter(Boolean)
        : undefined,
    };
    console.log(tempPayload);
    setLoadingNext(true);
    setTimeout(() => {
      setPayload(tempPayload);
      setStep(2);
      setLoadingNext(false);
    }, 500);
  });

  const onSubmitForm = handleSubmitStep2(async (data) => {
    try {
      if (!payload) return;

      const formData = new FormData();
      formData.append('username', payload.phoneNumber || '');
      formData.append('password', payload.password);
      formData.append('full_name', payload.fullName);

      // Role Mapping
      let backendRole = payload.role; // Default to 'ctv' or other roles
      if (payload.role === 'driver') {
        backendRole = 'PARTNER';
      } else if (payload.role === 'ctv') {
        backendRole = 'INTRODUCER';
      } else if (payload.role === 'cosokd') {
        backendRole = 'CUSTOMER';
      }

      formData.append('role', backendRole);

      if (payload.role === 'driver' || payload.role === 'ctv') {
        if (payload.licensePlate) formData.append('vehicle_plate', payload.licensePlate);
        if (data.cccdFront) formData.append('id_card_front', data.cccdFront);
        if (data.cccdBack) formData.append('id_card_back', data.cccdBack);
      }

      if (payload.role === 'cosokd') {
        if (payload.taxCode) formData.append('tax_id', payload.taxCode);
      }

      console.log('FormData sent to backend:', Object.fromEntries(formData));

      // Need to cast to any because register expects RegisterPayload object not FormData, 
      // but axios handles FormData correctly.
      await register?.(formData as any);

      setSuccessMsg('Đăng ký thành công!');
      enqueueSnackbar('Đăng ký thành công!', { variant: 'success' });
      setTimeout(() => {
        router.push(paths.auth.jwt.login);
      }, 2000);
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
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
            width: 50,
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

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        color: 'text.secondary',
        mt: 2.5,
        typography: 'caption',
        textAlign: 'center',
      }}
    >
      {'Bằng việc đăng ký, bạn đã đồng ý với '}
      <Link underline="always" color="text.primary">
        Điều khoản dịch vụ
      </Link>
      {' và '}
      <Link underline="always" color="text.primary">
        Chính sách bảo mật
      </Link>
      .
    </Typography>
  );

  const renderFormDesktop = (
    <>
      <FormControl>
        <FormLabel>Bạn đăng ký với vai trò</FormLabel>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <RadioGroup row {...field}>
              <FormControlLabel value="ctv" control={<Radio />} label="CTV" />
              <FormControlLabel value="driver" control={<Radio />} label="Tài xế" />
              <FormControlLabel value="cosokd" control={<Radio />} label="Công ty" />
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
                    <RHFTextField name="pointsPerGuest" label="Điểm/khách" type="number" fullWidth value={0} sx={{ display: 'none' }} />
                    <RHFTextField
                      name="branches"
                      label="Chi nhánh"
                      fullWidth
                    />
                    <RHFTextField name="taxCode" label="Mã số thuế" fullWidth />
                  </>
                )}
              </Stack>
            </>
          )}
        </Stack>

        <Stack direction="column" spacing={2} width="100%">
          {role === 'cosokd' && <RHFTextField name="address" label="Địa chỉ" fullWidth />}
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
                control={<Radio sx={{ color: '#6A9C78', '&.Mui-checked': { color: '#FFC107' } }} />}
                label={<Typography variant="caption" sx={{ fontWeight: 'bold' }}>CTV</Typography>}
                sx={{ mx: 0 }}
              />
              <FormControlLabel
                value="driver"
                control={<Radio sx={{ color: '#6A9C78', '&.Mui-checked': { color: '#FFC107' } }} />}
                label={<Typography variant="caption" sx={{ fontWeight: 'bold' }}>Tài xế</Typography>}
                sx={{ mx: 0 }}
              />
              <FormControlLabel
                value="cosokd"
                control={<Radio sx={{ color: '#6A9C78', '&.Mui-checked': { color: '#FFC107' } }} />}
                label={<Typography variant="caption" sx={{ fontWeight: 'bold' }}>C.Sở KD</Typography>}
                sx={{ mx: 0 }}
              />
            </RadioGroup>
          )}
        />
      </Stack>

      {/* Main Content: Form Fields */}
      <Stack spacing={2} sx={{ flex: 1, pb: 3 }}>
        <Stack spacing={0.5}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{role === 'cosokd' ? "Tên công ty" : "Họ và tên"}</Typography>
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
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Số điện thoại</Typography>
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

        {(role === 'driver' || role === 'cosokd') && (
          <>
            {role === 'driver' && (
              <>
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Hãng taxi</Typography>
                  <RHFSelect name="taxiBrand" variant="standard" fullWidth InputProps={{ sx: { '&:before': { borderBottomColor: alpha('#919EAB', 0.2) }, '&:after': { borderBottomColor: '#FFC107' } } }}>
                    {_TAXIBRANDS.map((brand) => (
                      <MenuItem key={brand.code} value={brand.code}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Stack>
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Biển số xe</Typography>
                  <RHFTextField name="licensePlate" variant="standard" fullWidth InputProps={{ sx: { '&:before': { borderBottomColor: alpha('#919EAB', 0.2) }, '&:after': { borderBottomColor: '#FFC107' } } }} />
                </Stack>
              </>
            )}
            {role === 'cosokd' && (
              <>
                <RHFTextField name="pointsPerGuest" label="Điểm/khách" type="number" fullWidth value={0} sx={{ display: 'none' }} />
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Chi nhánh</Typography>
                  <RHFTextField
                    name="branches"
                    variant="standard"
                    fullWidth
                    InputProps={{ sx: { '&:before': { borderBottomColor: alpha('#919EAB', 0.2) }, '&:after': { borderBottomColor: '#FFC107' } } }}
                  />
                </Stack>
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Mã số thuế</Typography>
                  <RHFTextField name="taxCode" variant="standard" fullWidth InputProps={{ sx: { '&:before': { borderBottomColor: alpha('#919EAB', 0.2) }, '&:after': { borderBottomColor: '#FFC107' } } }} />
                </Stack>
              </>
            )}
          </>
        )}

        <Stack direction="column" spacing={2} width="100%">
          {role === 'cosokd' &&
            <Stack spacing={0.5}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Địa chỉ</Typography>
              <RHFTextField name="address" variant="standard" fullWidth InputProps={{ sx: { '&:before': { borderBottomColor: alpha('#919EAB', 0.2) }, '&:after': { borderBottomColor: '#FFC107' } } }} />
            </Stack>
          }
          <Stack spacing={0.5}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Mật khẩu</Typography>
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
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Xác nhận mật khẩu</Typography>
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

  const renderStep2 = (
    <Stack spacing={3} pb={3}>
      <Typography variant="h6">Tải lên Căn cước công dân</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <RHFUpload
          name="cccdFront"
          helperText="Mặt trước CCCD"
          accept={{ 'image/*': [] }}
          srcThumb={'/assets/illustrations/front_iden.png'}
          onDrop={handleDrop('cccdFront')}
        />
        <RHFUpload
          name="cccdBack"
          helperText="Mặt sau CCCD"
          accept={{ 'image/*': [] }}
          srcThumb={'/assets/illustrations/back_iden.png'}
          onDrop={handleDrop('cccdBack')}
        />
      </Stack>
    </Stack>
  );


  const renderCommonFormContent = (
    <>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      {!!successMsg && <Alert severity="success">{successMsg}</Alert>}

      <FormProvider methods={step === 1 ? methodsStep1 : methodsStep2} onSubmit={onSubmitForm}>
        {step === 1 && (
          <>
            {mdUp ? renderFormDesktop : renderFormMobile}
            <Box>
              <LoadingButton
                type='button'
                fullWidth
                color="warning"
                size="large"
                variant="contained"
                onClick={onNextStep}
                loading={loadingNext}
                sx={!mdUp ? {
                  bgcolor: '#FFC107',
                  color: 'common.black',
                  borderRadius: 3,
                  boxShadow: '0 8px 16px 0 rgba(106, 156, 120, 0.24)',
                  '&:hover': {
                    bgcolor: '#5a8c68',
                  }
                } : {}}
              >
                Tiếp theo
              </LoadingButton>
            </Box>
            <Stack direction="row" spacing={0.5} mt={2} justifyContent="center">
              <Typography variant="body2"> Bạn đã có tài khoản? </Typography>

              <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2" color={!mdUp ? "text.primary" : "MenuText"} sx={!mdUp ? { fontWeight: 'bold' } : {}}>
                Quay lại đăng nhập
              </Link>
            </Stack>
          </>
        )}
        {step === 2 && (
          <>
            {role !== 'cosokd' ? renderStep2 : (
              <Stack spacing={3} pb={3}>
                <Typography variant="h6">Xác nhận thông tin</Typography>
                <Alert severity="info">
                  Bạn đang đăng ký với vai trò <b>Cơ sở kinh doanh</b>. Vui lòng kiểm tra lại thông tin và nhấn "Hoàn tất đăng ký".
                </Alert>
              </Stack>
            )}

            <RHFCheckbox
              name="policy"
              label={
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Tôi đồng ý với{' '}
                  <Link underline="always" color="text.primary">
                    Điều khoản dịch vụ
                  </Link>
                  {' và '}
                  <Link underline="always" color="text.primary">
                    Chính sách bảo mật
                  </Link>
                </Typography>
              }
              sx={{ mb: 3 }}
            />

            <LoadingButton
              type='submit'
              fullWidth
              color="warning"
              size="large"
              variant="contained"
              sx={!mdUp ? {
                bgcolor: '#FFC107',
                color: 'common.white',
                borderRadius: 3,
                boxShadow: '0 8px 16px 0 rgba(106, 156, 120, 0.24)',
                '&:hover': {
                  bgcolor: '#5a8c68',
                }
              } : {}}
            >
              Hoàn tất đăng ký
            </LoadingButton>
          </>
        )}
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
