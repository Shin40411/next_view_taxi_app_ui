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

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';

import { fNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// Defined inside component to access user role
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function WalletPopover() {
    const router = useRouter();

    const { user, logout } = useAuthContext();

    const { enqueueSnackbar } = useSnackbar();

    const popover = usePopover();

    // Mock balance
    const balance = 1500000;

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
            label: 'Ví điểm & Rút tiền',
            linkTo: paths.dashboard.driver.wallet + '?tab=wallet',
            icon: 'eva:credit-card-fill',
        },
    ];

    const CUSTOMER_OPTIONS = [
        {
            label: 'Nạp tiền',
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
                startIcon={<Iconify icon="solar:wallet-bold" />}
                endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                sx={{
                    borderRadius: 1,
                    typography: 'subtitle2',
                    bgcolor: 'common.white',
                }}
            >
                Ví GoXu
            </Button>

            <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 220, p: 0 }}>
                <Box sx={{ p: 2, pb: 1.5 }}>
                    <Typography variant="subtitle2" noWrap>
                        Ví của tôi
                    </Typography>

                    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }} noWrap>
                        {fNumber(balance)} GoXu
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack sx={{ p: 1 }}>
                    {walletOptions.map((option) => (
                        <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
                            <Iconify icon={option.icon} width={20} sx={{ mr: 1, color: 'text.secondary' }} />
                            {option.label}
                        </MenuItem>
                    ))}
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
