'use client';

import { useState } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { alpha, useTheme } from '@mui/material/styles';
// components
// hooks
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { useMockedUser } from 'src/hooks/use-mocked-user';
// routes
import { paths } from 'src/routes/paths';
// utils
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

const TABS = [
    {
        value: 'general',
        label: 'Thông tin chung',
        icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
        value: 'security',
        label: 'Bảo mật',
        icon: <Iconify icon="solar:shield-keyhole-bold" width={24} />,
    },
];

// ----------------------------------------------------------------------

export default function DriverProfileView() {
    const theme = useTheme();
    const settings = useSettingsContext();
    const { user } = useMockedUser();
    const [currentTab, setCurrentTab] = useState('general');

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <Card
                sx={{
                    mb: 3,
                    height: 280,
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    color: 'common.black',
                    background: 'linear-gradient(135deg, #FFF176 0%, #FBC02D 100%)',
                }}
            >
                <Avatar
                    src={user?.photoURL}
                    alt={user?.displayName}
                    sx={{
                        width: 120,
                        height: 120,
                        border: `4px solid ${alpha(theme.palette.common.white, 0.24)}`,
                        mb: 2,
                    }}
                />

                <Typography variant="h4">{user?.displayName}</Typography>

                <Typography variant="body2" sx={{ opacity: 0.72 }}>
                    {user?.role}
                </Typography>

                {/* Decoration circles */}
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        color: 'common.white',
                        opacity: 0.48,
                        typography: 'caption',
                    }}
                >
                    <Iconify icon="solar:verified-check-bold" width={16} sx={{ mr: 0.5 }} />
                    Đã xác thực
                </Stack>
            </Card>

            <Tabs
                value={currentTab}
                onChange={handleChangeTab}
                sx={{
                    mb: 3,
                    '& .MuiTabs-indicator': {
                        backgroundColor: 'primary.main',
                    },
                }}
            >
                {TABS.map((tab) => (
                    <Tab key={tab.value} value={tab.value} label={tab.label} icon={tab.icon} />
                ))}
            </Tabs>

            {currentTab === 'general' && <ProfileGeneral />}
            {currentTab === 'security' && <ProfileSecurity />}
        </Container>
    );
}

// ----------------------------------------------------------------------

function ProfileGeneral() {
    return (
        <Grid container spacing={3}>
            <Grid xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
                        Thông tin cá nhân
                    </Typography>

                    <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Họ tên:</Typography>
                            <Typography variant="subtitle2">Nguyễn Văn A</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Số điện thoại:</Typography>
                            <Typography variant="subtitle2">0901234567</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Email:</Typography>
                            <Typography variant="subtitle2">driver@alotaxi.com</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Ngày sinh:</Typography>
                            <Typography variant="subtitle2">01/01/1990</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>CCCD/CMND:</Typography>
                            <Typography variant="subtitle2">001090000001</Typography>
                        </Stack>
                    </Stack>
                </Card>
            </Grid>

            <Grid xs={12} md={6} mb={3}>
                <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
                        Thông tin chung & Ngân hàng
                    </Typography>

                    <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Biển số xe:</Typography>
                            <Typography variant="subtitle2">30A-123.45</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Loại xe:</Typography>
                            <Typography variant="subtitle2">Toyota Vios (4 chỗ)</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Màu xe:</Typography>
                            <Typography variant="subtitle2">Trắng</Typography>
                        </Stack>

                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'primary.main' }}>Tài khoản ngân hàng</Typography>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Ngân hàng:</Typography>
                            <Typography variant="subtitle2">Vietcombank</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Số tài khoản:</Typography>
                            <Typography variant="subtitle2">0123456789</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Chủ tài khoản:</Typography>
                            <Typography variant="subtitle2">NGUYEN VAN A</Typography>
                        </Stack>
                    </Stack>

                    <Button fullWidth size="large" variant="soft" color="inherit" sx={{ mt: 3 }}>
                        Cập nhật thông tin
                    </Button>
                </Card>
            </Grid>
        </Grid>
    );
}

function ProfileSecurity() {
    const router = useRouter();
    const { logout } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            router.reload();
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Unable to logout!', { variant: 'error' });
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Đổi mật khẩu
                    </Typography>

                    <Stack spacing={3} alignItems="flex-end">
                        <TextField
                            fullWidth
                            type="password"
                            label="Mật khẩu hiện tại"
                        />
                        <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            label="Mật khẩu mới"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="Xác nhận mật khẩu mới"
                        />

                        <Button variant="contained">
                            Lưu thay đổi
                        </Button>
                    </Stack>
                </Card>
            </Grid>

            <Grid xs={12} md={6}>
                <Card sx={{ p: 3, border: (theme) => `1px dashed ${theme.palette.error.main}` }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
                        Khu vực nguy hiểm
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                        Đăng xuất khỏi tài khoản của bạn trên thiết bị này.
                    </Typography>

                    <Button fullWidth variant="soft" color="error" size="large" onClick={handleLogout}>
                        Đăng xuất
                    </Button>
                </Card>
            </Grid>
        </Grid>
    )
}
