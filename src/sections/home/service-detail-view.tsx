import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

// Mock Data (Shared/Duplicated for now)
const MOCK_SERVICE_POINTS = [
    {
        id: '1',
        name: 'Nhà hàng Biển Đông',
        address: '123 Đường ABC, Hoàn Kiếm, Hà Nội',
        type: 'Restaurant',
        description: 'Nhà hàng hải sản tươi sống với không gian sang trọng.',
        coverUrl: 'https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_1.jpg',
        promotions: [
            { title: 'Giảm 10% cho hóa đơn trên 1tr', validUntil: '30/12/2025' },
            { title: 'Tặng món tráng miệng', validUntil: 'Always' },
        ]
    },
    {
        id: '2',
        name: 'Cafe Trung Nguyên',
        address: '456 Đường XYZ, Đống Đa, Hà Nội',
        type: 'Cafe',
        description: 'Không gian cafe yên tĩnh, thích hợp làm việc.',
        coverUrl: 'https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_2.jpg',
        promotions: [
            { title: 'Mua 1 tặng 1 khung giờ vàng', validUntil: '30/12/2025' },
        ]
    },
    {
        id: '3',
        name: 'Khách sạn Metropole',
        address: '15 Ngô Quyền, Hoàn Kiếm, Hà Nội',
        type: 'Hotel',
        description: 'Khách sạn 5 sao đẳng cấp quốc tế.',
        coverUrl: 'https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_3.jpg',
        promotions: []
    },
];

export default function ServiceDetailView() {
    const { id } = useParams();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);

    const service = MOCK_SERVICE_POINTS.find((item) => item.id === id);

    const handleBookRide = () => {
        // Future implementation
        alert('Tính năng Đặt xe đang được phát triển!');
    };

    const handleBack = () => {
        router.push(paths.dashboard.root);
    };

    if (!service) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h3">Không tìm thấy dịch vụ</Typography>
                <Button onClick={handleBack} sx={{ mt: 2 }}>
                    Quay lại bản đồ
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            {/* Back Button */}
            <Button
                startIcon={<Iconify icon="eva:arrow-back-fill" />}
                onClick={handleBack}
                sx={{ mb: 3 }}
            >
                Quay lại
            </Button>

            <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Image */}
                <Box sx={{ width: { xs: 1, md: 0.5 }, position: 'relative' }}>
                    <Image alt={service.name} src={service.coverUrl} ratio="1/1" />
                </Box>

                {/* Content */}
                <Stack spacing={3} sx={{ p: 3, width: { xs: 1, md: 0.5 } }}>
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
                        {service.description}
                    </Typography>

                    <TextField
                        fullWidth
                        label="Số lượng khách"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        sx={{ mb: 3 }}
                    />

                    <Grid container spacing={2}>
                        <Grid xs={12}>
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                onClick={() => {
                                    alert(`Bắt đầu chuyến đi với ${quantity} khách đến ${service.name}`);
                                    // Logic to start trip would go here
                                }}
                                startIcon={<Iconify icon="eva:car-fill" />}
                            >
                                Chọn làm điểm đến
                            </Button>
                        </Grid>
                    </Grid>
                </Stack>
            </Card>
        </Container>
    );
}
