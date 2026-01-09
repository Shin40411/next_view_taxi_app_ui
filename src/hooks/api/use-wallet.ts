import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { endpoints } from 'src/utils/axios';
import axiosInstance from 'src/utils/axios';
import { IWalletTransaction, IWalletResponse } from 'src/types/wallet';

// ----------------------------------------------------------------------

export function useWallet() {
    const useGetVietQR = (amount: number, content: string) => {
        const URL = 'https://api.vietqr.io/v2/generate';
        const payload = {
            accountNo: '91801802783',
            accountName: 'CONG TY CO PHAN TRUYEN THONG NEXTVIEW',
            acqId: '970423',
            amount: amount * 1000,
            addInfo: content,
            format: 'text',
            template: 'compact'
        };

        const { data, isLoading, error } = useSWR(
            amount > 0 ? [URL, payload] : null,
            vietQrFetcher,
            {
                revalidateOnFocus: false,
                revalidateIfStale: false,
                keepPreviousData: true,
            }
        );

        return {
            qrData: data?.data?.qrDataURL,
            qrLoading: isLoading,
            qrError: error,
        };
    };

    const useGetAllWallets = (page: number, limit: number, search?: string, fromDate?: Date | null, toDate?: Date | null) => {
        const URL = [endpoints.admin.wallets.root, { params: { page, limit, search, fromDate, toDate } }];

        const { data, isLoading, error, isValidating, mutate } = useSWR<{ data: IWalletResponse }>(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                const responseData = data?.data;
                const walletsList = responseData?.data || [];

                return {
                    wallets: walletsList,
                    walletsTotal: responseData?.total || 0,
                    walletsLoading: isLoading,
                    walletsError: error,
                    walletsValidating: isValidating,
                    walletsEmpty: !isLoading && !walletsList.length,
                    mutate
                };
            },
            [data, error, isLoading, isValidating]
        );

        return memoizedValue;
    };

    const useGetCustomerTransactions = (page: number, limit: number, search?: string, fromDate?: Date | null, toDate?: Date | null) => {
        const URL = [endpoints.customer.wallet.transactions, { params: { page, limit, search, fromDate, toDate } }];

        const { data, isLoading, error, isValidating, mutate } = useSWR<{ data: IWalletResponse }>(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                const responseData = data?.data;
                const walletsList = responseData?.data || [];

                return {
                    wallets: walletsList,
                    walletsTotal: responseData?.total || 0,
                    walletsLoading: isLoading,
                    walletsError: error,
                    walletsValidating: isValidating,
                    walletsEmpty: !isLoading && !walletsList.length,
                    mutate
                };
            },
            [data, error, isLoading, isValidating]
        );

        return memoizedValue;
    };

    const useGetPartnerTransactions = (page: number, limit: number, search?: string, fromDate?: Date | null, toDate?: Date | null) => {
        const URL = [endpoints.partner.wallet.transactions, { params: { page, limit, search, fromDate, toDate } }];

        const { data, isLoading, error, isValidating, mutate } = useSWR<{ data: IWalletResponse }>(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                const responseData = data?.data;
                const walletsList = responseData?.data || [];

                return {
                    wallets: walletsList,
                    walletsTotal: responseData?.total || 0,
                    walletsLoading: isLoading,
                    walletsError: error,
                    walletsValidating: isValidating,
                    walletsEmpty: !isLoading && !walletsList.length,
                    mutate
                };
            },
            [data, error, isLoading, isValidating]
        );

        return memoizedValue;
    };

    const resolveTransaction = async (transactionId: string, accept: boolean, reason?: string) => {
        const res = await axios.put(endpoints.admin.wallets.resolve, { transactionId, accept, reason });
        return res.data;
    };

    const customerTransferWallet = async (receiverId: string, amount: number) => {
        const res = await axiosInstance.post(endpoints.customer.wallet.transfer, { receiverId, amount });
        return res.data;
    };

    const customerDepositWallet = async (amount: number, bill?: File | null) => {
        const formData = new FormData();
        formData.append('amount', amount.toString());
        if (bill) {
            formData.append('bill', bill);
        }

        const res = await axiosInstance.post(endpoints.customer.wallet.deposit, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    };

    const partnerWithdrawWallet = async (amount: number) => {
        const res = await axiosInstance.post(endpoints.partner.wallet.withdraw, { amount });
        return res.data;
    };

    const partnerTransferWallet = async (receiverId: string, amount: number) => {
        const res = await axiosInstance.post(endpoints.partner.wallet.transfer, { receiverId, amount });
        return res.data;
    };

    const partnerDepositWallet = async (amount: number, bill?: File | null) => {
        const formData = new FormData();
        formData.append('amount', amount.toString());
        if (bill) {
            formData.append('bill', bill);
        }

        const res = await axiosInstance.post(endpoints.partner.wallet.deposit, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    };

    return {
        useGetAllWallets,
        useGetCustomerTransactions,
        useGetPartnerTransactions,
        useGetVietQR,
        resolveTransaction,
        customerTransferWallet,
        customerDepositWallet,
        partnerWithdrawWallet,
        partnerTransferWallet,
        partnerDepositWallet,
    };
}

// ----------------------------------------------------------------------

const vietQrFetcher = async ([url, payload]: [string, any]) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    return res.json();
};

const fetcher = async (args: any) => {
    const [url, config] = Array.isArray(args) ? args : [args];
    const res = await axios.get(url, { ...config });
    return res.data;
};
