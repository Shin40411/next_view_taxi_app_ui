import Box from '@mui/material/Box';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { useSettingsContext } from 'src/components/settings';
import { useSocketListener } from 'src/hooks/use-socket';
import { useSnackbar } from 'src/components/snackbar';

import Main from './main';
import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  useSocketListener('customer:new_trip_request', (data) => {
    enqueueSnackbar(`Có yêu cầu mới từ ${data.partner.name || 'Tài xế'} (BS: ${data.partner.vehicle_plate})`, {
      variant: 'info',
      persist: true,
      action: (key) => (
        <Box onClick={() => window.location.href = '/customer/pending-requests'} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
          Xem ngay
        </Box>
      )
    });
  });

  useSocketListener('customer:driver_arrived', (data) => {
    enqueueSnackbar(`Tài xế ${data.partner.name || 'Tài xế'} (BS: ${data.partner.vehicle_plate}) đã đến nơi!`, { variant: 'success' });
  });

  useSocketListener('customer:trip_cancelled', (data) => {
    enqueueSnackbar(`Chuyến xe đã bị huỷ. Lý do: ${data.reason}`, { variant: 'error' });
  });

  useSocketListener('partner:trip_confirmed', (data) => {
    enqueueSnackbar(`Chuyến xe đã được xác nhận! Bạn nhận được ${data.reward_amount} GoXu.`, { variant: 'success' });
  });

  useSocketListener('partner:trip_rejected', (data) => {
    enqueueSnackbar(`Yêu cầu của bạn đã bị từ chối. Lý do: ${data.reason}`, { variant: 'error' });
  });

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const isHorizontal = settings.themeLayout === 'horizontal';

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini />;

  const renderHorizontal = <NavHorizontal />;

  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} />;

  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main>{children}</Main>
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={nav.onTrue} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {renderNavVertical}
        <Main>{children}</Main>
      </Box>
    </>
  );
}
