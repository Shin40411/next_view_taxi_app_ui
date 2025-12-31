import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';

import { ITrip, ITripStats } from 'src/types/service-point';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------------

export function useServicePoint() {
    const URL = endpoints.customer.pendingRequests;

    const { data, isLoading, error, isValidating } = useSWR<ITrip[]>(URL, fetcher);

    const memoizedValue = useMemo(
        () => {
            const dataResponse = (data as any)?.data;
            let tripsData: ITrip[] = [];

            if (Array.isArray(dataResponse)) {
                tripsData = dataResponse;
            } else if (Array.isArray(dataResponse?.data)) {
                tripsData = dataResponse.data;
            } else if (Array.isArray((data as any)?.data)) {
                tripsData = (data as any)?.data;
            } else {
                tripsData = [];
            }

            return {
                trips: tripsData || [],
                tripsLoading: isLoading,
                tripsError: error,
                tripsValidating: isValidating,
                tripsEmpty: !isLoading && !tripsData?.length,
            };
        },
        [data, error, isLoading, isValidating]
    );

    const useGetCompletedRequests = () => {
        const URL_COMPLETED = endpoints.customer.completedRequests;
        const { data, isLoading, error, isValidating, mutate } = useSWR<ITrip[]>(URL_COMPLETED, fetcher);

        const memoizedCompleted = useMemo(
            () => {
                const dataResponse = (data as any)?.data || data;
                let tripsData: ITrip[] = [];

                if (Array.isArray(dataResponse)) {
                    tripsData = dataResponse;
                } else if (Array.isArray(dataResponse?.data)) {
                    tripsData = dataResponse.data;
                } else {
                    tripsData = [];
                }

                return {
                    completedTrips: tripsData,
                    mutate,
                    completedLoading: isLoading,
                    completedError: error,
                    completedValidating: isValidating,
                    completedEmpty: !isLoading && !tripsData.length,
                };
            },
            [data, error, isLoading, isValidating]
        );

        return memoizedCompleted;
    };

    const useGetRejectedRequests = () => {
        const URL_REJECTED = endpoints.customer.rejectedRequests;
        const { data, isLoading, error, isValidating, mutate } = useSWR<ITrip[]>(URL_REJECTED, fetcher);

        const memoizedRejected = useMemo(
            () => {
                const dataResponse = (data as any)?.data || data;
                let tripsData: ITrip[] = [];

                if (Array.isArray(dataResponse)) {
                    tripsData = dataResponse;
                } else if (Array.isArray(dataResponse?.data)) {
                    tripsData = dataResponse.data;
                } else {
                    tripsData = [];
                }

                return {
                    rejectedTrips: tripsData,
                    mutate,
                    rejectedLoading: isLoading,
                    rejectedError: error,
                    rejectedValidating: isValidating,
                    rejectedEmpty: !isLoading && !tripsData.length,
                };
            },
            [data, error, isLoading, isValidating]
        );

        return memoizedRejected;
    };

    const useGetArrivedRequests = () => {
        const URL_ARRIVED = endpoints.customer.arrivedRequests;
        const { data, isLoading, error, isValidating, mutate } = useSWR<ITrip[]>(URL_ARRIVED, fetcher);

        const memoizedArrived = useMemo(
            () => {
                const dataResponse = (data as any)?.data || data;
                let tripsData: ITrip[] = [];

                if (Array.isArray(dataResponse)) {
                    tripsData = dataResponse;
                } else if (Array.isArray(dataResponse?.data)) {
                    tripsData = dataResponse.data;
                } else {
                    tripsData = [];
                }

                return {
                    arrivedTrips: tripsData,
                    mutate,
                    arrivedLoading: isLoading,
                    arrivedError: error,
                    arrivedValidating: isValidating,
                    arrivedEmpty: !isLoading && !tripsData.length,
                };
            },
            [data, error, isLoading, isValidating]
        );

        return memoizedArrived;
    };

    const useGetCancelledRequests = () => {
        const URL_CANCELLED = endpoints.customer.cancelledRequests;
        const { data, isLoading, error, isValidating, mutate } = useSWR<ITrip[]>(URL_CANCELLED, fetcher);

        const memoizedCancelled = useMemo(
            () => {
                const dataResponse = (data as any)?.data || data;
                let tripsData: ITrip[] = [];

                if (Array.isArray(dataResponse)) {
                    tripsData = dataResponse;
                } else if (Array.isArray(dataResponse?.data)) {
                    tripsData = dataResponse.data;
                } else {
                    tripsData = [];
                }

                return {
                    cancelledTrips: tripsData,
                    mutate,
                    cancelledLoading: isLoading,
                    cancelledError: error,
                    cancelledValidating: isValidating,
                    cancelledEmpty: !isLoading && !tripsData.length,
                };
            },
            [data, error, isLoading, isValidating]
        );

        return memoizedCancelled;
    };

    const useGetBudgetStats = (period: string) => {
        let range = 'today';
        switch (period) {
            case 'week':
                range = '7_days';
                break;
            case 'month':
                range = 'this_month';
                break;
            default:
                range = period;
                break;
        }

        const URL_STATS = [endpoints.customer.statsBudget, { params: { range } }];
        const { data, isLoading, error, isValidating, mutate } = useSWR<{ totalSpent: number }>(URL_STATS, fetcher);

        const memoizedStats = useMemo(
            () => {
                const statsData = (data as any)?.data || data;

                return {
                    stats: statsData as ITripStats,
                    statsLoading: isLoading,
                    statsError: error,
                    statsValidating: isValidating,
                    mutate,
                };
            },
            [data, error, isLoading, isValidating]
        );

        return memoizedStats;
    };

    const confirmRequest = async (tripId: string, actualGuestCount: number) => {
        const res = await axiosInstance.post(`${endpoints.customer.confirmRequest}/${tripId}`, { actualGuestCount });

        mutate(endpoints.customer.arrivedRequests);
        mutate(endpoints.customer.completedRequests);
        mutate(endpoints.customer.cancelledRequests);

        return res.data;
    };

    const updateMyServicePoint = async (data: any) => {
        const res = await axiosInstance.post(endpoints.customer.updateServicePoint, data);

        // Invalidate fetching
        // mutate(endpoints.customer.myServicePoint); 

        return res.data;
    };

    const rejectRequest = async (tripId: string, actualGuestCount: number, reason?: string) => {
        const res = await axiosInstance.post(`${endpoints.customer.rejectRequest}/${tripId}`, {
            actualGuestCount,
            reason
        });

        mutate(URL);
        mutate(endpoints.customer.arrivedRequests);
        mutate(endpoints.customer.rejectedRequests);
        mutate(endpoints.customer.cancelledRequests);
        // mutate(endpoints.customer.statsBudget);

        return res.data;
    };

    return {
        ...memoizedValue,
        useGetBudgetStats,
        updateMyServicePoint,
        confirmRequest,
        rejectRequest,
        useGetCompletedRequests,
        useGetRejectedRequests,
        useGetArrivedRequests,
        useGetCancelledRequests
    };
}
