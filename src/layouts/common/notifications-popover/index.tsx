import { m } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import { useNotify } from 'src/hooks/api/use-notify';
import { INotification } from 'src/types/notifications';

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
import { fCurrency } from 'src/utils/format-number';

import { _notifications } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';
import { varHover } from 'src/components/animate';

import { useSocketListener } from 'src/hooks/use-socket';

import NotificationItem from './notification-item';

type Props = {
  drawer: ReturnType<typeof useBoolean>;
};

export default function NotificationsPopover({ drawer }: Props) {
  const smUp = useResponsive('up', 'sm');

  const { useGetNotifications, markAllAsRead, deleteNotification } = useNotify();
  const { notifications, notificationsMutate, unreadCount, size, setSize, isEnd } = useGetNotifications();

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && !isEnd) {
      setSize(size + 1);
    }
  };

  const handleNewSocketNotification = (newNotification: any) => {
    notificationsMutate((currentData: any[] | undefined) => {
      if (!currentData || currentData.length === 0) {
        return [{ data: [newNotification], total: 1 }];
      }

      const firstPage = currentData[0];
      let newFirstPage;

      if (Array.isArray(firstPage.data)) {
        newFirstPage = {
          ...firstPage,
          data: [newNotification, ...firstPage.data],
          total: (firstPage.total || 0) + 1
        };
      } else if (firstPage.data && Array.isArray(firstPage.data.data)) {
        newFirstPage = {
          ...firstPage,
          data: {
            ...firstPage.data,
            data: [newNotification, ...firstPage.data.data],
            total: (firstPage.data.total || 0) + 1
          }
        };
      } else {
        return [{ data: [newNotification], total: 1 }, ...currentData];
      }

      return [newFirstPage, ...currentData.slice(1)];
    }, false);
  };

  useSocketListener('customer:new_trip_request', (data) => {
    console.log('Socket received customer:new_trip_request', data);
    const newNotification = {
      id: new Date().getTime().toString(),
      title: 'Yêu cầu mới',
      body: `Bạn có yêu cầu đặt xe mới từ ${data.partner.name || 'Tài xế'} (BS: ${data.partner.vehicle_plate})`,
      created_at: new Date(),
      is_read: false,
      type: 'order',
      avatarUrl: null,
    };
    handleNewSocketNotification(newNotification);
  });

  useSocketListener('customer:driver_arrived', (data) => {
    const newNotification = {
      id: new Date().getTime().toString(),
      title: 'Tài xế đã đến!',
      body: `${data.partner.name || 'Tài xế'} (BS: ${data.partner.vehicle_plate}) đã đến điểm đón.`,
      created_at: new Date(),
      is_read: false,
      type: 'delivery',
      avatarUrl: null,
    };
    handleNewSocketNotification(newNotification);
  });

  useSocketListener('customer:trip_cancelled', (data) => {
    const newNotification = {
      id: new Date().getTime().toString(),
      title: 'Chuyến xe bị huỷ',
      body: `Lý do: ${data.reason}`,
      created_at: new Date(),
      is_read: false,
      type: 'mail',
      avatarUrl: null,
    };
    handleNewSocketNotification(newNotification);
  });

  useSocketListener('partner:trip_confirmed', (data) => {
    const newNotification = {
      id: new Date().getTime().toString(),
      title: 'Chuyến xe xác nhận',
      body: `Bạn nhận được ${data.reward_amount} GoXu`,
      created_at: new Date(),
      is_read: false,
      type: 'order',
      avatarUrl: null,
    };
    handleNewSocketNotification(newNotification);
  });

  useSocketListener('partner:trip_rejected', (data) => {
    const newNotification = {
      id: new Date().getTime().toString(),
      title: 'Yêu cầu bị từ chối',
      body: `Lý do: ${data.reason}`,
      created_at: new Date(),
      is_read: false,
      type: 'mail',
      avatarUrl: null,
    };
    handleNewSocketNotification(newNotification);
  });

  useSocketListener('wallet_transaction_updated', (data) => {
    let title = 'Cập nhật ví';
    let body = '';
    const amount = fCurrency(Number(data.amount * 1000));
    const typeName = data.type === 'DEPOSIT' ? 'Nạp Goxu' : data.type === 'WITHDRAW' ? 'Rút Goxu' : 'Chuyển Goxu';

    if (data.status === 'SUCCESS') {
      title = 'Giao dịch thành công';
      body = `Yêu cầu ${typeName} số tiền ${amount} đã được duyệt thành công.`;
    } else if (data.status === 'FALSE') {
      title = 'Giao dịch bị từ chối';
      body = `Yêu cầu ${typeName} số tiền ${amount} đã bị từ chối. Lý do: ${data.reason || 'Không có lý do cụ thể'}`;
    }

    const newNotification = {
      id: new Date().getTime().toString(),
      title,
      body,
      created_at: new Date(),
      is_read: false,
      type: data.status === 'SUCCESS' ? 'WALLET_SUCCESS' : 'WALLET_FAILED',
      avatarUrl: null,
      data: data
    };
    handleNewSocketNotification(newNotification);
  });

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter((notification: any) => !notification.is_read).map((n: any) => n.id);

    if (unreadIds.length === 0) return;

    notificationsMutate(
      (currentData: any[] | undefined) => {
        if (!currentData) return [];
        return currentData.map(page => {
          if (Array.isArray(page.data)) {
            return {
              ...page,
              data: page.data.map((notification: any) => ({ ...notification, is_read: true }))
            };
          }
          if (page.data && Array.isArray(page.data.data)) {
            return {
              ...page,
              data: {
                ...page.data,
                data: page.data.data.map((notification: any) => ({ ...notification, is_read: true }))
              }
            };
          }
          return page;
        });
      },
      false
    );

    try {
      await markAllAsRead(unreadIds);
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      notificationsMutate();
    }
  };

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Thông báo
      </Typography>

      {!!unreadCount && (
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
    <Scrollbar onScroll={handleScroll}>
      <List disablePadding>
        {notifications.length === 0 ? (
          <EmptyContent
            title="Không có thông báo mới"
            imgUrl="/assets/icons/empty/ic_content.svg"
            sx={{ p: 3 }}
          />
        ) : (
          notifications.map((notification: INotification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDelete={async () => {
                notificationsMutate(
                  (currentData: any[] | undefined) => {
                    if (!currentData) return [];
                    return currentData.map(page => {
                      if (Array.isArray(page.data)) {
                        return {
                          ...page,
                          data: page.data.filter((item: any) => item.id !== notification.id),
                          total: page.total - 1
                        };
                      }
                      if (page.data && Array.isArray(page.data.data)) {
                        return {
                          ...page,
                          data: {
                            ...page.data,
                            data: page.data.data.filter((item: any) => item.id !== notification.id),
                            total: page.data.total - 1
                          }
                        };
                      }
                      return page;
                    });
                  },
                  false
                );

                try {
                  await deleteNotification(notification.id);
                  notificationsMutate();
                } catch (error) {
                  console.error('Delete failed:', error);
                  notificationsMutate();
                }
              }}
            />
          ))
        )}
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
        <Badge badgeContent={unreadCount} color="error">
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
          sx: { width: 1, maxWidth: 600 },
        }}
      >
        {renderHead}

        <Divider />

        {renderList}

        {!!unreadCount && (
          <Box sx={{ p: 1 }}>
            <Button fullWidth size="large" onClick={handleMarkAllAsRead}>
              Đánh dấu tất cả đã đọc
            </Button>
          </Box>
        )}
      </Drawer>
    </>
  );
}
