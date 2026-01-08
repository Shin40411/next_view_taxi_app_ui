import useSWR from 'swr';
import { useMemo } from 'react';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';

// ----------------------------------------------------------------------

export type ISupportTicket = {
    id: string;
    subject: string;
    content: string;
    admin_reply: string | null;
    status: 'PENDING' | 'RESOLVED' | 'CLOSED';
    created_at: Date;
    updated_at: Date;
    user: {
        id: string;
        full_name: string;
        avatar: string | null;
    };
};

export type ICreateTicketRequest = {
    subject: string;
    content: string;
};

export type IReplyTicketRequest = {
    content: string;
};

export function useSupport() {
    const useGetMyTickets = (args?: { fromDate?: Date | null; toDate?: Date | null }) => {
        let url = endpoints.support.root;
        const params = new URLSearchParams();

        if (args?.fromDate) {
            params.append('fromDate', fDate(args.fromDate));
        }
        if (args?.toDate) {
            params.append('toDate', fDate(args.toDate));
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const { data, isLoading, error, isValidating, mutate } = useSWR<{ data: ISupportTicket[] }>(
            url,
            fetcher
        );

        const memoizedValue = useMemo(
            () => ({
                tickets: data?.data || [],
                ticketsLoading: isLoading,
                ticketsError: error,
                ticketsValidating: isValidating,
                mutate,
            }),
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const useGetAllTickets = (args?: { fromDate?: Date | null; toDate?: Date | null }) => {
        let url = endpoints.support.admin;
        const params = new URLSearchParams();

        if (args?.fromDate) {
            params.append('fromDate', fDate(args.fromDate));
        }
        if (args?.toDate) {
            params.append('toDate', fDate(args.toDate));
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const { data, isLoading, error, isValidating, mutate } = useSWR<{ data: ISupportTicket[] }>(
            url,
            fetcher
        );

        const memoizedValue = useMemo(
            () => ({
                tickets: data?.data || [],
                ticketsLoading: isLoading,
                ticketsError: error,
                ticketsValidating: isValidating,
                mutate,
            }),
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const createTicket = async (data: ICreateTicketRequest) => {
        const res = await axiosInstance.post(endpoints.support.root, data);
        return res.data;
    };

    const replyTicket = async (id: string, data: IReplyTicketRequest) => {
        const res = await axiosInstance.put(endpoints.support.reply(id), data);
        return res.data;
    };

    return {
        useGetMyTickets,
        useGetAllTickets,
        createTicket,
        replyTicket,
    };
}
