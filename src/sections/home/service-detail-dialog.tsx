import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    service: any; // Using any for now to match mock data structure flexibility
};

export default function ServiceDetailDialog({ open, onClose, service }: Props) {
    const [quantity, setQuantity] = useState(1);
    const smDown = useResponsive('down', 'sm');

    useEffect(() => {
        if (open) {
            setQuantity(1);
        }
    }, [open]);

    if (!service) return null;

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} fullScreen={smDown}>
            <Box sx={{ position: 'relative' }}>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 1,
                        bgcolor: 'common.white',
                        '&:hover': {
                            bgcolor: 'grey.300',
                        },
                    }}
                >
                    <Iconify icon="eva:close-fill" />
                </IconButton>

                <Stack direction={{ xs: 'column', md: 'row' }}>
                    {/* Image */}
                    <Box sx={{ width: { xs: 1, md: 0.5 }, position: 'relative' }}>
                        <Image
                            alt={service.name}
                            src={service.coverUrl || 'https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_1.jpg'}
                            ratio="1/1"
                        />
                    </Box>

                    {/* Content */}
                    <Stack spacing={3} sx={{ p: 3, width: { xs: 1, md: 0.5 }, pt: { xs: 6, md: 3 } }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                                {service.type}
                            </Typography>
                            <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
                                {service.name}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary' }}>
                                <Iconify icon="eva:pin-fill" width={16} />
                                <Typography variant="body2">{service.address}</Typography>
                            </Stack>
                        </Box>

                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                            {service.description || 'Chưa có mô tả cho địa điểm này.'}
                        </Typography>

                        <TextField
                            fullWidth
                            label="Số lượng khách"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />

                        <Box sx={{ flexGrow: 1 }} />

                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            onClick={() => {
                                alert(`Bắt đầu chuyến đi với ${quantity} khách đến ${service.name}`);
                                onClose();
                            }}
                            startIcon={<Iconify icon="eva:car-fill" />}
                        >
                            Chọn làm điểm đến
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Dialog>
    );
}
