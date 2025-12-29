import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';

import Button from '@mui/material/Button';
import Iconify from 'src/components/iconify';

import { usePathname, useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';

import { useResponsive } from 'src/hooks/use-responsive';
import { useMockedUser } from 'src/hooks/use-mocked-user';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import { NavSectionVertical } from 'src/components/nav-section';

import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import NavToggleButton from '../common/nav-toggle-button';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

type Props = {
  openNav: boolean;
  onCloseNav: VoidFunction;
};

export default function NavVertical({ openNav, onCloseNav }: Props) {
  const { user } = useMockedUser();

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const router = useRouter();
  const { logout } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace(paths.auth.jwt.login);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box
        sx={{
          mb: 2,
          mt: 3,
          ml: 4,
          width: 60,
          height: 60,
          display: 'flex',
          borderRadius: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'common.white',
          boxShadow: (theme) => theme.customShadows.z24,
        }}
      >
        <Logo
          src="/logo/goxuvn.png"
          sx={{
            width: 50,
            height: 30,
          }}
        />
      </Box>
      <NavSectionVertical
        data={navData}
        slotProps={{
          currentRole: user?.role,
          rootItem: {
            color: 'common.black',
            '&:hover': { color: 'common.black' },
            '& .icon': { color: 'common.black' },
            '&.active': {
              color: 'common.white',
              bgcolor: 'common.black',
              '&:hover': { bgcolor: 'grey.900' },
              '& .icon': { color: 'common.white' },
            },
          },
          subItem: {
            color: 'common.black',
            '&:hover': { color: 'common.black' },
            '& .icon': { color: 'common.black' },
            '&.active': {
              color: 'common.white',
              bgcolor: 'common.black',
              '&:hover': { bgcolor: 'grey.900' },
              '& .icon': { color: 'common.white' },
            },
          },
          subheader: {
            color: 'common.black',
            '&:hover': { color: 'common.black' },
          },
        }}
      />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2.5 }}>
        <Button
          fullWidth
          variant="soft"
          color="error"
          size="large"
          startIcon={<Iconify icon="solar:logout-3-bold" />}
          onClick={handleLogout}
          sx={{
            fontWeight: 'bold',
            bgcolor: 'rgba(255, 86, 48, 0.08)',
            '&:hover': {
              bgcolor: 'rgba(255, 86, 48, 0.16)',
            }
          }}
        >
          Đăng xuất
        </Button>
      </Box>

    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
            bgcolor: '#FFC107', // Taxi Yellow
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
              bgcolor: '#FFC107', // Taxi Yellow
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
