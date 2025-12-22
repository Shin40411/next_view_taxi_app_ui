import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const password = useBoolean();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Mật khẩu hiện tại là trường bắt buộc'),
    newPassword: Yup.string()
      .required('Mật khẩu mới là trường bắt buộc')
      .min(6, 'Mật khẩu ít nhất 6 ký tự')
      .test(
        'no-match',
        'Mật khẩu mới phải khác mật khẩu hiện tại',
        (value, { parent }) => value !== parent.oldPassword
      ),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Xác nhận mật khẩu mới chưa trùng khớp'),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const { oldPassword, newPassword, confirmNewPassword } = data;

    if (newPassword !== confirmNewPassword) {
      enqueueSnackbar('Mật khẩu mới không trùng khớp', { variant: 'warning' });
      return;
    }

    try {
      const userData = sessionStorage.getItem("user");
      if (!userData) {
        enqueueSnackbar('Không tìm thấy thông tin người dùng', { variant: 'error' });
        return;
      }

      const parsedUserData = JSON.parse(userData);
      if (!parsedUserData.id) {
        enqueueSnackbar('ID người dùng không hợp lệ', { variant: 'error' });
        return;
      }

      reset();
      enqueueSnackbar('Thay đổi mật khẩu thành công!', { variant: 'success' });
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Thay đổi mật khẩu thất bại!';
      enqueueSnackbar(message, { variant: 'error' });
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <RHFTextField
          name="oldPassword"
          type={password.value ? 'text' : 'password'}
          label="Mật khẩu hiện tại"
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
          name="newPassword"
          label="Mật khẩu mới"
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
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Mật khẩu ít nhất phải 6 ký tự
            </Stack>
          }
        />

        <RHFTextField
          name="confirmNewPassword"
          type={password.value ? 'text' : 'password'}
          label="Xác nhận mật khẩu mới"
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

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Lưu mật khẩu
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
