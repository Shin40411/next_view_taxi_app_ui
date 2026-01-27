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

        if (authenticated && user?.accessToken) {
            const socketUrl = new URL(HOST_API).origin;

            socketInstance = io(socketUrl, {
                query: {
                    token: user.accessToken,
                },
                transports: ['websocket'],
            });

            socketInstance.on('connect', () => {
                setIsConnected(true);
                if (user?.id) {
                    socketInstance?.emit('subscribe_all', { userId: user.id });
                }
            });

            socketInstance.on('connect_error', (err) => {
                console.error('Socket connection error:', err);
            });

            socketInstance.on('disconnect', (reason) => {
                setIsConnected(false);
            });

            socketInstance.on('receive_message', (message: any) => {
                mutate(endpoints.chat.conversations);
                mutate(endpoints.chat.totalUnread);

                if (message.conversation?.id) {
                    mutate(`${endpoints.chat.messages(message.conversation.id)}?limit=10`);
                } else if (message.conversation_id) {
                    mutate(`${endpoints.chat.messages(message.conversation_id)}?limit=10`);
                }

                if (user?.id) {
                    socketInstance?.emit('subscribe_all', { userId: user.id });
                }
            });

            socketInstance.on('message_read', (message: any) => {
                mutate(endpoints.chat.conversations);
                mutate(endpoints.chat.totalUnread);

                if (message.conversation?.id) {
                    mutate(`${endpoints.chat.messages(message.conversation.id)}?limit=10`);
                } else if (message.conversation_id) {
                    mutate(`${endpoints.chat.messages(message.conversation_id)}?limit=10`);
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
