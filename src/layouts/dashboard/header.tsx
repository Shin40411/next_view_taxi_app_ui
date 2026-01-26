import { Box, Tooltip, Badge } from '@mui/material';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';

import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';

import { NAV, HEADER } from '../config-layout';
import WalletPopover from '../common/wallet-popover';
import AccountPopover from '../common/account-popover';
import NotificationsPopover from '../common/notifications-popover';
import Iconify from 'src/components/iconify';
import { useChatDrawer } from 'src/provider/chat/chat-provider';
import { useGetTotalUnread } from 'src/hooks/api/use-conversation';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
  notificationsDrawer?: ReturnType<typeof useBoolean>;
  totalUnread: number;
};

export default function Header({ onOpenNav, notificationsDrawer, totalUnread }: Props) {
  const theme = useTheme();

  const { user } = useAuthContext();

  const { openDrawer } = useChatDrawer();

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}

      {!lgUp && user?.role !== 'CUSTOMER' && user?.role !== 'PARTNER' && user?.role !== 'INTRODUCER' && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent={(user?.role === 'CUSTOMER' || user?.role === 'PARTNER' || user?.role === 'INTRODUCER') && !lgUp ? "space-between" : "flex-end"}
        spacing={{ xs: 0.5, sm: 1 }}
      >
        {(user?.role === 'CUSTOMER' || user?.role === 'PARTNER' || user?.role === 'INTRODUCER') && !lgUp && <WalletPopover />}

        {!lgUp ? (
          <Box
            sx={{
              width: 50,
              height: 50,
              p: 1,
              // mr: '20px',
              display: 'flex',
              borderRadius: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'common.white',
              boxShadow: (theme) => theme.customShadows.z20,
            }}
          >
            <Logo
              src="/logo/goxuvn.png"
              sx={{
                width: 'auto',
                maxWidth: 500,
                height: '100%',
              }}
            />
          </Box>
        ) : (
          <AccountPopover />
        )}
        <Box display="flex" alignItems="center">
          <Tooltip title="Mở danh sách trò chuyện">
            <IconButton
              onClick={openDrawer}
            >
              <Badge badgeContent={totalUnread} color="error">
                <Iconify icon="mage:message-round-fill" />
              </Badge>
            </IconButton>
          </Tooltip>
          {user?.role !== 'ADMIN' && user?.role !== 'ACCOUNTANT' && user?.role !== 'MONITOR' && notificationsDrawer && (
            <NotificationsPopover drawer={notificationsDrawer} />
          )}
          {/* <SettingsButton /> */}
        </Box>
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: '#FFC107',
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
