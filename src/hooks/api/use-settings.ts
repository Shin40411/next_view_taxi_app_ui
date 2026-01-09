import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';
import { ISetting } from 'src/types/settings';

// ----------------------------------------------------------------------


export function useSettings() {
    const URL = endpoints.settings.root;

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            settings: (data as any)?.data as ISetting,
            settingsLoading: isLoading,
            settingsError: error,
            settingsValidating: isValidating,
            settingsMutate: mutate,
        }),
        [data, error, isLoading, isValidating, mutate]
    );

    const updateSettings = async (data: Partial<ISetting>) => {
        const res = await axiosInstance.put(URL, data);
        mutate(res.data);
        return res.data;
    };

    return {
        ...memoizedValue,
        updateSettings,
    };
}
