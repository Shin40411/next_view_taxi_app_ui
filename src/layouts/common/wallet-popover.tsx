import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { useAdmin } from 'src/hooks/api/use-admin';

import { fNumber } from 'src/utils/format-number';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import AccountPopover from './account-popover';

export default function WalletPopover() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user, logout } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const popover = usePopover();

    const { useGetUser } = useAdmin();
    const { user: userAdmin } = useGetUser(user?.id);
    const balance = userAdmin?.servicePoints?.[0]?.advertising_budget || userAdmin?.partnerProfile?.wallet_balance || 0;

    const isPartner = user?.role === 'PARTNER' || user?.role === 'INTRODUCER';

    const handleLogout = async () => {
        try {
            await logout();
            popover.onClose();
            router.replace(paths.auth.jwt.login);
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Unable to logout!', { variant: 'error' });
        }
    };

    const PARTNER_OPTIONS = [
        {
            label: 'Dịch vụ của bạn',
            linkTo: paths.dashboard.root,
            icon: 'solar:home-angle-bold',
        },
        {
            label: 'Hồ sơ',
            linkTo: paths.dashboard.driver.profile,
            icon: 'solar:user-bold',
        },
        {
            label: 'Ví Goxu',
            linkTo: paths.dashboard.driver.wallet,
            icon: 'eva:credit-card-fill',
        },
        {
            label: 'Yêu cầu hỗ trợ',
            linkTo: paths.dashboard.driver.support,
            icon: 'solar:chat-round-dots-bold',
        },
        {
            label: 'Xem hướng dẫn',
            linkTo: '#tutorial',
            icon: 'solar:videocamera-record-bold-duotone',
        },
    ];

    const CUSTOMER_OPTIONS = [
        {
            label: 'Lịch sử đơn',
            linkTo: paths.dashboard.root,
            icon: 'solar:bill-list-bold',
        },
        {
            label: 'Thông tin công ty',
            linkTo: paths.dashboard.customer.servicePoint,
            icon: 'solar:shop-bold',
        },
        {
            label: 'Nạp Goxu',
            linkTo: `${paths.dashboard.wallet}?tab=deposit`,
            icon: 'eva:download-fill',
        },
        {
            label: 'Lịch sử nạp',
            linkTo: `${paths.dashboard.wallet}?tab=deposit-history`,
            icon: 'eva:clock-fill',
        },
        {
            label: 'Lịch sử chuyển',
            linkTo: `${paths.dashboard.wallet}?tab=transfer-history`,
            icon: 'eva:activity-fill',
        },
        {
            label: 'Yêu cầu hỗ trợ',
            linkTo: paths.dashboard.customer.support,
            icon: 'solar:chat-round-dots-bold',
        },
        {
            label: 'Xem hướng dẫn',
            linkTo: '#tutorial-customer',
            icon: 'solar:videocamera-record-bold-duotone',
        },
    ];

    const walletOptions = isPartner ? PARTNER_OPTIONS : CUSTOMER_OPTIONS;

    const handleClickItem = (path: string) => {
        popover.onClose();
        router.push(path);
    };

    return (
        <>
            <Button
                id="mobile-wallet-popover-btn"
                component={m.button}
                whileTap="tap"
                whileHover="hover"
                variants={varHover(1.05)}
                onClick={popover.onOpen}
                variant="outlined"
                endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                sx={{
                    borderRadius: 1,
                    typography: 'subtitle2',
                    bgcolor: 'common.white',
                }}
            >
                <Iconify icon="solar:wallet-bold" />
            </Button>

            <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 220, p: 0 }}>
                <Box sx={{ p: 2, pb: 1.5 }}>
                    <AccountPopover />
                    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }} noWrap>
                        {fNumber(balance)} Goxu
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack sx={{ p: 1 }}>
                    {walletOptions.map((option) => {
                        const [linkPath, linkParams] = option.linkTo.split('?');
                        const searchParam = new URLSearchParams(linkParams);
                        const tabParam = searchParam.get('tab');

                        const active =
                            (pathname === linkPath || pathname === `${linkPath}/`) &&
                            (!tabParam || searchParams.get('tab') === tabParam);

                        return (
                            <MenuItem
                                key={option.label}
                                onClick={() => handleClickItem(option.linkTo)}
                                sx={{
                                    typography: 'body2',
                                    color: 'text.secondary',
                                    borderRadius: 1,
                                    ...(active && {
                                        color: 'primary.main',
                                        fontWeight: 'fontWeightSemiBold',
                                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                        '&:hover': {
                                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                                        },
                                    }),
                                }}
                            >
                                <Iconify icon={option.icon} width={20} sx={{ mr: 1, color: 'inherit' }} />
                                {option.label}
                            </MenuItem>
                        );
                    })}
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <MenuItem
                    onClick={handleLogout}
                    sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
                >
                    <Iconify icon="solar:logout-3-bold" width={20} sx={{ mr: 1 }} />
                    Đăng xuất
                </MenuItem>
            </CustomPopover>
        </>
    );
}