import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { hideScroll } from 'src/theme/css';

import Logo from 'src/components/logo';
import { NavSectionMini } from 'src/components/nav-section';

import { NAV } from '../config-layout';
import { useNavData } from './config-navigation';
import NavToggleButton from '../common/nav-toggle-button';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { user } = useMockedUser();

  const navData = useNavData();

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          bgcolor: '#FFC107',
          ...hideScroll.x,
        }}
      >
        <Box
          sx={{
            mb: 2,
            mt: 3,
            mx: 'auto',
            width: 'auto',
            height: 'auto',
            display: 'flex',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'common.white',
            boxShadow: (theme) => theme.customShadows.z24,
          }}
        >
          <Logo width="auto" height="auto" src="/logo/favicon/favicon-96x96.png" />
        </Box>

        <NavSectionMini
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
          }}
        />
      </Stack>
    </Box>
  );
}
