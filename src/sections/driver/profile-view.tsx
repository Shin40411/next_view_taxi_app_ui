'use client';

import { useState } from 'react';

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
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useTheme, alpha } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { usePartner } from 'src/hooks/api/use-partner';

import Iconify from 'src/components/iconify';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import Carousel, { useCarousel, CarouselArrowIndex } from 'src/components/carousel';
import { fPoint } from 'src/utils/format-number';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAdmin } from 'src/hooks/api/use-admin';
import { ASSETS_API } from 'src/config-global';

import ProfileUpdateDialog from 'src/sections/driver/profile-update-dialog';
import PasswordChange from 'src/components/dialogs/password-change';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import CardContent from '@mui/material/CardContent';

import { useContract } from 'src/hooks/api/use-contract';
import ContractPreview from 'src/sections/contract/contract-preview';
import { getFullImageUrl } from 'src/utils/get-image';

// ----------------------------------------------------------------------

export default function DriverProfileView() {
    const settings = useSettingsContext();
    const { user: authUser } = useAuthContext();

    const { useGetUser } = useAdmin();

    const { user: partner, userLoading, userMutate } = useGetUser(authUser?.id);

    const { useGetHomeStats } = usePartner();
    const { homeStats } = useGetHomeStats();

    const { useGetMyContract } = useContract();
    const { contract } = useGetMyContract();

    const updateProfile = useBoolean();

    const [currentTab, setCurrentTab] = useState('profile');



    const slides = [
        { src: getFullImageUrl(partner?.partnerProfile?.id_card_front) },
        { src: getFullImageUrl(partner?.partnerProfile?.id_card_back) },
        { src: getFullImageUrl(partner?.partnerProfile?.driver_license_front) },
        { src: getFullImageUrl(partner?.partnerProfile?.driver_license_back) },
    ];

    const lightbox = useLightBox(slides);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    if (userLoading || !partner) {
        return (
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
                    <Skeleton variant="text" width={200} height={40} />
                </Stack>

                <Grid container spacing={3}>
                    <Grid xs={12} md={4}>
                        <Card sx={{ pt: 4, pb: 3, px: 3, textAlign: 'center' }}>
                            <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} />
                            <Skeleton variant="rounded" width={80} height={24} sx={{ mx: 'auto', mb: 2 }} />
                            <Skeleton variant="text" width={100} sx={{ mx: 'auto', mb: 1 }} />
                            <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
                            <Stack spacing={2}>
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
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Hồ sơ tài xế"
                links={[
                    { name: 'Tài xế', href: paths.dashboard.driver.root },
                    { name: 'Hồ sơ' },
                ]}
                sx={{
                    my: { xs: 3, md: 5 },
                }}
            />

            <Grid container spacing={3}>
                {/* Profile Info */}
                <Grid xs={12} md={4}>
                    <Card sx={{ pt: 4, pb: 3, px: 3, textAlign: 'center' }}>
                        <Avatar
                            alt={partner.full_name}
                            src={getFullImageUrl(partner.avatarUrl || (partner as any).avatar)}
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
                            {/* <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Typography variant="h6">5.0</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Đánh giá</Typography>
                            </Box> */}
                            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Typography variant="h6">{homeStats?.total_trips || 0}</Typography>
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
                                {partner.role !== 'INTRODUCER' && (
                                    <Stack direction="row">
                                        <Iconify icon="eva:car-fill" width={20} sx={{ mr: 2, color: 'text.disabled' }} />
                                        <Typography variant="body2">{partner.partnerProfile?.vehicle_plate || '---'}</Typography>
                                    </Stack>
                                )}
                            </Stack>
                        </Box>

                        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<Iconify icon="solar:pen-bold" />}
                                onClick={updateProfile.onTrue}
                            >
                                Cập nhật hồ sơ
                            </Button>
                        </Stack>
                    </Card>

                    <ProfileUpdateDialog
                        open={updateProfile.value}
                        onClose={updateProfile.onFalse}
                        currentUser={partner}
                        onUpdate={userMutate}
                    />
                </Grid>

                {/* Tabs & Content */}
                <Grid xs={12} md={8}>
                    <Card sx={{ mb: 3 }}>
                        <Tabs
                            value={currentTab}
                            onChange={handleChangeTab}
                            sx={{
                                px: 3,
                                boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.palette.divider}`,
                            }}
                        >
                            <Tab value="profile" label="Hồ sơ & CCCD" />
                            <Tab value="security" label="Bảo mật" />
                            {contract && (
                                <Tab value="contract" label="Hợp đồng đã ký" />
                            )}
                        </Tabs>

                        <Divider />

                        <Box sx={{ p: 3 }}>
                            {currentTab === 'profile' && (
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 2 }}>Thông tin ngân hàng</Typography>
                                    <Stack spacing={2} sx={{ mb: 4 }}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Ngân hàng:</Typography>
                                            <Typography variant="subtitle2">{partner.bankAccount?.bank_name || '---'}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Số tài khoản:</Typography>
                                            <Typography variant="subtitle2">{partner.bankAccount?.account_number || '---'}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Chủ tài khoản:</Typography>
                                            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>{partner.bankAccount?.account_holder_name || '---'}</Typography>
                                        </Stack>
                                    </Stack>

                                    <Divider sx={{ borderStyle: 'dashed', mb: 3 }} />

                                    <Grid container spacing={3}>
                                        <Grid xs={12} md={6}>
                                            <ImageCarouselCard
                                                title="CCCD / Giấy tờ tùy thân"
                                                images={[
                                                    getFullImageUrl(partner.partnerProfile?.id_card_front),
                                                    getFullImageUrl(partner.partnerProfile?.id_card_back),
                                                ].filter(Boolean)}
                                                lightbox={lightbox}
                                            />
                                        </Grid>

                                        {partner.role !== 'INTRODUCER' && (
                                            <Grid xs={12} md={6}>
                                                <ImageCarouselCard
                                                    title="Giấy phép lái xe"
                                                    images={[
                                                        getFullImageUrl(partner.partnerProfile?.driver_license_front),
                                                        getFullImageUrl(partner.partnerProfile?.driver_license_back),
                                                    ].filter(Boolean)}
                                                    lightbox={lightbox}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>

                                    <Lightbox
                                        open={lightbox.open}
                                        close={lightbox.onClose}
                                        index={lightbox.selected}
                                        slides={slides.filter(s => s.src)}
                                    />
                                </Box>
                            )}



                            {currentTab === 'security' && <PasswordChange />}

                            {currentTab === 'contract' && contract && (
                                <ContractPreview
                                    isSigned
                                    initialData={contract as any}
                                />
                            )}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

function ImageCarouselCard({ title, images, lightbox }: { title: string, images: string[], lightbox: any }) {
    const theme = useTheme();

    const carousel = useCarousel({
        slidesToShow: 1,
        slidesToScroll: 1,
        rtl: Boolean(theme.direction === 'rtl'),
        infinite: images.length > 1,
    });

    if (images.length === 0) {
        return (
            <Card sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>{title}</Typography>
                <Box sx={{
                    height: 200,
                    bgcolor: 'background.neutral',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.disabled'
                }}>
                    <Typography variant="caption">Chưa có hình ảnh</Typography>
                </Box>
            </Card>
        );
    }

    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>{title}</Typography>
            <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
                    {images.map((img, index) => (
                        <Box key={index}>
                            <Box
                                component="img"
                                alt={title}
                                src={img}
                                onClick={() => lightbox.onOpen(img)}
                                sx={{
                                    width: 1,
                                    height: 200,
                                    objectFit: 'cover',
                                    cursor: 'pointer',
                                }}
                            />
                        </Box>
                    ))}
                </Carousel>

                {images.length > 1 && (
                    <CarouselArrowIndex
                        index={carousel.currentIndex}
                        total={images.length}
                        onNext={carousel.onNext}
                        onPrev={carousel.onPrev}
                        sx={{ bottom: 10, right: 10, position: 'absolute', color: 'common.white', bgcolor: 'rgba(0,0,0,0.48)' }}
                    />
                )}
            </Box>
        </Card>
    );
}
