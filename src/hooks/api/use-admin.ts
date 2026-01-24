import Cookies from 'js-cookie';
import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { IUserAdmin, IPartnerStats, IUsersResponse, IUpdateUserDto, IServicePointStats, IServicePointTransaction, IServicePointTransactionsResponse } from 'src/types/user';

// ----------------------------------------------------------------------

export function useAdmin() {
    const useGetUsers = (role?: string, page: number = 1, limit: number = 10, search?: string, province?: string) => {
        const accessToken = Cookies.get('accessToken');
        const URL = accessToken ? [endpoints.user.root, { params: { role, page, limit, search, province } }] : null;

        const { data, isLoading, error, isValidating, mutate } = useSWR<IUsersResponse>(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                const dataResponse = (data as any)?.data;

                let usersData: IUserAdmin[] = [];
                let usersTotal = 0;

                if (Array.isArray(dataResponse)) {
                    usersData = dataResponse;
                    usersTotal = Number((data as any)?.total || (data as any)?.count || 0);
                } else if (Array.isArray(dataResponse?.data)) {
                    usersData = dataResponse.data;
                    usersTotal = Number(dataResponse.total || dataResponse.count || (data as any)?.total || 0);
                } else if (Array.isArray((data as any)?.data)) {
                    usersData = (data as any)?.data;
                    usersTotal = Number((data as any)?.total || (data as any)?.count || 0);
                } else {
                    usersData = [];
                    usersTotal = 0;
                }

                return {
                    users: usersData || [],
                    usersTotal,
                    usersLoading: isLoading,
                    usersError: error,
                    usersValidating: isValidating,
                    usersEmpty: !isLoading && !usersData?.length,
                    usersMutate: mutate,
                };
            },
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const useGetUser = (id: string | undefined) => {
        const URL = id ? `${endpoints.user.root}/${id}` : null;

        const { data, isLoading, error, isValidating, mutate } = useSWR<IUserAdmin>(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                // Handle potential response wrapping
                const user = (data as any)?.data || data;

                return {
                    user: user as IUserAdmin,
                    userLoading: isLoading,
                    userError: error,
                    userValidating: isValidating,
                    userMutate: mutate,
                };
            },
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const updateUser = async (id: string, data: IUpdateUserDto) => {
        const URL = `${endpoints.user.root}/${id}`;

        const hasFile = Object.values(data).some((value) => value instanceof File || value instanceof Blob);

        if (hasFile) {
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
                const value = (data as any)[key];
                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });
            await axiosInstance.put(URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            await axiosInstance.put(URL, data);
        }
    };

    const createUser = async (data: IUpdateUserDto) => {
        const URL = endpoints.user.root;

        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            const value = (data as any)[key];
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });

        await axiosInstance.post(URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    const useGetPartnerStats = (range: string, page: number = 1, limit: number = 5) => {
        const URL = [endpoints.admin.stats.partners, { params: { range, page, limit } }];

        const { data, isLoading, error, isValidating, mutate } = useSWR<IPartnerStats[]>(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                const dataResponse = (data as any)?.data;
                const stats = Array.isArray(dataResponse) ? dataResponse : dataResponse?.data || [];
                const total = Number((data as any)?.total || dataResponse?.total || (Array.isArray(dataResponse) ? dataResponse.length : 0));

                return {
                    stats: (stats as IPartnerStats[]),
                    statsTotal: total,
                    statsLoading: isLoading,
                    statsError: error,
                    statsValidating: isValidating,
                    statsMutate: mutate,
                };
            },
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const useGetServicePointStats = (range: string, page: number = 1, limit: number = 5) => {
        const URL = [endpoints.admin.stats.customers, { params: { range, page, limit } }];

        const { data, isLoading, error, isValidating, mutate } = useSWR<IServicePointStats[]>(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                const dataResponse = (data as any)?.data;
                const stats = Array.isArray(dataResponse) ? dataResponse : dataResponse?.data || [];
                const total = Number((data as any)?.total || dataResponse?.total || (Array.isArray(dataResponse) ? dataResponse.length : 0));

                return {
                    stats: (stats as IServicePointStats[]),
                    statsTotal: total,
                    statsLoading: isLoading,
                    statsError: error,
                    statsValidating: isValidating,
                    statsMutate: mutate,
                };
            },
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const useGetServicePointTransactions = (servicePointId: string | null, range: string, page: number = 1, limit: number = 10) => {
        const URL = servicePointId ? [endpoints.admin.stats.transactions(servicePointId), { params: { range, page, limit } }] : null;

        const { data, isLoading, error, isValidating, mutate } = useSWR<IServicePointTransactionsResponse>(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                let transactions: IServicePointTransaction[] = [];
                let total = 0;

                if (data?.data) {
                    if (Array.isArray(data.data)) {
                        transactions = data.data;
                        total = data.total;
                    } else {
                        const nestedData = data.data as unknown as IServicePointTransactionsResponse;
                        if (nestedData?.data && Array.isArray(nestedData.data)) {
                            transactions = nestedData.data;
                            total = nestedData.total;
                        }
                    }
                }

                return {
                    transactions,
                    transactionsTotal: total,
                    transactionsLoading: isLoading,
                    transactionsError: error,
                    transactionsValidating: isValidating,
                    transactionsMutate: mutate,
                };
            },
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const exportPartnerStats = async (range: string) => {
        const URL = endpoints.admin.stats.partners;
        const response = await axiosInstance.get(URL, { params: { range, limit: 0 } });
        return response.data?.data?.data || [];
    }

    const exportServicePointStats = async (range: string) => {
        const URL = endpoints.admin.stats.customers;
        const response = await axiosInstance.get(URL, { params: { range, limit: 0 } });
        return response.data?.data?.data || [];
    }

    const useGetUserTrips = (userId: string | undefined, page: number = 1, limit: number = 10) => {
        const URL = userId ? [endpoints.user.trips(userId), { params: { page, limit } }] : null;

        const { data, isLoading, error, isValidating, mutate } = useSWR(URL as any, fetcher);

        const memoizedValue = useMemo(
            () => {
                const dataResponse = (data as any)?.data;
                const trips = Array.isArray(dataResponse) ? dataResponse : dataResponse?.data || [];
                const total = (data as any)?.total || dataResponse?.total || 0;

                return {
                    trips,
                    tripsTotal: total,
                    tripsLoading: isLoading,
                    tripsError: error,
                    tripsValidating: isValidating,
                    tripsMutate: mutate,
                };
            },
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const changePassword = async (userId: string, newPassword: string) => {
        const URL = endpoints.user.changePassword;
        await axiosInstance.post(URL, { userId, newPassword });
    };

    const restoreUser = async (id: string) => {
        const URL = `${endpoints.user.root}/${id}/restore`;
        await axiosInstance.post(URL);
    };

    const updatePartnerStatus = async (userId: string, status: string, reason?: string) => {
        const url = endpoints.user.partnerStatus(userId);
        const res = await axiosInstance.put(url, { status, reason });
        return res.data;
    };

    const useGetDeletedUsers = (page: number = 1, limit: number = 10, search?: string) => {
        const URL = [`${endpoints.user.root}/deleted/list`, { params: { page, limit, search } }];

        const { data, isLoading, error, isValidating, mutate } = useSWR<IUsersResponse>(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                const dataResponse = (data as any)?.data;

                let usersData: IUserAdmin[] = [];
                let usersTotal = 0;

                if (Array.isArray(dataResponse)) {
                    usersData = dataResponse;
                    usersTotal = Number((data as any)?.total || (data as any)?.count || 0);
                } else if (Array.isArray(dataResponse?.data)) {
                    usersData = dataResponse.data;
                    usersTotal = Number(dataResponse.total || dataResponse.count || (data as any)?.total || 0);
                } else if (Array.isArray((data as any)?.data)) {
                    usersData = (data as any)?.data;
                    usersTotal = Number((data as any)?.total || (data as any)?.count || 0);
                } else {
                    usersData = [];
                    usersTotal = 0;
                }

                return {
                    users: usersData || [],
                    usersTotal,
                    usersLoading: isLoading,
                    usersError: error,
                    usersValidating: isValidating,
                    usersEmpty: !isLoading && !usersData?.length,
                    usersMutate: mutate,
                };
            },
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const deleteUser = async (id: string) => {
        const URL = `${endpoints.user.root}/${id}`;
        await axiosInstance.delete(URL);
    };

    const deleteUserPermanent = async (id: string) => {
        const URL = `${endpoints.user.root}/${id}/permanent`;
        await axiosInstance.delete(URL);
    };

    return {
        useGetUsers,
        useGetUser,
        updateUser,
        createUser,
        useGetPartnerStats,
        useGetServicePointStats,
        exportPartnerStats,
        exportServicePointStats,
        useGetServicePointTransactions,
        useGetUserTrips,
        changePassword,
        updatePartnerStatus,
        deleteUser,
        restoreUser,
        useGetDeletedUsers,
        deleteUserPermanent,
    };
}