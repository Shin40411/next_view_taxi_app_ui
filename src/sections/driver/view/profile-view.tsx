import 'intro.js/introjs.css';
import introJs from 'intro.js';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useAdmin } from 'src/hooks/api/use-admin';
import { usePartner } from 'src/hooks/api/use-partner';
import { useContract } from 'src/hooks/api/use-contract';

import { fDate } from 'src/utils/format-time';
import { fPoint } from 'src/utils/format-number';
import { getFullImageUrl } from 'src/utils/get-image';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import PasswordChange from 'src/components/dialogs/password-change';
import { ImageCarouselCard } from 'src/components/carousel/image-carousel-card';

import ContractPreview from 'src/sections/contract/contract-preview';
import ProfileUpdateDialog from 'src/sections/driver/profile-update-dialog';

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
    const openRejectReason = useBoolean();

    const [currentTab, setCurrentTab] = useState('profile');


    const isVerified = Boolean(
        partner.bankAccount &&
        partner.email &&
        partner.phone_number &&
        partner.partnerProfile?.id_card_front &&
        partner.partnerProfile?.id_card_back &&
        (partner.role === 'INTRODUCER' || (
            partner.partnerProfile?.vehicle_plate &&
            partner.partnerProfile?.driver_license_front &&
            partner.partnerProfile?.driver_license_back
        ))
    );

    const titleAlert = partner.partnerProfile?.status === 'PENDING' ?
        'Hồ sơ chưa được duyệt' : partner.partnerProfile?.status === 'REJECTED' ?
            'Hồ sơ đã bị từ chối' : '';

    useEffect(() => {
        if (updateProfile.value) return;

        if (!userLoading && partner && (partner.role === 'PARTNER' || partner.role === 'INTRODUCER')) {
            if (!isVerified) {
                const instance = (introJs as any).tour();
                instance.setOptions({
                    steps: [{
                        title: '👉 Hồ sơ chưa hoàn tất',
                        element: '#update-profile-btn',
                        intro: 'Hồ sơ của bạn chưa hoàn tất. Vui lòng nhấn vào đây để cập nhật ngay.',
                        position: 'top'
                    }],
                    showButtons: true,
                    doneLabel: 'Cập nhật ngay',
                    showStepNumbers: false,
                    showBullets: false,
                    exitOnOverlayClick: false,
                    exitOnEsc: false,
                    overlayOpacity: 0.7
                });

                instance.start();

                instance.oncomplete(() => {
                    updateProfile.onTrue();
                });

                return () => {
                    instance.exit(true);
                };
            }
        }
    }, [partner, userLoading, updateProfile.value]);

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
                heading="Hồ sơ"
                links={[
                    { name: 'Tài xế / CTV', href: paths.dashboard.driver.root },
                    { name: 'Hồ sơ' },
                ]}
                sx={{
                    my: { xs: 3, md: 5 },
                }}
                {...(partner.partnerProfile?.status === 'REJECTED' ?
                    {
                        action:
                            <Alert
                                severity="error"
                                {...(partner.partnerProfile?.status === 'REJECTED' ? { action: <Button color="inherit" size="small" onClick={openRejectReason.onTrue}>Xem lý do</Button> } : {})}
                            >
                                {titleAlert}
                            </Alert>
                    } : {})}
            />

            <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                    <Card sx={{ pt: 4, pb: 3, px: 3, textAlign: 'center', position: 'relative' }}>
                        <Chip
                            icon={<Iconify icon={partner.partnerProfile?.is_online ? 'oui:dot' : 'octicon:dot-24'} width={24} />}
                            label={partner.partnerProfile?.is_online ? 'Trực tuyến' : 'Ngoại tuyến'}
                            color={partner.partnerProfile?.is_online ? 'success' : 'default'}
                            variant="soft"
                            sx={{ position: 'absolute', top: 10, left: 10 }}
                        />
                        <Avatar
                            alt={partner.full_name}
                            src={
                                (partner.avatar || (partner as any).avatar)?.startsWith('http')
                                    ? partner.avatar || (partner as any).avatar
                                    : getFullImageUrl(partner.avatar || (partner as any).avatar)
                            }
                            imgProps={{ referrerPolicy: 'no-referrer' }}
                            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                        >
                            {partner.full_name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Stack direction="row" justifyContent="center" sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>

                            {partner.partnerProfile?.status && (
                                <Chip
                                    icon={<Iconify icon={
                                        partner.partnerProfile.status === 'APPROVED' ? 'solar:verified-check-bold' :
                                            partner.partnerProfile.status === 'REJECTED' ? 'eva:close-circle-fill' :
                                                'octicon:unverified-16'
                                    } width={24} />}
                                    label={
                                        partner.partnerProfile.status === 'APPROVED' ? 'Đã duyệt' :
                                            partner.partnerProfile.status === 'REJECTED' ? 'Hồ sơ bị từ chối' :
                                                'Đang chờ duyệt'
                                    }
                                    color={
                                        partner.partnerProfile.status === 'APPROVED' ? 'info' :
                                            partner.partnerProfile.status === 'REJECTED' ? 'error' :
                                                'warning'
                                    }
                                    variant="soft"
                                />
                            )}
                            {/* <Chip
                                icon={<Iconify icon={isVerified ? 'solar:verified-check-bold' : 'octicon:unverified-16'} width={24} />}
                                label={isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                                color={isVerified ? 'info' : 'warning'}
                                variant="soft"
                            /> */}
                        </Stack>

                        <Stack direction="row" sx={{ mt: 3, mb: 2 }}>
                            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Typography variant="h6">{homeStats?.total_trips || 0}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Chuyến</Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ color: 'warning.main' }}>
                                    {fPoint(partner.partnerProfile?.wallet_balance || 0)}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Số dư</Typography>
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
                                    <Iconify icon="eva:email-fill" width={20} sx={{ mr: 2, color: 'text.disabled' }} />
                                    <Typography variant="body2">{partner.email || 'Chưa cập nhật'}</Typography>
                                </Stack>
                                <Stack direction="row">
                                    <Iconify icon="eva:phone-fill" width={20} sx={{ mr: 2, color: 'text.disabled' }} />
                                    <Typography variant="body2">{partner.phone_number || "Chưa cập nhật"}</Typography>
                                </Stack>
                                {partner.role !== 'INTRODUCER' && (
                                    <Stack direction="row">
                                        <Iconify icon="eva:car-fill" width={20} sx={{ mr: 2, color: 'text.disabled' }} />
                                        <Typography variant="body2">{partner.partnerProfile?.vehicle_plate || 'Chưa cập nhật'}</Typography>
                                    </Stack>
                                )}
                                <Stack direction="row">
                                    <Iconify icon="fa:intersex" width={20} sx={{ mr: 2, color: 'text.disabled' }} />
                                    <Typography variant="body2">{partner.partnerProfile?.sex || 'Chưa cập nhật'}</Typography>
                                </Stack>
                                <Stack direction="row">
                                    <Iconify icon="eva:calendar-fill" width={20} sx={{ mr: 2, color: 'text.disabled' }} />
                                    <Typography variant="body2">{partner.partnerProfile?.date_of_birth || 'Chưa cập nhật'}</Typography>
                                </Stack>
                            </Stack>
                        </Box>

                        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                            <Button
                                id="update-profile-btn"
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

                    <ConfirmDialog
                        open={openRejectReason.value}
                        onClose={openRejectReason.onFalse}
                        title="Lý do từ chối"
                        content={partner.partnerProfile?.reject_reason || 'Không có lý do cụ thể.'}
                        action={
                            <Button variant="contained" color="primary" onClick={() => { updateProfile.onTrue(); openRejectReason.onFalse(); }}>
                                Kiểm tra lại hồ sơ
                            </Button>
                        }
                    />
                </Grid>

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
                                <>
                                    {contract.expire_date && (
                                        <Alert severity="info" sx={{ mb: 3 }}>
                                            <Typography variant="body2">
                                                Hợp đồng có hiệu lực đến ngày: <b>{fDate(contract.expire_date)}</b>
                                            </Typography>
                                        </Alert>
                                    )}
                                    <Box sx={{ position: 'relative' }}>
                                        <Box sx={{
                                            ...(contract.expire_date && new Date() > new Date(contract.expire_date)
                                                && {
                                                filter: 'blur(5px)',
                                                pointerEvents: 'none',
                                                userSelect: 'none'
                                            })
                                        }}>
                                            <ContractPreview
                                                isSigned
                                                initialData={contract as any}
                                                title={
                                                    contract.status === 'ACTIVE' ? 'Hợp đồng đã ký kết' :
                                                        contract.status === 'INACTIVE' ? 'Hợp đồng đang chờ duyệt' :
                                                            'Hợp đồng đã bị hủy bỏ'
                                                }
                                                description={
                                                    contract.status === 'ACTIVE' ? '' :
                                                        contract.status === 'INACTIVE' ? 'Bạn đã ký hợp đồng thành công, vui lòng chờ duyệt.' :
                                                            'Hợp đồng của bạn đã bị hủy bỏ.'
                                                }
                                            />
                                        </Box>

                                        {contract.expire_date && new Date() > new Date(contract.expire_date) && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    zIndex: 10,
                                                }}
                                            >
                                                <Chip
                                                    label="Hợp đồng đã hết hiệu lực, vui lòng vào ví Goxu để gia hạn"
                                                    color="error"
                                                    variant="soft"
                                                    size="medium"
                                                    sx={{
                                                        fontSize: '1rem',
                                                        py: 2,
                                                        fontWeight: 'bold',
                                                        textTransform: 'uppercase'
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}