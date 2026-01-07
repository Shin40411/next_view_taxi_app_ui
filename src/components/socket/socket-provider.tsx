import { createContext, useEffect, useState, ReactNode, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthContext } from 'src/auth/hooks';
import { HOST_API } from 'src/config-global';

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
            // Extract origin to avoid namespace issues if HOST_API has a path
            const socketUrl = new URL(HOST_API).origin;
            socketInstance = io(socketUrl, {
                query: {
                    token: user.accessToken,
                },
                transports: ['websocket'],
            });

            socketInstance.on('connect', () => {
                console.log('Socket connected:', socketInstance?.id);
                setIsConnected(true);
            });

            socketInstance.on('connect_error', (err) => {
                console.error('Socket connection error:', err);
            });

            socketInstance.on('disconnect', (reason) => {
                console.log('Socket disconnected:', reason);
                setIsConnected(false);
            });

            setSocket(socketInstance);
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
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
