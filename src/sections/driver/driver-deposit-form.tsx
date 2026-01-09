import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import InputAdornment from '@mui/material/InputAdornment';
import { alpha, useTheme } from '@mui/material/styles';

import { fNumber, fCurrency } from 'src/utils/format-number';

import FormProvider, { RHFTextField, RHFUpload } from 'src/components/hook-form';
import { CustomFile } from 'src/components/upload';
import { useWallet } from 'src/hooks/api/use-wallet';
import { useAdmin } from 'src/hooks/api/use-admin';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

const PRESET_AMOUNTS = [200, 500, 1000, 2000, 5000, 10000];

type FormValues = {
    amount: number;
    receipt?: CustomFile | string | null;
};

export default function DriverDepositForm({ onRefresh }: { onRefresh: () => void }) {
    const theme = useTheme();
    const [amount, setAmount] = useState<number>(500);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [formData, setFormData] = useState<FormValues | null>(null);

    const { enqueueSnackbar } = useSnackbar();
    const { useGetVietQR, partnerDepositWallet } = useWallet();
    const { user } = useAuthContext();
    const { useGetUser } = useAdmin();
    const { user: userData } = useGetUser(user?.id);

    // Use partner profile data for name if available, fallback to full name
    const depositorName = userData?.partnerProfile?.full_name || userData?.full_name || '';

    const DepositSchema = Yup.object().shape({
        amount: Yup.number()
            .required('Vui lòng nhập số Goxu')
            .min(10, 'Tối thiểu 10 GoXu (10.000đ)')
            .max(1000000, 'Tối đa 1.000.000 GoXu'),
        receipt: Yup.mixed<any>().nullable().required('Vui lòng tải lên ảnh biên lai'),
    });

    const methods = useForm<FormValues>({
        defaultValues: {
            amount: 500,
            receipt: null,
        },
        resolver: yupResolver(DepositSchema),
    });

    const { setValue, watch, handleSubmit, control, reset, formState: { isSubmitting } } = methods;
    const watchAmount = watch('amount');

    const qrContent = `${depositorName ? depositorName + ' ' : ''}CK ${fCurrency((watchAmount || 0) * 1000) || 0}`.trim();
    const { qrData, qrLoading } = useGetVietQR(watchAmount || 0, qrContent);

    const handlePresetClick = (val: number) => {
        setValue('amount', val);
        setAmount(val);
    };

    const onSubmit = handleSubmit(async (data) => {
        setFormData(data);
        setOpenConfirm(true);
    });

    const handleConfirmDeposit = async () => {
        if (!formData) return;
        try {
            await partnerDepositWallet(formData.amount, formData.receipt as File);
            enqueueSnackbar('Yêu cầu của bạn đã được gửi đi!', { variant: 'success' });
            reset();
            onRefresh();
            setOpenConfirm(false);
            setAmount(500);
        } catch (error: any) {
            console.error(error);
            enqueueSnackbar(error?.message || 'Gửi yêu cầu thất bại', { variant: 'error' });
        }
    };

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
                            <Controller
                                name="amount"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Số Goxu muốn nạp"
                                        fullWidth
                                        value={field.value ? Number(field.value).toLocaleString('en-US') : ''}
                                        onChange={(event) => {
                                            const value = event.target.value.replace(/,/g, '');
                                            if (/^\d*$/.test(value)) {
                                                field.onChange(Number(value));
                                            }
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Goxu</InputAdornment>,
                                        }}
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
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

                            <LoadingButton
                                type="submit"
                                variant="contained"
                                size="large"
                                color="primary"
                                loading={isSubmitting}
                                sx={{ mt: 2 }}
                            >
                                Xác nhận nạp {fNumber(watchAmount || 0)} GoXu
                            </LoadingButton>
                        </Stack>
                    </FormProvider>
                </Card>
            </Grid>

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

                        {qrLoading ? (
                            <Skeleton variant="rounded" width="100%" height={500} />
                        ) : qrData ? (
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                    boxShadow: theme.customShadows.z8,
                                    minHeight: 180,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Box component="img" src={qrData} sx={{ width: '100%', height: 'auto' }} />
                            </Box>
                        ) : (
                            <Box sx={{ height: 180, width: '100%', bgcolor: 'grey.200' }} />
                        )}

                        <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            Quét mã QR bằng ứng dụng ngân hàng
                        </Typography>

                        <Divider sx={{ width: '100%', borderStyle: 'dashed', my: 2 }} />

                        <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Chủ tài khoản</Typography>
                            <Typography variant="subtitle2">CONG TY CO PHAN TRUYEN THONG NEXTVIEW</Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Số tài khoản</Typography>
                            <Typography variant="subtitle2">9180 1802 783</Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Ngân hàng</Typography>
                            <Typography variant="subtitle2">TPBank CN Cần Thơ</Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Nội dung CK</Typography>
                            <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>{qrContent}</Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Số tiền thanh toán</Typography>
                            <Typography variant="subtitle2" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                {fCurrency((watchAmount || 0) * 1000)}
                            </Typography>
                        </Stack>

                        <Divider sx={{ width: '100%', borderStyle: 'dashed', my: 2 }} />

                        <Stack direction="row" justifyContent="space-between" width="100%">
                            <Typography variant="subtitle1">Quy đổi:</Typography>
                            <Typography variant="h4" color="success.main">{fNumber(watchAmount || 0)} GoXu</Typography>
                        </Stack>
                    </Stack>
                </Card>
            </Grid>

            <ConfirmDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                title="Xác nhận nạp tiền"
                content={
                    <>
                        Bạn có chắc chắn muốn nạp <strong>{fNumber(formData?.amount || 0)} Goxu</strong> với số tiền thanh toán là <strong>{fCurrency((formData?.amount || 0) * 1000)}</strong> không?
                    </>
                }
                action={
                    <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={isSubmitting}
                        onClick={handleConfirmDeposit}
                    >
                        Xác nhận
                    </LoadingButton>
                }
            />
        </Grid >
    );
}
