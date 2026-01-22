import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance from 'src/utils/axios';
import axios, { endpoints } from 'src/utils/axios';

import { ICompanyBankAccount } from 'src/types/company-bank-account';
import { IBank, IWalletResponse, IBankListResponse } from 'src/types/wallet';

import { useCompanyBankAccount } from './use-company-bank-account';

// ----------------------------------------------------------------------

export function useWallet() {
    const useGetVietQR = (
        amount: number,
        content: string,
        bankInfo?: { accountNo: string; accountName: string; acqId: string }
    ) => {
        const { useGetCompanyBankAccounts } = useCompanyBankAccount();
        const { accounts } = useGetCompanyBankAccounts();
        const { banks } = useGetBanks();

        const activeAccount = accounts.find((account: ICompanyBankAccount) => account.isActive);
        const activeBank = banks.find((bank: IBank) => `${bank.shortName} - ${bank.name}` === activeAccount?.bankName);

        const currentBankInfo = bankInfo || {
            accountNo: activeAccount?.accountNo || '91801802783',
            accountName: activeAccount?.accountName || 'CONG TY CO PHAN TRUYEN THONG NEXTVIEW',
            acqId: activeBank?.bin || '',
        };


        const URL = 'https://api.vietqr.io/v2/generate';
        const payload = {
            accountNo: currentBankInfo.accountNo,
            accountName: currentBankInfo.accountName,
            acqId: currentBankInfo.acqId,
            amount,
            addInfo: content,
            format: 'text',
            template: 'compact',
        };

        const shouldFetch =
            amount > 0 && !!currentBankInfo.accountNo && !!currentBankInfo.accountName && !!currentBankInfo.acqId;

        const { data, isLoading, error } = useSWR(shouldFetch ? [URL, payload] : null, vietQrFetcher, {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            keepPreviousData: true,
        });

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

    const useGetBanks = () => {
        const URL = endpoints.admin.wallets.banks;

        const { data, isLoading, error, isValidating } = useSWR<IBankListResponse>(URL, fetcher, {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        });

        const memoizedValue = useMemo(
            () => {
                const responseData = data?.data;
                const banksList = (Array.isArray(responseData) ? responseData : (responseData as any)?.data) || [];
                return {
                    banks: banksList,
                    banksLoading: isLoading,
                    banksError: error,
                    banksValidating: isValidating,
                    banksEmpty: !isLoading && !banksList.length,
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

    const exportWallets = async (search?: string, fromDate?: Date | null, toDate?: Date | null) => {
        const params = { page: 1, limit: 99999, search, fromDate, toDate };
        const res = await axiosInstance.get(endpoints.admin.wallets.root, { params });
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
        useGetBanks,
        exportWallets,
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
