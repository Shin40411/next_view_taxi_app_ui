import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';
import {
    ISearchDestinationResponse,
    IGetMyRequestsResponse,
    IPartnerStats,
    ICreateTripRequestResponse
} from 'src/types/partner';

// ----------------------------------------------------------------------

export function usePartner() {
    const useSearchDestination = (keyword: string) => {
        const URL = [endpoints.partner.searchDestination, { params: { keyword: keyword || '', limit: 20 } }];

        const { data, isLoading, error, isValidating } = useSWR<ISearchDestinationResponse>(
            URL,
            fetcher,
            {
                keepPreviousData: true,
            }
        );

        const memoizedValue = useMemo(
            () => {
                return {
                    searchResults: data?.data || [],
                    searchLoading: isLoading,
                    searchError: error,
                    searchValidating: isValidating,
                    searchEmpty: !isLoading && !data?.data.length,
                };
            },
            [data?.data, error, isLoading, isValidating]
        );

        return memoizedValue;
    };

    const useGetMyRequests = (page: number = 0, rowsPerPage: number = 5) => {
        const URL = [endpoints.partner.myRequests, { params: { page: page + 1, limit: rowsPerPage } }];

        const { data, isLoading, error, isValidating, mutate } = useSWR<IGetMyRequestsResponse>(
            URL,
            fetcher,
            {
                keepPreviousData: true,
            }
        );

        const memoizedValue = useMemo(
            () => {
                const responseData = data?.data?.data || [];
                const meta = data?.data?.meta;

                return {
                    requests: responseData,
                    requestsTotal: meta?.total || 0,
                    requestsLoading: isLoading,
                    requestsError: error,
                    requestsValidating: isValidating,
                    requestsEmpty: !isLoading && !responseData.length,
                    mutate,
                };
            },
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const useGetStats = (range: 'today' | 'yesterday' | 'week' | 'month' = 'today') => {
        const { data, isLoading, error, isValidating } = useSWR<{ statusCode: number, message: string, data: IPartnerStats }>(
            [endpoints.partner.stats, { params: { range } }],
            fetcher
        );

        const memoizedValue = useMemo(
            () => {
                return {
                    stats: data?.data || null,
                    statsLoading: isLoading,
                    statsError: error,
                    statsValidating: isValidating,
                };
            },
            [data?.data, error, isLoading, isValidating]
        );

        return memoizedValue;
    };

    const useGetHomeStats = () => {
        const { data, isLoading, error, isValidating } = useSWR(endpoints.partner.home, fetcher);

        const memoizedValue = useMemo(
            () => {
                return {
                    homeStats: data?.data || null,
                    homeStatsLoading: isLoading,
                    homeStatsError: error,
                    homeStatsValidating: isValidating,
                };
            },
            [data, error, isLoading, isValidating]
        );

        return memoizedValue;
    };

    const createTripRequest = async (servicePointId: string, guestCount: number) => {
        const res = await axiosInstance.post(endpoints.partner.createRequest, {
            servicePointId,
            guestCount,
        });
        return res.data as ICreateTripRequestResponse;
    };

    const confirmArrival = async (tripId: string) => {
        const res = await axiosInstance.post(`${endpoints.partner.confirmArrival}/${tripId}`);
        return res.data;
    };

    const cancelRequest = async (tripId: string, reason?: string) => {
        const res = await axiosInstance.post(`${endpoints.partner.cancelRequest}/${tripId}`, { reason });
        return res.data;
    };

    return {
        useSearchDestination,
        useGetMyRequests,
        useGetStats,
        useGetHomeStats,
        createTripRequest,
        confirmArrival,
        cancelRequest,
    };
}
