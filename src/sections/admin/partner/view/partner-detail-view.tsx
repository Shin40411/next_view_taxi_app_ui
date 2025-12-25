import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import { fPoint } from 'src/utils/format-number';

import { useAdmin } from 'src/hooks/api/use-admin';
import { ASSETS_API, HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

export default function PartnerDetailView() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const { useGetUser } = useAdmin();
    const { user: partner, userLoading } = useGetUser(id);

    const [currentTab, setCurrentTab] = useState('profile');

    const getFullImageUrl = (path: string | undefined) => {
        if (!path) return '';
        const normalizedPath = path.replace(/\\/g, '/');
        return path.startsWith('http') ? path : `${ASSETS_API}/${normalizedPath}`;
    };

    const slides = [
        { src: getFullImageUrl(partner?.partnerProfile?.id_card_front) },
        { src: getFullImageUrl(partner?.partnerProfile?.id_card_back) },
    ];

    const lightbox = useLightBox(slides);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    const handleBack = () => {
        router.push(paths.dashboard.admin.partners.root);
    };

    if (userLoading || !partner) {
        return (
            <Container maxWidth="lg" sx={{ mt: 5 }}>
                <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
                    <Skeleton variant="rounded" width={120} height={36} />
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
                    <Skeleton variant="text" width={200} height={40} />
                    <Stack direction="row" spacing={1}>
                        <Skeleton variant="rounded" width={80} height={36} />
                        <Skeleton variant="rounded" width={80} height={36} />
                        <Skeleton variant="rounded" width={120} height={36} />
                    </Stack>
                </Stack>

                <Grid container spacing={3}>
                    <Grid xs={12} md={4}>
                        <Card sx={{ pt: 4, pb: 3, px: 3, textAlign: 'center' }}>
                            <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} />
                            <Skeleton variant="rounded" width={80} height={24} sx={{ mx: 'auto', mb: 2 }} />
                            <Skeleton variant="text" width={100} sx={{ mx: 'auto', mb: 1 }} />

                            <Stack direction="row" sx={{ mt: 3, mb: 2 }} justifyContent="space-between">
                                <Skeleton variant="rectangular" width={60} height={40} />
                                <Skeleton variant="rectangular" width={60} height={40} />
                                <Skeleton variant="rectangular" width={60} height={40} />
                            </Stack>

                            <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

                            <Stack spacing={2}>
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </Stack>
                        </Card>
                    </Grid>

                    <Grid xs={12} md={8}>
                        <Card>
                            <Skeleton variant="rectangular" width="100%" height={48} />
                            <Box sx={{ p: 3 }}>
                                <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
                                <Stack direction="row" spacing={3}>
                                    <Skeleton variant="rectangular" width="48%" height={200} sx={{ borderRadius: 1 }} />
                                    <Skeleton variant="rectangular" width="48%" height={200} sx={{ borderRadius: 1 }} />
                                </Stack>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
                <Button
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    variant='contained'
                    startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                >
                    Quay lại
                </Button>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
                <Typography variant="h4">{partner.full_name}</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                        onClick={() => alert('Đã duyệt tài khoản!')}
                    >
                        Duyệt
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<Iconify icon="eva:slash-fill" />}
                        onClick={() => alert('Đã khóa tài khoản!')}
                    >
                        Khóa
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Iconify icon="eva:lock-fill" />}
                        onClick={() => alert('Đã reset mật khẩu!')}
                    >
                        Đổi mật khẩu
                    </Button>
                </Stack>
            </Stack>

            <Grid container spacing={3}>
                {/* Profile Info */}
                <Grid xs={12} md={4}>
                    <Card sx={{ pt: 4, pb: 3, px: 3, textAlign: 'center' }}>
                        <Avatar
                            alt={partner.full_name}
                            src=""
                            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                        >
                            {partner.full_name.charAt(0).toUpperCase()}
                        </Avatar>

                        <Chip
                            label={partner.partnerProfile?.is_online ? 'Trực tuyến' : 'Ngoại tuyến'}
                            color={partner.partnerProfile?.is_online ? 'success' : 'default'}
                            variant="soft"
                            sx={{ mb: 2 }}
                        />

                        <Stack direction="row" sx={{ mt: 3, mb: 2 }}>
                            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                {/* Placeholder for rating - API mismatch */}
                                <Typography variant="h6">5.0</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Đánh giá</Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                {/* Placeholder for total trips - API mismatch */}
                                <Typography variant="h6">0</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Chuyến</Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ color: 'warning.main' }}>
                                    {fPoint(partner.partnerProfile?.wallet_balance || 0)}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Điểm thưởng</Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ borderStyle: 'dashed' }} />

                        <Box sx={{ py: 3, textAlign: 'left' }}>
                            <Stack spacing={2}>
                                <Stack direction="row">
                                    <Iconify icon="eva:person-fill" width={20} sx={{ mr: 2, color: 'text.disabled' }} />
                                    <Typography variant="body2">{partner.full_name}</Typography>
                                </Stack>
                                <Stack direction="row">
                                    <Iconify icon="eva:phone-fill" width={20} sx={{ mr: 2, color: 'text.disabled' }} />
                                    <Typography variant="body2">{partner.username}</Typography>
                                </Stack>
                                <Stack direction="row">
                                    <Iconify icon="eva:car-fill" width={20} sx={{ mr: 2, color: 'text.disabled' }} />
                                    <Typography variant="body2">{partner.partnerProfile?.vehicle_plate || '---'}</Typography>
                                </Stack>
                            </Stack>
                        </Box>
                    </Card>
                </Grid>

                {/* ID Cards & Tabs */}
                <Grid xs={12} md={8}>
                    <Card>
                        <Tabs
                            value={currentTab}
                            onChange={handleChangeTab}
                            sx={{
                                px: 3,
                                boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.palette.divider}`,
                            }}
                        >
                            <Tab value="profile" label="Hồ sơ & CCCD" />
                            <Tab value="trips" label="Lịch sử chuyến đi" />
                            {/* <Tab value="wallet" label="Lịch sử điểm thưởng" /> */}
                        </Tabs>

                        <Divider />

                        <Box sx={{ p: 3 }}>
                            {currentTab === 'profile' && (
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 2 }}>Ảnh CCCD / Giấy tờ</Typography>
                                    <Grid container spacing={3}>
                                        <Grid xs={12} md={6}>
                                            <Typography variant="caption" display="block" sx={{ mb: 1, color: 'text.secondary' }}>Mặt trước</Typography>
                                            <Box
                                                component="img"
                                                alt="CCCD Front"
                                                src={getFullImageUrl(partner.partnerProfile?.id_card_front)}
                                                onClick={() => lightbox.onOpen(getFullImageUrl(partner.partnerProfile?.id_card_front))}
                                                sx={{ width: 1, height: 200, objectFit: 'cover', borderRadius: 1, bgcolor: 'grey.200', cursor: 'pointer' }}
                                            />
                                        </Grid>
                                        <Grid xs={12} md={6}>
                                            <Typography variant="caption" display="block" sx={{ mb: 1, color: 'text.secondary' }}>Mặt sau</Typography>
                                            <Box
                                                component="img"
                                                alt="CCCD Back"
                                                src={getFullImageUrl(partner.partnerProfile?.id_card_back)}
                                                onClick={() => lightbox.onOpen(getFullImageUrl(partner.partnerProfile?.id_card_back))}
                                                sx={{ width: 1, height: 200, objectFit: 'cover', borderRadius: 1, bgcolor: 'grey.200', cursor: 'pointer' }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Lightbox
                                        open={lightbox.open}
                                        close={lightbox.onClose}
                                        index={lightbox.selected}
                                        slides={slides}
                                    />
                                </Box>
                            )}

                            {currentTab === 'trips' && (
                                // Placeholder for Trip History - No data in API response yet
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Chưa có dữ liệu lịch sử chuyến đi.</Typography>
                            )}

                            {/* {currentTab === 'wallet' && (
                                // Placeholder for Wallet History - No data in API response yet
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Chưa có dữ liệu lịch sử ví.</Typography>
                            )} */}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
