import { io, Socket } from 'socket.io-client';
import { useState, useEffect, ReactNode, createContext } from 'react';
import { mutate } from 'swr';
import { endpoints } from 'src/utils/axios';

import { HOST_API } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type SocketContextProps = {
    socket: Socket | null;
    isConnected: boolean;
};

export const SocketContext = createContext<SocketContextProps>({
    socket: null,
    isConnected: false,
});

type Props = {
    children: ReactNode;
};

export function SocketProvider({ children }: Props) {
    const { authenticated, user } = useAuthContext();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let socketInstance: Socket | null = null;

        // console.log('SocketProvider Effect. Auth:', authenticated, 'User:', user?.id, 'Token:', !!user?.accessToken);

        if (authenticated && user?.accessToken) {
            const socketUrl = new URL(HOST_API).origin;
            // console.log('Initializing socket connection to:', socketUrl);

            socketInstance = io(socketUrl, {
                query: {
                    token: user.accessToken,
                },
                transports: ['websocket'],
            });

            socketInstance.on('connect', () => {
                // console.log('Socket connected:', socketInstance?.id);
                setIsConnected(true);
                if (user?.id) {
                    // console.log('Emitting subscribe_all for user:', user.id);
                    socketInstance?.emit('subscribe_all', { userId: user.id });
                }
            });

            socketInstance.on('connect_error', (err) => {
                console.error('Socket connection error:', err);
            });

            socketInstance.on('disconnect', (reason) => {
                // console.log('Socket disconnected:', reason);
                setIsConnected(false);
            });

            // Listen for new messages
            socketInstance.on('receive_message', (message: any) => {
                // console.log('Socket received message:', message);
                mutate(endpoints.chat.conversations);
                mutate(endpoints.chat.totalUnread);

                if (message.conversation?.id) {
                    mutate(endpoints.chat.messages(message.conversation.id));
                } else if (message.conversation_id) {
                    mutate(endpoints.chat.messages(message.conversation_id));
                }

                if (user?.id) {
                    socketInstance?.emit('subscribe_all', { userId: user.id });
                }
            });

            socketInstance.on('message_read', (message: any) => {
                // console.log('Socket message_read:', message);
                mutate(endpoints.chat.conversations);
                mutate(endpoints.chat.totalUnread);

                if (message.conversation?.id) {
                    mutate(endpoints.chat.messages(message.conversation.id));
                } else if (message.conversation_id) {
                    mutate(endpoints.chat.messages(message.conversation_id));
                }
            })

            setSocket(socketInstance);
        } else if (socket) {
            socket.disconnect();
            setSocket(null);
            setIsConnected(false);
        }

        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, [authenticated, user?.accessToken]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}
