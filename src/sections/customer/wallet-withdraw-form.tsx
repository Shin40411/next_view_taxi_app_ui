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

import { fNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type FormValues = {
    amount: number;
};

export default function WalletWithdrawForm() {
    const theme = useTheme();
    const currentBalance = 1500000; // Mock balance

    const WithdrawSchema = Yup.object().shape({
        amount: Yup.number()
            .required('Vui lòng nhập số GoXu')
            .min(50000, 'Giới hạn rút tối thiểu là 50,000 GoXu')
            .max(currentBalance, 'Số dư không đủ'),
    });

    const methods = useForm<FormValues>({
        defaultValues: {
            amount: 0,
        },
        resolver: yupResolver(WithdrawSchema),
    });

    const { handleSubmit, watch, setValue } = methods;
    const watchAmount = watch('amount');

    const onSubmit = handleSubmit(async (data) => {
        try {
            console.info('WITHDRAW DATA', data);
            // Submit withdraw request
            alert(`Đã gửi yêu cầu rút ${fNumber(data.amount)} GoXu`);
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <Card sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Yêu cầu rút tiền</Typography>

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
                <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>{fNumber(currentBalance)} GoXu</Typography>
            </Box>

            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Stack spacing={3}>
                    <RHFTextField
                        name="amount"
                        label="Số GoXu muốn rút"
                        type="number"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">GoXu</InputAdornment>,
                        }}
                        helperText="1 GoXu = 1 VND. Thời gian xử lý: 24h."
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        color="inherit"
                        disabled={!watchAmount || watchAmount <= 0}
                    >
                        Gửi yêu cầu
                    </Button>
                </Stack>
            </FormProvider>
        </Card>
    );
}
