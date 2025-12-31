import { m } from 'framer-motion';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { _notifications } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';

import { useSocketListener } from 'src/hooks/use-socket';

import NotificationItem from './notification-item';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'all',
    label: 'All',
    count: 22,
  },
  {
    value: 'unread',
    label: 'Unread',
    count: 12,
  },
  {
    value: 'archived',
    label: 'Archived',
    count: 10,
  },
];

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const drawer = useBoolean();

  const smUp = useResponsive('up', 'sm');

  const [notifications, setNotifications] = useState<any[]>([]);

  useSocketListener('customer:new_trip_request', (data) => {
    console.log('Socket received customer:new_trip_request', data);
    const newNotification = {
      id: new Date().getTime().toString(),
      title: `<p><strong>Yêu cầu mới</strong> từ ${data.partner.name || 'Tài xế'} (BS: ${data.partner.vehicle_plate})</p>`,
      createdAt: new Date(),
      isUnRead: true,
      type: 'order',
      avatarUrl: null,
      category: 'Trip',
    };
    setNotifications((prev) => [newNotification, ...prev]);
  });

  useSocketListener('customer:driver_arrived', (data) => {
    const newNotification = {
      id: new Date().getTime().toString(),
      title: `<p><strong>Tài xế đã đến!</strong> ${data.partner.name || 'Tài xế'} (BS: ${data.partner.vehicle_plate}) đã đến điểm đón.</p>`,
      createdAt: new Date(),
      isUnRead: true,
      type: 'delivery',
      avatarUrl: null,
      category: 'Trip',
    };
    setNotifications((prev) => [newNotification, ...prev]);
  });

  useSocketListener('customer:trip_cancelled', (data) => {
    const newNotification = {
      id: new Date().getTime().toString(),
      title: `<p><strong>Chuyến xe bị huỷ</strong> Lý do: ${data.reason}</p>`,
      createdAt: new Date(),
      isUnRead: true,
      type: 'mail',
      avatarUrl: null,
      category: 'Trip',
    };
    setNotifications((prev) => [newNotification, ...prev]);
  });

  useSocketListener('partner:trip_confirmed', (data) => {
    const newNotification = {
      id: new Date().getTime().toString(),
      title: `<p><strong>Chuyến xe xác nhận</strong> Bạn nhận được ${data.reward_amount} GoXu</p>`,
      createdAt: new Date(),
      isUnRead: true,
      type: 'order',
      avatarUrl: null,
      category: 'Trip',
    };
    setNotifications((prev) => [newNotification, ...prev]);
  });

  useSocketListener('partner:trip_rejected', (data) => {
    const newNotification = {
      id: new Date().getTime().toString(),
      title: `<p><strong>Yêu cầu bị từ chối</strong> Lý do: ${data.reason}</p>`,
      createdAt: new Date(),
      isUnRead: true,
      type: 'mail',
      avatarUrl: null,
      category: 'Trip',
    };
    setNotifications((prev) => [newNotification, ...prev]);
  });

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Thông báo
      </Typography>

      {!!totalUnRead && (
        <Tooltip title="Đánh dấu là đã đọc">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  const renderList = (
    <Scrollbar>
      <List disablePadding>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </List>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}

        <Divider />

        {renderList}

        <Box sx={{ p: 1 }}>
          <Button fullWidth size="large">
            Đánh dấu tất cả đã đọc
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
