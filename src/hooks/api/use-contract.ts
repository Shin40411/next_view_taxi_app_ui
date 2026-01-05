import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';

// ----------------------------------------------------------------------

export type IContract = {
    id: string;
    full_name: string;
    birth_year: string;
    phone_number: string;
    cccd: string;
    address: string;
    vehicle: string;
    signature: string;
    created_at: Date;
    user_id: string;
};

export type ICreateContractRequest = {
    full_name: string;
    birth_year: string;
    phone_number: string;
    cccd: string;
    address: string;
    vehicle: string;
    signature: string;
};

export function useContract() {
    const useGetMyContract = () => {
        const { data, isLoading, error, isValidating, mutate } = useSWR<{ statusCode: number, message: string, data: IContract }>(
            endpoints.contract.me,
            fetcher
        );

        const contractData = data?.data;

        const memoizedValue = useMemo(
            () => ({
                contract: contractData || null,
                contractLoading: isLoading,
                contractError: error,
                contractValidating: isValidating,
                mutate,
            }),
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const useGetAllContracts = (page: number = 1, limit: number = 10) => {
        const { data, isLoading, error, isValidating } = useSWR<{ statusCode: number, message: string, data: { data: IContract[], total: number } }>(
            `${endpoints.contract.root}?page=${page}&limit=${limit}`,
            fetcher
        );

        const contractsData = data?.data?.data;
        const contractsCount = data?.data?.total;

        const memoizedValue = useMemo(
            () => ({
                contracts: contractsData || [],
                contractsCount: contractsCount || 0,
                contractsLoading: isLoading,
                contractsError: error,
                contractsValidating: isValidating,
            }),
            [contractsData, contractsCount, error, isLoading, isValidating]
        );

        return memoizedValue;
    };

    const createContract = async (data: ICreateContractRequest) => {
        const res = await axiosInstance.post(endpoints.contract.root, data);
        return res.data;
    };

    const requestContractOtp = async () => {
        const res = await axiosInstance.post(endpoints.auth.requestContractOtp);
        return res.data;
    };

    const verifyContractOtp = async (otp: string) => {
        const res = await axiosInstance.post(endpoints.auth.verifyContractOtp, { otp });
        return res.data;
    };

    return {
        useGetMyContract,
        useGetAllContracts,
        createContract,
        requestContractOtp,
        verifyContractOtp,
    };
}
