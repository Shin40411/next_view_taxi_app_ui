import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';
import { IChatConversation, IChatMessage } from 'src/types/chat';
import { ApiResponse } from 'src/types/api';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function useGetConversations() {
    const { authenticated } = useAuthContext();

    const { data, isLoading, error, mutate } = useSWR<ApiResponse<IChatConversation[]>>(
        authenticated ? endpoints.chat.conversations : null,
        fetcher
    );

    const memoizedValue = useMemo(() => {
        const conversations = data?.data || [];
        return {
            conversations,
            conversationsLoading: isLoading,
            conversationsError: error,
            conversationsValidating: mutate,
            conversationsEmpty: !isLoading && !conversations.length,
        };
    }, [data, error, isLoading, mutate]);

    return memoizedValue;
}

export function useGetConversation(conversationId: string | null) {
    const { authenticated } = useAuthContext();

    const { data, isLoading, error, mutate } = useSWR<ApiResponse<IChatConversation>>(
        (authenticated && conversationId) ? endpoints.chat.detail(conversationId) : null,
        fetcher
    );

    const memoizedValue = useMemo(() => {
        const conversation = data?.data;
        return {
            conversation,
            conversationLoading: isLoading,
            conversationError: error,
            conversationValidating: mutate,
        };
    }, [data, error, isLoading, mutate]);

    return memoizedValue;
}

export function useGetMessages(conversationId: string) {
    const { authenticated } = useAuthContext();

    const { data, isLoading, error, mutate } = useSWR<ApiResponse<{ results: IChatMessage[], total: number }>>(
        (authenticated && conversationId) ? `${endpoints.chat.messages(conversationId)}?limit=10` : null,
        fetcher
    );

    const memoizedValue = useMemo(() => {
        const messages = data?.data?.results || [];
        const total = data?.data?.total || 0;
        return {
            messages,
            totalMessages: total,
            messagesLoading: isLoading,
            messagesError: error,
            messagesValidating: mutate,
            messagesEmpty: !isLoading && !messages.length,
        };
    }, [data, error, isLoading, mutate]);

    return memoizedValue;
}

export function useGetTotalUnread() {
    const { authenticated } = useAuthContext();

    const { data, isLoading, error, mutate } = useSWR<ApiResponse<{ total: number }>>(
        authenticated ? endpoints.chat.totalUnread : null,
        fetcher
    );

    const memoizedValue = useMemo(() => {
        const total = data?.data?.total || 0;
        return {
            totalUnread: total,
            totalUnreadLoading: isLoading,
            totalUnreadError: error,
            totalUnreadValidating: mutate,
        };
    }, [data, error, isLoading, mutate]);

    return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createConversation(partnerId: string): Promise<IChatConversation> {
    const res = await axiosInstance.post<ApiResponse<IChatConversation>>(endpoints.chat.create, { partnerId });
    await mutate(endpoints.chat.conversations);
    return res.data.data;
}

export async function deleteConversation(conversationId: string): Promise<void> {
    await axiosInstance.delete(endpoints.chat.delete(conversationId));
    await mutate(endpoints.chat.conversations);
}

export async function sendMessage(conversationId: string, body: string): Promise<IChatMessage> {
    const res = await axiosInstance.post<ApiResponse<IChatMessage>>(endpoints.chat.messages(conversationId), { body });
    await mutate(`${endpoints.chat.messages(conversationId)}?limit=10`);
    await mutate(endpoints.chat.conversations);
    return res.data.data;
}

export async function getMoreMessages(conversationId: string, before: string, beforeId?: string): Promise<IChatMessage[]> {
    const res = await axiosInstance.get<ApiResponse<{ results: IChatMessage[], total: number }>>(endpoints.chat.messages(conversationId), {
        params: { before, beforeId, limit: 10 }
    });
    return res.data.data.results;
}

export async function markAsRead(conversationId: string): Promise<void> {
    await axiosInstance.patch(endpoints.chat.read(conversationId));
    await mutate(endpoints.chat.conversations);
    await mutate(endpoints.chat.totalUnread);
    await mutate(endpoints.chat.detail(conversationId));
}
