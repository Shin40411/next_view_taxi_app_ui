import useSWRInfinite from 'swr/infinite';
import { useMemo } from 'react';

import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';
import { INotification } from 'src/types/notifications';

// ----------------------------------------------------------------------

export function useNotify() {
    const useGetNotifications = () => {
        const getKey = (pageIndex: number, previousPageData: any) => {
            if (previousPageData && !previousPageData.data?.length) return null;
            return [endpoints.notification.root, { params: { page: pageIndex + 1, limit: 10 } }];
        };

        const { data, isLoading, error, isValidating, mutate, size, setSize } = useSWRInfinite(getKey, fetcher);

        const memoizedValue = useMemo(
            () => {
                const notifications = data ? data.flatMap((page: any) => {
                    if (page.data && Array.isArray(page.data)) return page.data;
                    if (page.data && page.data.data && Array.isArray(page.data.data)) return page.data.data;
                    return [];
                }) : [];

                const firstPage = data && data.length > 0 ? data[0] : null;
                const total = firstPage ? (firstPage.total || (firstPage.data && firstPage.data.total) || 0) : 0;

                const isEnd = notifications.length >= total;

                // Calculate unread count from the full list if available, or rely on a separate API if needed.
                // For now, calculating from loaded notifications which might be incomplete but acceptable for UI badge
                // or we should fetch unread count separately. Given current architecture, let's filter loaded ones.
                const unreadCount = notifications.filter((item: INotification) => !item.is_read).length;

                return {
                    notifications,
                    notificationsLoading: isLoading,
                    notificationsError: error,
                    notificationsValidating: isValidating,
                    notificationsEmpty: !isLoading && !notifications.length,
                    notificationsMutate: mutate,
                    unreadCount,
                    size,
                    setSize,
                    isEnd,
                };
            },
            [data, error, isLoading, isValidating, mutate, size, setSize]
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
