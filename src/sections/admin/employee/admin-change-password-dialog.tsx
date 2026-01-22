
import { useState } from 'react';
import { useSnackbar } from 'notistack';

// @mui
import {
    Button,
    Dialog,
    TextField,
    IconButton,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
} from '@mui/material';

// hooks
import { useAdmin } from 'src/hooks/api/use-admin';
import { useBoolean } from 'src/hooks/use-boolean';

// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: VoidFunction;
    userId: string | null;
    userName: string;
};

export default function AdminChangePasswordDialog({ open, onClose, userId, userName }: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const { changePassword } = useAdmin();

    const [newPassword, setNewPassword] = useState('');
    const showPassword = useBoolean();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!userId || !newPassword) return;

        try {
            setIsSubmitting(true);
            await changePassword(userId, newPassword);
            enqueueSnackbar('Đổi mật khẩu thành công', { variant: 'success' });
            onClose();
            setNewPassword('');
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Đổi mật khẩu thất bại', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Đổi mật khẩu - {userName}</DialogTitle>

            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    type={showPassword.value ? 'text' : 'password'}
                    label="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={showPassword.onToggle} edge="end">
                                    <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mt: 2 }}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Hủy
                </Button>
                <Button onClick={handleSubmit} variant="contained" disabled={!newPassword || isSubmitting}>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}
