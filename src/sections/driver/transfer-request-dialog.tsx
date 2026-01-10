import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';

import { fPoint } from 'src/utils/format-number';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { useAdmin } from 'src/hooks/api/use-admin';
import { IUserAdmin } from 'src/types/user';
import { useWallet } from 'src/hooks/api/use-wallet';
import { useSnackbar } from 'src/components/snackbar';
import { useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: VoidFunction;
    currentBalance: number;
    onRefresh: () => void;
};

type FormValues = {
    recipient?: IUserAdmin | null;
    amount: number;
};

export default function TransferRequestDialog({ open, onClose, currentBalance, onRefresh }: Props) {
    const { useGetUsers } = useAdmin();
    const { user } = useAuthContext();
    const { users } = useGetUsers('PARTNER', 1, 100);
    const filteredUsers = users.filter((u) => u.id !== user?.id);
    const { partnerTransferWallet } = useWallet();
    const { enqueueSnackbar } = useSnackbar();

    const [openConfirm, setOpenConfirm] = useState(false);
    const [formData, setFormData] = useState<FormValues | null>(null);

    const TransferSchema = Yup.object().shape({
        recipient: Yup.mixed<IUserAdmin>()
            .nullable()
            .test('required', 'Vui lòng chọn người nhận', (value) => value !== null && value !== undefined),
        amount: Yup.number()
            .required('Vui lòng nhập số điểm')
            .min(10, 'Tối thiểu 10 Goxu')
            .max(currentBalance, 'Số dư không đủ')
            .typeError('Vui lòng nhập số hợp lệ'),
    });

    const defaultValues: FormValues = {
        recipient: null,
        amount: 0,
    };

    const methods = useForm<FormValues>({
        resolver: yupResolver(TransferSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = (data: FormValues) => {
        setFormData(data);
        setOpenConfirm(true);
    };

    const handleConfirmTransfer = async () => {
        if (!formData?.recipient) return;
        try {
            await partnerTransferWallet(formData.recipient.id, formData.amount);
            enqueueSnackbar('Chuyển Goxu thành công!', { variant: 'success' });
            reset();
            onRefresh();
            setOpenConfirm(false);
            onClose();
        } catch (error: any) {
            console.error(error);
            enqueueSnackbar(error?.message || 'Gửi yêu cầu thất bại', { variant: 'error' });
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
                <DialogTitle>Chuyển Goxu</DialogTitle>

                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <RHFAutocomplete
                                name="recipient"
                                label="Người nhận (Đối tác)"
                                options={filteredUsers}
                                getOptionLabel={(option: string | IUserAdmin) =>
                                    typeof option === 'string' ? option : `${option.full_name} - ${option.username}`
                                }
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.full_name}
                                    </li>
                                )}
                            />

                            <RHFTextField
                                name="amount"
                                label="Số Goxu muốn chuyển"
                                type="number"
                                placeholder="0"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Goxu</InputAdornment>,
                                }}
                            />
                        </Stack>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={onClose} variant="outlined" color="inherit">
                            Hủy
                        </Button>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Tiếp tục
                        </LoadingButton>
                    </DialogActions>
                </FormProvider>
            </Dialog>

            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                title="Xác nhận chuyển Goxu"
                content={
                    <>
                        Bạn có chắc chắn muốn chuyển <strong>{fPoint(formData?.amount || 0)}</strong> cho đối tác <strong>{formData?.recipient?.full_name}</strong> không?
                    </>
                }
                action={
                    <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={isSubmitting}
                        onClick={handleConfirmTransfer}
                    >
                        Xác nhận
                    </LoadingButton>
                }
            />
        </>
    );
}
