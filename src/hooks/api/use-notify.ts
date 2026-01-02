import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';
import { INotification } from 'src/types/notifications';

// ----------------------------------------------------------------------

export function useNotify() {
    const useGetNotifications = () => {
        const URL = endpoints.notification.root;

        const { data, isLoading, error, isValidating, mutate } = useSWR<INotification[]>(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                const notifications: INotification[] = Array.isArray(data) ? data : (data as any)?.data || [];

                const unreadCount = notifications.filter((item: INotification) => !item.is_read).length;

                return {
                    notifications: notifications,
                    notificationsLoading: isLoading,
                    notificationsError: error,
                    notificationsValidating: isValidating,
                    notificationsEmpty: !isLoading && !notifications.length,
                    notificationsMutate: mutate,
                    unreadCount,
                };
            },
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const markAsRead = async (id: string) => {
        const URL = `${endpoints.notification.root}/${id}${endpoints.notification.markRead}`;
        await axiosInstance.patch(URL);
    };

    const markAllAsRead = async (ids: string[]) => {
        await Promise.all(
            ids.map((id) => {
                const URL = `${endpoints.notification.root}/${id}${endpoints.notification.markRead}`;
                return axiosInstance.patch(URL);
            })
        );
    };

    const deleteNotification = async (id: string) => {
        const URL = `${endpoints.notification.root}/${id}`;
        await axiosInstance.delete(URL);
    };

    return {
        useGetNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };
}
