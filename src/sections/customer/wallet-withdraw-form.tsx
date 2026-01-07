import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';

import { fNumber, fCurrency } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { useAdmin } from 'src/hooks/api/use-admin';
import { IUserAdmin } from 'src/types/user';
import { useWallet } from 'src/hooks/api/use-wallet';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

type FormValues = {
    recipient: IUserAdmin | null;
    amount: number;
};

export default function WalletWithdrawForm({ currentBalance, onRefreshUser }: { currentBalance: string, onRefreshUser: () => void }) {
    const theme = useTheme();
    const { useGetUsers } = useAdmin();
    const { users } = useGetUsers('PARTNER', 1, 100);
    const { customerTransferWallet } = useWallet();
    const { enqueueSnackbar } = useSnackbar();

    const [openConfirm, setOpenConfirm] = useState(false);
    const [formData, setFormData] = useState<FormValues | null>(null);

    const TransferSchema = Yup.object().shape({
        recipient: Yup.mixed<IUserAdmin>().required('Vui lòng chọn người nhận').nullable(),
        amount: Yup.number()
            .required('Vui lòng nhập số GoXu')
            .min(10, 'Giới hạn chuyển tối thiểu là 10 GoXu')
    });

    const methods = useForm<FormValues>({
        defaultValues: {
            recipient: null,
            amount: 0,
        },
        resolver: yupResolver(TransferSchema),
    });

    const { handleSubmit, watch, setValue, reset, formState: { isSubmitting } } = methods;
    const watchAmount = watch('amount');

    const onSubmit = handleSubmit(async (data) => {
        setFormData(data);
        setOpenConfirm(true);
    });

    const handleConfirmTransfer = async () => {
        if (!formData?.recipient) return;
        try {
            await customerTransferWallet(formData.recipient.id, formData.amount);
            enqueueSnackbar('Chuyển Goxu thành công!', { variant: 'success' });
            reset();
            onRefreshUser();
            setOpenConfirm(false);
        } catch (error: any) {
            console.error(error);
            enqueueSnackbar(error?.message || 'Chuyển Goxu thất bại', { variant: 'error' });
        }
    };

    return (
        <Card sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Chuyển Goxu</Typography>

            <Box
                sx={{
                    mb: 3,
                    p: 2,
                    bgcolor: 'background.neutral',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Số dư khả dụng:</Typography>
                <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>{currentBalance}</Typography>
            </Box>

            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Stack spacing={3}>
                    <RHFAutocomplete
                        name="recipient"
                        label="Người nhận (Đối tác)"
                        options={users}
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
                        label="Số GoXu muốn chuyển"
                        type="number"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">GoXu</InputAdornment>,
                        }}
                        helperText="1 GoXu = 1000 VND."
                    />

                    <LoadingButton
                        type="submit"
                        variant="contained"
                        size="large"
                        color="inherit"
                        loading={isSubmitting}
                        disabled={!watchAmount || watchAmount <= 0}
                    >
                        Chuyển ngay
                    </LoadingButton>
                </Stack>
            </FormProvider>

            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                title="Xác nhận chuyển Goxu"
                content={
                    <>
                        Bạn có chắc chắn muốn chuyển <strong>{fNumber(formData?.amount || 0)} GoXu</strong> cho đối tác <strong>{formData?.recipient?.full_name}</strong> không?
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
        </Card>
    );
}
