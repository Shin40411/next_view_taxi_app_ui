import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { MuiOtpInput } from 'mui-one-time-password-input';

import { useSnackbar } from 'notistack';
import { useContract } from 'src/hooks/api/use-contract';

// ----------------------------------------------------------------------

type Props = {
    phoneNumber: string;
    onConfirm: (otp: string) => void;
    onBack: () => void;
};

export default function ContractOtp({ phoneNumber, onConfirm, onBack }: Props) {
    const [otp, setOtp] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const { verifyContractOtp } = useContract();

    const handleConfirm = async () => {
        try {
            await verifyContractOtp(otp);
            enqueueSnackbar('Xác thực thành công!', { variant: 'success' });
            onConfirm(otp);
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Mã OTP không chính xác hoặc đã hết hạn', { variant: 'error' });
        }
    };

    return (
        <Card sx={{ my: 3, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" textAlign="center">
                    Vui lòng nhập mã xác thực đã được gửi qua zalo theo số điện thoại <b>{phoneNumber}</b>
                </Typography>

                <MuiOtpInput value={otp} onChange={setOtp} length={6} />

                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" color="inherit" onClick={onBack}>
                        Quay lại
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleConfirm} disabled={otp.length < 6}>
                        Xác nhận
                    </Button>
                </Stack>
            </Box>
        </Card>
    );
}
