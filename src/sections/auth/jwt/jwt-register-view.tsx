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
// import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
// import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFUpload } from 'src/components/hook-form';
import { Box, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import Logo from 'src/components/logo';
import { enqueueSnackbar } from 'notistack';
import { Step1Schema, Step2Schema } from './schema/register-schema';


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
  branches?: string;
}

interface FormValuesStep2 {
  cccdFront: File;
  cccdBack: File;
}

export default function JwtRegisterView() {
  const { register } = useAuthContext();

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
    branches: '',
  }), []);

  const methodsStep1 = useForm<FormValuesStep1>({
    resolver: yupResolver(Step1Schema),
    defaultValues: defaultValuesStep1,
  });


  const { handleSubmit: handleSubmitStep1, watch, control } = methodsStep1;

  const role = watch('role');

  const methodsStep2 = useForm<FormValuesStep2>({
    resolver: yupResolver(Step2Schema),
    defaultValues: {
      cccdFront: undefined as unknown as File,
      cccdBack: undefined as unknown as File,
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
      taxiBrand: data.role === 'driver' ? data.taxiBrand : undefined,
      licensePlate: data.role === 'driver' ? data.licensePlate : undefined,
      pointsPerGuest: data.role === 'cosokd' ? data.pointsPerGuest : undefined,
      branches: data.role === 'cosokd'
        ? data.branches?.split(',').map(s => s.trim()).filter(Boolean)
        : undefined,
    };

    setLoadingNext(true);
    setTimeout(() => {
      setPayload(tempPayload);
      setStep(2);
      setLoadingNext(false);
    }, 500);
  });

  const onSubmitForm = handleSubmitStep2(async (data) => {
    const finalPayload = {
      ...payload,
      cccdFront: data.cccdFront,
      cccdBack: data.cccdBack,
    };
    console.log('Payload cuối trước khi submit:', finalPayload);
  });

  const renderHead = (
    <Stack sx={{ position: 'relative' }} mb={2}>
      <Box width="100%" display="flex" justifyContent="center">
        <Logo
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

  const renderForm = (
    <>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      {!!successMsg && <Alert severity="success">{successMsg}</Alert>}

      <FormControl>
        <FormLabel>Bạn đăng ký với vai trò</FormLabel>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <RadioGroup row {...field}>
              <FormControlLabel value="ctv" control={<Radio />} label="CTV" />
              <FormControlLabel value="driver" control={<Radio />} label="Tài xế" />
              <FormControlLabel value="cosokd" control={<Radio />} label="Cơ sở KD" />
            </RadioGroup>
          )}
        />
      </FormControl>
      <Stack spacing={2} width="100%" py={3}>
        <Stack direction="row" spacing={2} width="100%">
          <Stack spacing={2.5} flex={1}>
            <RHFTextField name="fullName" label="Họ và tên" fullWidth autoComplete='OFF' />
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
                  <RHFTextField name="taxiBrand" label="Hãng taxi" fullWidth />
                  <RHFTextField name="licensePlate" label="Biển số xe" fullWidth />
                </>
              )}
              {role === 'cosokd' && (
                <>
                  <RHFTextField name="pointsPerGuest" label="Điểm/khách" type="number" fullWidth />
                  <RHFTextField
                    name="branches"
                    label="Chi nhánh"
                    fullWidth
                  />
                </>
              )}
            </Stack>
          )}
        </Stack>

        <Stack direction="column" spacing={2} width="100%">
          <RHFTextField name="address" label="Địa chỉ (tuỳ chọn)" fullWidth />
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

  const renderStep2 = (
    <Stack spacing={3} pb={3}>
      <Typography variant="h6">Tải lên Căn cước công dân</Typography>
      <Stack flexDirection="row" spacing={1.5}>
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


  return (
    <Box
      width={600}
      boxShadow="rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px"
      borderRadius={2}
      borderTop="5px solid lab(83.2664% 8.65132 106.895)"
      sx={{
        pb: 5,
        px: 5
      }}
    >
      {renderHead}

      <FormProvider methods={step === 1 ? methodsStep1 : methodsStep2} onSubmit={onSubmitForm}>
        {step === 1 && (
          <>
            {renderForm}
            <LoadingButton
              type='button'
              fullWidth
              color="warning"
              size="large"
              variant="contained"
              onClick={onNextStep}
              loading={loadingNext}
            >
              Tiếp theo
            </LoadingButton>
            <Stack direction="row" spacing={0.5} mt={2}>
              <Typography variant="body2"> Bạn đã có tài khoản? </Typography>

              <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2" color="MenuText">
                Quay lại đăng nhập
              </Link>
            </Stack>
          </>
        )}
        {step === 2 && (
          <>
            {renderStep2}
            <LoadingButton
              type='submit'
              fullWidth
              color="warning"
              size="large"
              variant="contained"
            >
              Hoàn tất đăng ký
            </LoadingButton>
          </>
        )}
      </FormProvider>

      {renderTerms}
    </Box>
  );
}
