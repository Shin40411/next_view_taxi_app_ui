import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { alpha, useTheme } from '@mui/material/styles';

import { fNumber, fCurrency } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFUpload } from 'src/components/hook-form';
import { CustomFile } from 'src/components/upload';

// ----------------------------------------------------------------------

const PRESET_AMOUNTS = [200000, 500000, 1000000, 2000000, 5000000, 10000000];

type FormValues = {
    amount: number;
    receipt?: CustomFile | string | null;
};

export default function WalletDepositForm() {
    const theme = useTheme();
    const [amount, setAmount] = useState<number>(500000);

    const DepositSchema = Yup.object().shape({
        amount: Yup.number().required('Amount is required').min(10000, 'Tối thiểu 10,000đ'),
        receipt: Yup.mixed<any>().nullable().required('Vui lòng tải lên ảnh biên lai'),
    });

    const methods = useForm<FormValues>({
        defaultValues: {
            amount: 500000,
            receipt: null,
        },
        resolver: yupResolver(DepositSchema),
    });

    const { setValue, watch, handleSubmit } = methods;
    const watchAmount = watch('amount');

    const handlePresetClick = (val: number) => {
        setValue('amount', val);
        setAmount(val);
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            console.info('DATA', data);
            // Submit data
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <Grid container spacing={3} mb={3}>
            {/* LEFT COLUMN: INPUT */}
            <Grid xs={12} md={7}>
                <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>Chọn mệnh giá nạp</Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                        {PRESET_AMOUNTS.map((val) => (
                            <Button
                                key={val}
                                variant={watchAmount === val ? 'contained' : 'outlined'}
                                color={watchAmount === val ? 'primary' : 'inherit'}
                                onClick={() => handlePresetClick(val)}
                                sx={{ py: 2, borderRadius: 1.5, typography: 'subtitle1' }}
                            >
                                {fNumber(val)}
                            </Button>
                        ))}
                    </Box>

                    <Divider sx={{ mb: 3, borderStyle: 'dashed' }}>Hoặc nhập khác</Divider>

                    <FormProvider methods={methods} onSubmit={onSubmit}>
                        <Stack spacing={3}>
                            <RHFTextField
                                name="amount"
                                label="Số GoXu muốn nạp"
                                type="number"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">GoXu</InputAdornment>,
                                }}
                                onChange={(e) => {
                                    setValue('amount', Number(e.target.value));
                                }}
                            />

                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Tải lên biên lai chuyển khoản</Typography>
                                <RHFUpload
                                    name="receipt"
                                    maxSize={3145728}
                                    onDrop={(acceptedFiles) => {
                                        const file = acceptedFiles[0];
                                        const newFile = Object.assign(file, {
                                            preview: URL.createObjectURL(file),
                                        });
                                        setValue('receipt', newFile, { shouldValidate: true });
                                    }}
                                />
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                color="primary"
                                sx={{ mt: 2 }}
                            >
                                Xác nhận nạp {fNumber(watchAmount || 0)} GoXu
                            </Button>
                        </Stack>
                    </FormProvider>
                </Card>
            </Grid>

            {/* RIGHT COLUMN: INVOICE/QR */}
            <Grid xs={12} md={5}>
                <Card
                    sx={{
                        p: 3,
                        height: '100%',
                        backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.success.lighter, 0.4)} 0%, ${alpha(theme.palette.success.light, 0.1)} 100%)`,
                        border: `1px dashed ${theme.palette.success.main}`,
                    }}
                >
                    <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: 'success.darker', mb: 2 }}>THÔNG TIN CHUYỂN KHOẢN</Typography>

                        <Box
                            sx={{
                                p: 2,
                                bgcolor: 'white',
                                borderRadius: 2,
                                boxShadow: theme.customShadows.z8
                            }}
                        >
                            <Box
                                component="img"
                                src="https://api-prod-minimal-v510.vercel.app/assets/images/payment/payment-method.png"
                                sx={{ width: 180, height: 180, objectFit: 'contain' }}
                            />
                        </Box>

                        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            Quét mã QR bằng ứng dụng ngân hàng
                        </Typography>

                        <Divider sx={{ width: '100%', borderStyle: 'dashed', my: 2 }} />

                        <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Chủ tài khoản</Typography>
                            <Typography variant="subtitle2">CÔNG TY GOXU.VN</Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Số tài khoản</Typography>
                            <Typography variant="subtitle2">1900 1234 5678</Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Ngân hàng</Typography>
                            <Typography variant="subtitle2">Techcombank</Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Nội dung CK</Typography>
                            <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>NAP {watchAmount || 0} GOXU</Typography>
                        </Stack>

                        <Divider sx={{ width: '100%', borderStyle: 'dashed', my: 2 }} />

                        <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="subtitle1">Quy đổi:</Typography>
                            <Typography variant="h4" color="success.main">{fNumber(watchAmount || 0)} GoXu</Typography>
                        </Stack>
                    </Stack>
                </Card>
            </Grid>
        </Grid>
    );
}
