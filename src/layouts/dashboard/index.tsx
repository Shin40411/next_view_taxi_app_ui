import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import Box from '@mui/material/Box';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSocketListener } from 'src/hooks/use-socket';

import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import ZaloChatWidget from 'src/components/zalo-widget/ZaloChatWidget';
import HotlineWidget from 'src/components/hotline-widget/HotlineWidget';
import VideoPlayerDialog from 'src/components/video-player-dialog/video-player-dialog';

import Main from './main';
import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';
import PartnerOnboarding from './partner-onboarding';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const settings = useSettingsContext();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { logout } = useAuthContext();
  const notificationsDrawer = useBoolean();

  useEffect(() => {
    const checkToken = () => {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        window.location.href = '/';
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 30000);

    return () => clearInterval(interval);
  }, [enqueueSnackbar]);

  const audio = new Audio('/assets/files/notification.mp3');

  const playNotificationSound = () => {
    try {
      audio.play();
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  useSocketListener('customer:new_trip_request', (data) => {
    playNotificationSound();
    enqueueSnackbar(`Có yêu cầu mới từ ${data.partner.name || 'Tài xế'} (BS: ${data.partner.vehicle_plate || 'Chưa xác định'})`, {
      variant: 'info',
      persist: true,
      action: (key) => (
        <Box
          onClick={() => {
            notificationsDrawer.onTrue();
            closeSnackbar(key);
          }}
          sx={{ cursor: 'pointer', fontWeight: 'bold' }}
        >
          Xem ngay
        </Box>
      )
    });
  });

  useSocketListener('customer:driver_arrived', (data) => {
    playNotificationSound();
    enqueueSnackbar(`Tài xế ${data.partner.name || 'Tài xế'} (BS: ${data.partner.vehicle_plate || 'Chưa xác định'}) đã đến nơi!`, { variant: 'success' });
  });

  useSocketListener('customer:trip_cancelled', (data) => {
    playNotificationSound();
    enqueueSnackbar(`Chuyến xe đã bị huỷ. Lý do: ${data.reason}`, { variant: 'error' });
  });

  useSocketListener('partner:trip_confirmed', (data) => {
    playNotificationSound();
    enqueueSnackbar(`Chuyến xe đã được xác nhận! Bạn nhận được ${data.reward_amount} Goxu.`, { variant: 'success' });
  });

  useSocketListener('partner:trip_rejected', (data) => {
    playNotificationSound();
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

        <PartnerOnboarding />
        <Header onOpenNav={nav.onTrue} notificationsDrawer={notificationsDrawer} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main>{children}</Main>
        <HotlineWidget />
        <ZaloChatWidget />
      </>
    );
  }

  if (isMini) {
    return (
      <>

        <PartnerOnboarding />
        <Header onOpenNav={nav.onTrue} notificationsDrawer={notificationsDrawer} />

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
        <HotlineWidget />
        <ZaloChatWidget />
      </>
    );
  }

  return (
    <>

      <PartnerOnboarding />
      <Header onOpenNav={nav.onTrue} notificationsDrawer={notificationsDrawer} />

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
      <HotlineWidget />
      <ZaloChatWidget />
      <VideoPlayerDialog />
    </>
  );
}
