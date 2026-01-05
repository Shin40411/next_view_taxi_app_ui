import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';

import { fPoint } from 'src/utils/format-number';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: VoidFunction;
    currentBalance: number;
    bankInfo: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    } | null;
};

export default function WithdrawRequestDialog({ open, onClose, currentBalance, bankInfo }: Props) {
    const WithdrawSchema = Yup.object().shape({
        amount: Yup.number()
            .required('Vui lòng nhập số điểm')
            .min(50, 'Số điểm rút tối thiểu là 50 GoXu')
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
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.info('DATA', data);
            alert(`Đã gửi yêu cầu rút ${fPoint(data.amount)} về tài khoản ${bankInfo?.accountNumber}`);
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Yêu cầu rút ví</DialogTitle>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <RHFTextField
                            name="amount"
                            label="Số Goxu muốn rút"
                            type="number"
                            helperText="Tối thiểu 50 GoXu"
                            placeholder="0"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">GoXu</InputAdornment>,
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
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} variant="outlined" color="inherit">
                        Hủy
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Gửi yêu cầu
                    </LoadingButton>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
}
