import useSWR from 'swr';
import { useMemo } from 'react';

import { endpoints, fetcher } from 'src/utils/axios';

import { IUsersResponse, IUserAdmin } from 'src/types/user';

// ----------------------------------------------------------------------

export function useAdmin() {
    const useGetUsers = (role?: string, page: number = 1, limit: number = 10) => {
        const URL = [endpoints.user.root, { params: { role, page, limit } }];

        const { data, isLoading, error, isValidating } = useSWR<IUsersResponse>(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                const dataResponse = (data as any)?.data;

                let usersData: IUserAdmin[] = [];
                let usersTotal = 0;

                if (Array.isArray(dataResponse)) {
                    usersData = dataResponse;
                    usersTotal = (data as any)?.total || 0;
                } else if (Array.isArray(dataResponse?.data)) {
                    usersData = dataResponse.data;
                    usersTotal = dataResponse.total || 0;
                } else if (Array.isArray((data as any)?.data)) {
                    usersData = (data as any)?.data;
                    usersTotal = (data as any)?.total || 0;
                } else {
                    usersData = [];
                    usersTotal = 0;
                }

                return {
                    users: usersData || [],
                    usersTotal: usersTotal,
                    usersLoading: isLoading,
                    usersError: error,
                    usersValidating: isValidating,
                    usersEmpty: !isLoading && !usersData?.length,
                };
            },
            [data, error, isLoading, isValidating]
        );

        return memoizedValue;
    };

    const useGetUser = (id: string | undefined) => {
        const URL = id ? `${endpoints.user.root}/${id}` : null;

        const { data, isLoading, error, isValidating } = useSWR<IUserAdmin>(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                // Handle potential response wrapping
                const user = (data as any)?.data || data;

                return {
                    user: user as IUserAdmin,
                    userLoading: isLoading,
                    userError: error,
                    userValidating: isValidating,
                };
            },
            [data, error, isLoading, isValidating]
        );

        return memoizedValue;
    };

    return {
        useGetUsers,
        useGetUser,
    };
}
