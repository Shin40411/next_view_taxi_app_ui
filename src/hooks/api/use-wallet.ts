import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useWallet() {
    const useGetAllWallets = (page: number, limit: number, search?: string) => {
        const URL = [endpoints.admin.wallets, { params: { page, limit, search } }];

        const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                // console.log('useGetAllWallets data:', data);
                const walletsList = Array.isArray(data?.data) ? data.data : [];
                return {
                    wallets: walletsList,
                    walletsTotal: data?.total || 0,
                    walletsLoading: isLoading,
                    walletsError: error,
                    walletsValidating: isValidating,
                    walletsEmpty: !isLoading && !walletsList.length,
                };
            },
            [data, error, isLoading, isValidating]
        );

        return memoizedValue;
    };

    const depositWallet = async (servicePointId: string, amountVnd: number) => {
        const res = await axios.post(`${endpoints.admin.wallets}/deposit`, {
            servicePointId,
            amountVnd,
        });
        return res.data;
    };

    return {
        useGetAllWallets,
        depositWallet,
    };
}

// ----------------------------------------------------------------------

const fetcher = (args: any) => {
    const [url, config] = Array.isArray(args) ? args : [args];
    return axios.get(url, { ...config }).then((res) => res.data);
};
