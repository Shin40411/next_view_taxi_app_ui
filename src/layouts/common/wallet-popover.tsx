import { useState } from 'react';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';
import { useAdmin } from 'src/hooks/api/use-admin';

import { fNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import AccountPopover from './account-popover';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// Defined inside component to access user role
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function WalletPopover() {
    const router = useRouter();

    const pathname = usePathname();

    const searchParams = useSearchParams();

    const { user, logout } = useAuthContext();

    const { enqueueSnackbar } = useSnackbar();

    const popover = usePopover();

    // Get User Balance
    const { useGetUser } = useAdmin();
    const { user: userAdmin } = useGetUser(user?.id);
    const balance = userAdmin?.servicePoints?.[0]?.advertising_budget || userAdmin?.partnerProfile?.wallet_balance || 0;

    const isPartner = user?.role === 'PARTNER';

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
            label: 'Trang chủ',
            linkTo: paths.dashboard.root,
            icon: 'solar:home-angle-bold',
        },
        {
            label: 'Hồ sơ',
            linkTo: paths.dashboard.driver.profile,
            icon: 'solar:user-bold',
        },
        {
            label: 'Lịch sử chuyến đi',
            linkTo: paths.dashboard.driver.wallet + '?tab=history',
            icon: 'eva:car-fill',
        },
        {
            label: 'Ví GoXu & Rút GoXu',
            linkTo: paths.dashboard.driver.wallet + '?tab=wallet',
            icon: 'eva:credit-card-fill',
        },
    ];

    const CUSTOMER_OPTIONS = [
        {
            label: 'Đơn hàng',
            linkTo: paths.dashboard.root,
            icon: 'solar:bill-list-bold',
        },
        {
            label: 'Cửa hàng của bạn',
            linkTo: paths.dashboard.customer.servicePoint,
            icon: 'solar:shop-bold',
        },
        {
            label: 'Nạp GoXu',
            linkTo: paths.dashboard.wallet + '?tab=deposit',
            icon: 'eva:download-fill',
        },
        {
            label: 'Lịch sử nạp',
            linkTo: paths.dashboard.wallet + '?tab=deposit-history',
            icon: 'eva:clock-fill',
        },
        {
            label: 'Lịch sử chuyển',
            linkTo: paths.dashboard.wallet + '?tab=transfer-history',
            icon: 'eva:activity-fill',
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
                    {/* <Typography variant="subtitle2" noWrap>
                        Ví của tôi
                    </Typography> */}
                    <AccountPopover />

                    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }} noWrap>
                        {fNumber(balance)} GoXu
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack sx={{ p: 1 }}>
                    {walletOptions.map((option) => {
                        const [linkPath, linkParams] = option.linkTo.split('?');
                        const searchParam = new URLSearchParams(linkParams);
                        const tabParam = searchParam.get('tab');

                        const active = pathname === linkPath && (!tabParam || searchParams.get('tab') === tabParam);

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
