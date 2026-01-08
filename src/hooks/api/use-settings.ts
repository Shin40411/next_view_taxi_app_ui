import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';

// ----------------------------------------------------------------------

export interface ISetting {
    id: number;
    google_client_id: string;
    google_client_secret: string;
    google_callback_url: string;
    zalo_app_id: string;
    zalo_secret_key: string;
    zalo_template_id_otp: string;
    zalo_access_token: string;
    zalo_refresh_token: string;
    mail_host: string;
    mail_port: number;
    mail_user: string;
    mail_pass: string;
    mail_from: string;
}

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
