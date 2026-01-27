import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useWallet } from 'src/hooks/api/use-wallet';
import { useGetPreviousPartners } from 'src/hooks/api/use-service-point';

import { fNumber } from 'src/utils/format-number';

import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IUserAdmin, IPreviousPartner } from 'src/types/user';

// ----------------------------------------------------------------------

type FormValues = {
    recipient: IUserAdmin | IPreviousPartner | null;
    amount: number;
};

export default function WalletWithdrawForm({ currentBalance, onRefreshUser }: { currentBalance: string, onRefreshUser: () => void }) {
    const theme = useTheme();
    const { partners } = useGetPreviousPartners();
    const { customerTransferWallet } = useWallet();
    const { enqueueSnackbar } = useSnackbar();

    const [openConfirm, setOpenConfirm] = useState(false);
    const [formData, setFormData] = useState<FormValues | null>(null);

    const TransferSchema = Yup.object().shape({
        recipient: Yup.mixed<IUserAdmin | IPreviousPartner>().required('Vui lòng chọn người nhận').nullable(),
        amount: Yup.number()
            .required('Vui lòng nhập số Goxu')
            .min(10, 'Giới hạn chuyển tối thiểu là 10 Goxu')
            .max(1000000, 'Tối đa 1.000.000 Goxu')
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
                        label="Người nhận"
                        noOptionsText="Không tìm thấy"
                        options={partners}
                        getOptionLabel={(option: string | IUserAdmin | IPreviousPartner) =>
                            typeof option === 'string' ? option : `${option.full_name} - BS: ${option.partnerProfile?.vehicle_plate}`
                        }
                        isOptionEqualToValue={(option, value) => {
                            if (typeof option === 'string' || typeof value === 'string') return option === value;
                            return option.id === value.id;
                        }}
                        renderOption={(props, option) => {
                            if (typeof option === 'string') {
                                return <li {...props} key={option}>{option}</li>;
                            }
                            return (
                                <li {...props} key={option.id}>
                                    {option.full_name} - BS: {option.partnerProfile?.vehicle_plate}
                                </li>
                            );
                        }}
                    />

                    <RHFTextField
                        name="amount"
                        label="Số Goxu muốn chuyển"
                        type="number"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">Goxu</InputAdornment>,
                        }}
                        helperText="1 Goxu = 1000 VND."
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
                        Bạn có chắc chắn muốn chuyển <strong>{fNumber(formData?.amount || 0)} Goxu</strong> cho đối tác <strong>{formData?.recipient?.full_name}</strong> không?
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
