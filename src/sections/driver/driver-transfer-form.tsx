import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useAdmin } from 'src/hooks/api/use-admin';
import { useWallet } from 'src/hooks/api/use-wallet';

import { fPoint } from 'src/utils/format-number';

import { useAuthContext } from 'src/auth/hooks';

import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IUserAdmin } from 'src/types/user';

// ----------------------------------------------------------------------

type FormValues = {
    recipient?: IUserAdmin | null;
    amount: number;
};

type Props = {
    currentBalance: number;
    onRefresh: () => void;
};

export default function DriverTransferForm({ currentBalance, onRefresh }: Props) {
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
        } catch (error: any) {
            console.error(error);
            enqueueSnackbar(error?.message || 'Gửi yêu cầu thất bại', { variant: 'error' });
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
                <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>{fPoint(currentBalance)}</Typography>
            </Box>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    <RHFAutocomplete
                        name="recipient"
                        label="Người nhận"
                        options={filteredUsers}
                        noOptionsText="Không tìm thấy"
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

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting} size="large">
                        Tiếp tục
                    </LoadingButton>
                </Stack>
            </FormProvider>

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
        </Card>
    );
}
