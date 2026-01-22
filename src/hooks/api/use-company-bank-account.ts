import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { ICompanyBankAccount, ICreateCompanyBankAccountDto, IUpdateCompanyBankAccountDto } from 'src/types/company-bank-account';

// ----------------------------------------------------------------------

export function useCompanyBankAccount() {

    const useGetCompanyBankAccounts = () => {
        const URL = endpoints.companyBankAccount.root;

        const { data, isLoading, error, isValidating, mutate } = useSWR<{ data: ICompanyBankAccount[] }>(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                const accountsData = data?.data || [];

                return {
                    accounts: accountsData,
                    accountsLoading: isLoading,
                    accountsError: error,
                    accountsValidating: isValidating,
                    accountsEmpty: !isLoading && !accountsData?.length,
                    accountsMutate: mutate,
                };
            },
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const useGetActiveCompanyBankAccounts = () => {
        const URL = endpoints.companyBankAccount.active;

        const { data, isLoading, error, isValidating, mutate } = useSWR<{ data: ICompanyBankAccount[] }>(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                const activeAccountsData = data?.data || [];

                return {
                    activeAccounts: activeAccountsData,
                    activeAccountsLoading: isLoading,
                    activeAccountsError: error,
                    activeAccountsValidating: isValidating,
                    activeAccountsEmpty: !isLoading && !activeAccountsData?.length,
                    activeAccountsMutate: mutate,
                };
            },
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const useGetCompanyBankAccount = (id: string | undefined) => {
        const URL = id ? `${endpoints.companyBankAccount.root}/${id}` : null;

        const { data, isLoading, error, isValidating, mutate } = useSWR<ICompanyBankAccount>(URL, fetcher);

        const memoizedValue = useMemo(
            () => {
                const accountData = (data as any)?.data || data;

                return {
                    account: accountData,
                    accountLoading: isLoading,
                    accountError: error,
                    accountValidating: isValidating,
                    accountMutate: mutate,
                };
            },
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const createCompanyBankAccount = async (data: ICreateCompanyBankAccountDto) => {
        const URL = endpoints.companyBankAccount.root;
        const res = await axiosInstance.post(URL, data);
        return res.data;
    };

    const updateCompanyBankAccount = async (id: string, data: IUpdateCompanyBankAccountDto) => {
        const URL = `${endpoints.companyBankAccount.root}/${id}`;
        const res = await axiosInstance.patch(URL, data);
        return res.data;
    };

    const deleteCompanyBankAccount = async (id: string) => {
        const URL = `${endpoints.companyBankAccount.root}/${id}`;
        const res = await axiosInstance.delete(URL);
        return res.data;
    };

    return {
        useGetCompanyBankAccounts,
        useGetActiveCompanyBankAccounts,
        useGetCompanyBankAccount,
        createCompanyBankAccount,
        updateCompanyBankAccount,
        deleteCompanyBankAccount,
    };
}
