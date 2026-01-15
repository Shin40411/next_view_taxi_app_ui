import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';

import { ITrip, ITripStats, IPaginatedResponse } from 'src/types/service-point';

// ----------------------------------------------------------------------

function useGetPaginatedTrips(url: string, page: number = 0, rowsPerPage: number = 5) {
    const URL_WITH_PARAMS = [url, { params: { page: page + 1, limit: rowsPerPage } }];
    const { data, isLoading, error, isValidating, mutate } = useSWR<IPaginatedResponse<ITrip>>(URL_WITH_PARAMS, fetcher, {
        keepPreviousData: true,
    });

    const memoizedValue = useMemo(
        () => {
            const responseData = (data as any)?.data;
            const tripsData = responseData?.data || [];
            const meta = responseData?.meta;

            return {
                trips: tripsData,
                total: meta?.total || 0,
                loading: isLoading,
                error: error,
                validating: isValidating,
                empty: !isLoading && !tripsData.length,
                mutate,
            };
        },
        [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

export function useGetAllRequests(page: number = 0, rowsPerPage: number = 5) {
    const { trips, total, loading, error, validating, empty, mutate } = useGetPaginatedTrips(endpoints.customer.allRequests, page, rowsPerPage);
    return {
        trips,
        tripsTotal: total,
        tripsLoading: loading,
        tripsError: error,
        tripsValidating: validating,
        tripsEmpty: empty,
        mutate
    };
}

export function useGetPendingRequests(page: number = 0, rowsPerPage: number = 5) {
    const { trips, total, loading, error, validating, empty, mutate } = useGetPaginatedTrips(endpoints.customer.pendingRequests, page, rowsPerPage);
    return {
        trips,
        tripsTotal: total,
        tripsLoading: loading,
        tripsError: error,
        tripsValidating: validating,
        tripsEmpty: empty,
        mutate
    };
}

export function useGetCompletedRequests(page: number = 0, rowsPerPage: number = 5) {
    const { trips, total, loading, error, validating, empty, mutate } = useGetPaginatedTrips(endpoints.customer.completedRequests, page, rowsPerPage);
    return {
        completedTrips: trips,
        completedTotal: total,
        completedLoading: loading,
        completedError: error,
        completedValidating: validating,
        completedEmpty: empty,
        mutate
    };
}

export function useGetRejectedRequests(page: number = 0, rowsPerPage: number = 5) {
    const { trips, total, loading, error, validating, empty, mutate } = useGetPaginatedTrips(endpoints.customer.rejectedRequests, page, rowsPerPage);
    return {
        rejectedTrips: trips,
        rejectedTotal: total,
        rejectedLoading: loading,
        rejectedError: error,
        rejectedValidating: validating,
        rejectedEmpty: empty,
        mutate
    };
}

export function useGetArrivedRequests(page: number = 0, rowsPerPage: number = 5) {
    const { trips, total, loading, error, validating, empty, mutate } = useGetPaginatedTrips(endpoints.customer.arrivedRequests, page, rowsPerPage);
    return {
        arrivedTrips: trips,
        arrivedTotal: total,
        arrivedLoading: loading,
        arrivedError: error,
        arrivedValidating: validating,
        arrivedEmpty: empty,
        mutate
    };
}

export function useGetCancelledRequests(page: number = 0, rowsPerPage: number = 5) {
    const { trips, total, loading, error, validating, empty, mutate } = useGetPaginatedTrips(endpoints.customer.cancelledRequests, page, rowsPerPage);
    return {
        cancelledTrips: trips,
        cancelledTotal: total,
        cancelledLoading: loading,
        cancelledError: error,
        cancelledValidating: validating,
        cancelledEmpty: empty,
        mutate
    };
}

export function useGetBudgetStats(period: string) {
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
}

export function useServicePoint() {
    const confirmRequest = async (tripId: string, actualGuestCount: number) => {
        const res = await axiosInstance.post(`${endpoints.customer.confirmRequest}/${tripId}`, { actualGuestCount });

        mutate((key) => Array.isArray(key) && key[0] === endpoints.customer.allRequests);

        return res.data;
    };

    const updateMyServicePoint = async (data: any) => {
        const res = await axiosInstance.post(endpoints.customer.updateServicePoint, data);

        return res.data;
    };

    const rejectRequest = async (tripId: string, actualGuestCount: number, reason?: string) => {
        const res = await axiosInstance.post(`${endpoints.customer.rejectRequest}/${tripId}`, {
            actualGuestCount,
            reason
        });

        mutate((key) => Array.isArray(key) && key[0] === endpoints.customer.allRequests);

        return res.data;
    };

    return {
        updateMyServicePoint,
        confirmRequest,
        rejectRequest,
    };
}
