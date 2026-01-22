import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { fNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    amount: number;
    driverName: string;
    driverAvatar?: string;
};

export default function TransferQrDialog({ open, onClose, amount, driverName, driverAvatar }: Props) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                Quét mã để thanh toán
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3} alignItems="center" sx={{ pb: 3 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                        Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR bên dưới
                    </Typography>

                    {/* QR Code Placeholder */}
                    <Box
                        sx={{
                            width: 240,
                            height: 240,
                            bgcolor: 'common.white',
                            borderRadius: 2,
                            p: 2,
                            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Replace with actual QR generation logic/image later */}
                        <Box
                            component="img"
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TRANSFER:${amount}:${driverName}`}
                            alt="QR Code"
                            sx={{ width: '100%', height: '100%' }}
                        />
                    </Box>

                    <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%', bgcolor: 'background.neutral', p: 2, borderRadius: 1 }}>
                        <Avatar src={driverAvatar} alt={driverName} />
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle2">{driverName}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Tài xế</Typography>
                        </Box>
                        <Typography variant="h6" sx={{ color: 'primary.main' }}>
                            {fNumber(amount)} đ
                        </Typography>
                    </Stack>

                    <Button variant="outlined" fullWidth onClick={onClose}>
                        Đóng
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
