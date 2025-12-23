import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';
import { useMockedUser } from 'src/hooks/use-mocked-user';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import { NavSectionVertical } from 'src/components/nav-section';

import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import NavToggleButton from '../common/nav-toggle-button';

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
      <Logo sx={{ mt: 3, ml: 4, mb: 1 }} />

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
