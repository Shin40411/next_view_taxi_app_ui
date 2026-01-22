import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';
import { useAdmin } from 'src/hooks/api/use-admin';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { IUserAdmin } from 'src/types/user';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    currentUser?: IUserAdmin | null;
};

export default function PasswordReset({ open, onClose, currentUser }: Props) {
    const { changePassword } = useAdmin();
    const password = useBoolean();
    const confirmPassword = useBoolean();

    const NewPasswordSchema = Yup.object().shape({
        newPassword: Yup.string()
            .required('Mật khẩu là bắt buộc')
            .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        confirmPassword: Yup.string()
            .required('Xác nhận mật khẩu là bắt buộc')
            .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp'),
    });

    const defaultValues = {
        newPassword: '',
        confirmPassword: '',
    };

    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(NewPasswordSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (!currentUser?.id) return;
            await changePassword(currentUser.id, data.newPassword);
            reset();
            onClose();
            enqueueSnackbar('Đổi mật khẩu thành công!', { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar(error?.message || 'Đã có lỗi xảy ra', { variant: 'error' });
        }
    });

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Cấp lại mật khẩu {currentUser?.full_name ? `- ${currentUser.full_name}` : ''}</DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 3 }}>
                    <FormProvider methods={methods} onSubmit={onSubmit}>
                        <Stack spacing={3}>
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
                            />

                            <RHFTextField
                                name="confirmPassword"
                                label="Xác nhận mật khẩu mới"
                                type={confirmPassword.value ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={confirmPassword.onToggle} edge="end">
                                                <Iconify icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Stack>
                    </FormProvider>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" onClick={onClose}>
                    Hủy
                </Button>

                <LoadingButton
                    variant="contained"
                    loading={isSubmitting}
                    onClick={onSubmit}
                >
                    Cập nhật
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
