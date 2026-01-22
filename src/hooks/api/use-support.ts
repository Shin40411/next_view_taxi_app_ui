import useSWR from 'swr';
import { useMemo } from 'react';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { IFaq, ISupportTicket, ICreateFaqRequest, IUpdateFaqRequest, IReplyTicketRequest, ICreateTicketRequest } from 'src/types/support';

// ----------------------------------------------------------------------

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

    const useGetFaqs = (page: number = 1, limit: number = 10, search?: string) => {
        const url = endpoints.support.faqs;
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);

        const { data, isLoading, error, isValidating, mutate } = useSWR<{ data: { data: IFaq[]; total: number } }>(
            `${url}?${params.toString()}`,
            fetcher
        );

        const memoizedValue = useMemo(
            () => ({
                faqs: data?.data?.data || [],
                totalFaqs: data?.data?.total || 0,
                faqsLoading: isLoading,
                faqsError: error,
                faqsValidating: isValidating,
                mutateFaqs: mutate,
            }),
            [data, error, isLoading, isValidating, mutate]
        );

        return memoizedValue;
    };

    const createFaq = async (data: ICreateFaqRequest) => {
        const res = await axiosInstance.post(endpoints.support.faqs, data);
        return res.data;
    };

    const updateFaq = async (id: string, data: IUpdateFaqRequest) => {
        const res = await axiosInstance.put(`${endpoints.support.faqs}/${id}`, data);
        return res.data;
    };

    const deleteFaq = async (id: string) => {
        const res = await axiosInstance.delete(`${endpoints.support.faqs}/${id}`);
        return res.data;
    };

    return {
        useGetMyTickets,
        useGetAllTickets,
        createTicket,
        replyTicket,
        useGetFaqs,
        createFaq,
        updateFaq,
        deleteFaq,
    };
}
