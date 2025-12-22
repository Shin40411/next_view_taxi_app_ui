import * as Yup from 'yup';
import { useMemo, useState } from 'react';
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
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Box, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import Logo from 'src/components/logo';

// ----------------------------------------------------------------------
type Role = 'ctv' | 'driver' | 'cosokd';

interface FormValues {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: 'ctv' | 'driver' | 'cosokd';

  phoneNumber: string;
  address?: string;

  taxiBrand?: string;
  licensePlate?: string;

  pointsPerGuest?: number;
  branches?: string;
}

export default function JwtRegisterView() {
  const { register } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const password = useBoolean();
  const cfpassword = useBoolean();

  const RegisterSchema = Yup.object({
    fullName: Yup.string().required('Vui lòng nhập họ tên'),
    username: Yup.string().required('Vui lòng nhập email/username').email('Email không hợp lệ'),
    password: Yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: Yup.string()
      .required('Vui lòng xác nhận mật khẩu')
      .oneOf([Yup.ref('password')], 'Mật khẩu không trùng khớp'),
    role: Yup.mixed<'ctv' | 'driver' | 'cosokd'>()
      .oneOf(['ctv', 'driver', 'cosokd'])
      .required('Vui lòng chọn vai trò'),

    phoneNumber: Yup.string()
      .required('Vui lòng nhập số điện thoại')
      .matches(/^0\d{9,10}$/, 'Số điện thoại không hợp lệ'),
    address: Yup.string().optional(),

    taxiBrand: Yup.string().when('role', {
      is: 'driver',
      then: (s) => s.required('Vui lòng nhập hãng taxi'),
      otherwise: (s) => s.strip(),
    }),

    licensePlate: Yup.string().when('role', {
      is: 'driver',
      then: (s) => s.required('Vui lòng nhập biển số'),
      otherwise: (s) => s.strip(),
    }),

    pointsPerGuest: Yup.number()
      .transform((v, orig) => (orig === '' || orig == null ? undefined : v))
      .when('role', {
        is: 'cosokd',
        then: (s) => s.required('Vui lòng nhập điểm/khách').min(0, 'Không được âm'),
        otherwise: (s) => s.strip(),
      }),

    branches: Yup.string().when('role', {
      is: 'cosokd',
      then: (s) => s.required('Vui lòng nhập chi nhánh'),
      otherwise: (s) => s.strip(),
    }),
  }).required();

  const defaultValues: FormValues = useMemo(
    () => ({
      fullName: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: 'ctv',

      phoneNumber: '',
      address: '',

      taxiBrand: '',
      licensePlate: '',

      pointsPerGuest: undefined,
      branches: '',
    }),
    []
  );

  const methods = useForm<FormValues>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = methods;

  const role = watch('role');

  const onSubmitForm = handleSubmit(async (data) => {
    try {
      const payload = {
        username: data.username,
        password: data.password,
        role: data.role,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber || undefined,
        address: data.address || undefined,

        pointsPerGuest: data.role === 'cosokd' ? data.pointsPerGuest : undefined,
        branches: data.role === 'cosokd'
          ? (data.branches ? data.branches.split(',').map((s) => s.trim()).filter(Boolean) : undefined)
          : undefined,

        taxiBrand: data.role === 'driver' ? data.taxiBrand : undefined,
        licensePlate: data.role === 'driver' ? data.licensePlate : undefined,
      };

      const res = await register(payload);

      if (res.data.statusCode !== '200') {
        setErrorMsg(res.data.message);
        reset();
        return;
      }
      setSuccessMsg(res.data.message);
      reset();
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
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
    <FormProvider methods={methods}
      onSubmit={onSubmitForm}>
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
            <RHFTextField name="phoneNumber" label="Số điện thoại" fullWidth autoComplete='OFF' />
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
            type={password.value ? 'text' : 'password'}
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


      <LoadingButton
        fullWidth
        color="warning"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Tạo tài khoản
      </LoadingButton>
      <Stack direction="row" spacing={0.5} mt={2}>
        <Typography variant="body2"> Bạn đã có tài khoản? </Typography>

        <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2" color="MenuText">
          Quay lại đăng nhập
        </Link>
      </Stack>
    </FormProvider>
  );

  return (
    <Box
      width={450}
      boxShadow="rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px"
      borderRadius={2}
      borderTop="5px solid lab(83.2664% 8.65132 106.895)"
      sx={{
        pb: 5,
        px: 5
      }}
    >
      {renderHead}

      {renderForm}

      {renderTerms}
    </Box>
  );
}
