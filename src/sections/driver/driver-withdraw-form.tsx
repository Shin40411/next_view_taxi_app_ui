import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { fPoint } from 'src/utils/format-number';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useWallet } from 'src/hooks/api/use-wallet';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

type Props = {
    currentBalance: number;
    bankInfo: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    } | null;
    onRefresh: VoidFunction;
};

export default function DriverWithdrawForm({ currentBalance, bankInfo, onRefresh }: Props) {
    const { partnerWithdrawWallet } = useWallet();
    const { enqueueSnackbar } = useSnackbar();
    const confirm = useBoolean();
    const [withdrawData, setWithdrawData] = useState<{ amount: number } | null>(null);

    const WithdrawSchema = Yup.object().shape({
        amount: Yup.number()
            .required('Vui lòng nhập số điểm')
            .min(50, 'Số điểm rút tối thiểu là 50 Goxu')
            .max(currentBalance, 'Số dư không đủ')
            .typeError('Vui lòng nhập số hợp lệ'),
    });

    const defaultValues = {
        amount: 0,
    };

    const methods = useForm({
        resolver: yupResolver(WithdrawSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data: typeof defaultValues) => {
        if (!bankInfo) {
            enqueueSnackbar('Vui lòng cập nhật thông tin ngân hàng', { variant: 'error' });
            return;
        }
        setWithdrawData(data);
        confirm.onTrue();
    };

    const handleConfirmWithdraw = async () => {
        if (!withdrawData) return;
        try {
            await partnerWithdrawWallet(withdrawData.amount);
            enqueueSnackbar(`Đã gửi yêu cầu rút ${fPoint(withdrawData.amount)} Goxu thành công`, { variant: 'success' });
            reset();
            confirm.onFalse();
            onRefresh();
        } catch (error: any) {
            console.error(error);
            enqueueSnackbar(error?.message || 'Gửi yêu cầu thất bại', { variant: 'error' });
        }
    };

    return (
        <Card sx={{ p: 3, maxWidth: 600, mx: 'auto', mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Yêu cầu rút ví</Typography>

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
                    <RHFTextField
                        name="amount"
                        label="Số Goxu muốn rút"
                        type="number"
                        helperText="Tối thiểu 50 Goxu"
                        placeholder="0"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">Goxu</InputAdornment>,
                        }}
                    />

                    <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Thông tin nhận tiền
                        </Typography>
                        {bankInfo ? (
                            <Stack spacing={0.5}>
                                <Typography variant="body2">{bankInfo.bankName}</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    {bankInfo.accountNumber}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {bankInfo.accountName}
                                </Typography>
                            </Stack>
                        ) : (
                            <Typography variant="caption" color="error">
                                Chưa có thông tin ngân hàng
                            </Typography>
                        )}
                    </Box>

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting} size="large">
                        Gửi yêu cầu
                    </LoadingButton>
                </Stack>
            </FormProvider>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Xác nhận rút tiền"
                content={
                    <>
                        Bạn có chắc chắn muốn rút <strong>{fPoint(withdrawData?.amount || 0)} Goxu</strong> về tài khoản{' '}
                        <strong>{bankInfo?.accountNumber} ({bankInfo?.bankName})</strong> không?
                    </>
                }
                action={
                    <Button variant="contained" color="primary" onClick={handleConfirmWithdraw}>
                        Xác nhận
                    </Button>
                }
            />
        </Card>
    );
}
