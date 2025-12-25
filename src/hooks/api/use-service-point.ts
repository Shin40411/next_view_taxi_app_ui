import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';

import { ITrip } from 'src/types/service-point';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------------

export function useServicePoint() {
    const URL = endpoints.customer.pendingRequests;

    const { data, isLoading, error, isValidating } = useSWR<ITrip[]>(URL, fetcher);

    const memoizedValue = useMemo(
        () => {
            const dataResponse = (data as any)?.data;
            let tripsData = [];

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

    const confirmRequest = async (tripId: string) => {
        const res = await axiosInstance.post(`${endpoints.customer.confirmRequest}/${tripId}`);

        mutate(URL);

        return res.data;
    };

    const rejectRequest = async (tripId: string, actualGuestCount: number) => {
        const res = await axiosInstance.post(`${endpoints.customer.rejectRequest}/${tripId}`, {
            actualGuestCount
        });

        mutate(URL);

        return res.data;
    };

    return {
        ...memoizedValue,
        confirmRequest,
        rejectRequest
    };
}
