import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import { fToNow } from 'src/utils/format-time';
import { NotificationItemProps } from 'src/types/notifications';

export default function NotificationItem({ notification, onDelete }: NotificationItemProps) {
  const renderAvatar = (
    <ListItemAvatar>
      {notification.avatarUrl ? (
        <Avatar src={notification.avatarUrl} sx={{ bgcolor: 'background.neutral' }} />
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'background.neutral',
          }}
        >
          {notification.type === 'customer:new_trip_request' && (
            <Iconify icon="mingcute:notification-newdot-line" width={24} sx={{ color: 'info.main' }} />
          )}
          {(notification.type === 'customer:driver_arrived' || notification.type === 'partner:trip_confirmed') && (
            <Iconify icon="solar:check-circle-bold" width={24} sx={{ color: 'success.main' }} />
          )}
          {(notification.type === 'customer:trip_cancelled' || notification.type === 'partner:trip_rejected' || notification.type === 'WALLET_FAILED') && (
            <Iconify icon="line-md:cancel" width={24} sx={{ color: 'error.main' }} />
          )}
          {notification.type === 'WALLET_SUCCESS' && (
            <Iconify icon="hugeicons:payment-success-01" width={24} sx={{ color: 'success.main' }} />
          )}
          {notification.type === 'partner:profile_status_update' && (
            <Iconify icon="carbon:user-profile" width={24} sx={{ color: 'info.main' }} />
          )}
          {notification.type === 'contract:approved' && (
            <Iconify icon="solar:file-check-bold" width={24} sx={{ color: 'success.main' }} />
          )}
          {notification.type === 'contract:terminated' && (
            <Iconify icon="solar:file-corrupted-bold" width={24} sx={{ color: 'error.main' }} />
          )}
          {!['customer:new_trip_request', 'customer:driver_arrived', 'partner:trip_confirmed', 'customer:trip_cancelled', 'partner:trip_rejected', 'WALLET_SUCCESS', 'WALLET_FAILED', 'contract:approved', 'contract:terminated'].includes(notification.type) && (
            <Iconify icon="mdi:bell" width={24} sx={{ color: 'primary.main' }} />
          )}
        </Stack>
      )}
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={reader(notification.title)}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ typography: 'caption', color: 'text.disabled' }}
        >
          <Markdown
            children={notification.body}
            sx={{
              color: 'text.secondary',
              '& p': { typography: 'body2', m: 0 },
              '& a': { color: 'inherit', textDecoration: 'none' },
              '& strong': { typography: 'subtitle2' },
            }}
          />
          <Typography variant="caption" color="text.disabled" noWrap>
            {fToNow(notification.created_at)}
          </Typography>
        </Stack>
      }
    />
  );

  const renderUnReadBadge = !notification.is_read && (
    <Box
      sx={{
        top: 26,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: '50%',
        bgcolor: 'info.main',
        position: 'absolute',
      }}
    />
  );

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: 80,
          bgcolor: 'error.lighter',
          zIndex: 0,
        }}
      >
        <IconButton onClick={onDelete}>
          <Iconify icon="solar:trash-bin-trash-bold" width={24} sx={{ color: 'error.main' }} />
        </IconButton>
      </Stack>

      <Box
        component={m.div}
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.1}
        sx={{
          bgcolor: 'background.paper',
          zIndex: 1,
          position: 'relative',
        }}
      >
        <ListItemButton
          disableRipple
          sx={{
            p: 2.5,
            alignItems: 'flex-start',
            borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderUnReadBadge}

          {renderAvatar}

          <Stack sx={{ flexGrow: 1 }}>
            {renderText}
          </Stack>
        </ListItemButton>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

function reader(data: string) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data || '' }}
      sx={{
        mb: 0.5,
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
