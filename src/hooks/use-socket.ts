import { useContext, useEffect } from 'react';
import { SocketContext } from 'src/components/socket/socket-provider';

// ----------------------------------------------------------------------

export const useSocket = () => {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }

    return context;
};

export const useSocketListener = (event: string, callback: (data: any) => void) => {
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on(event, callback);

        return () => {
            socket.off(event, callback);
        };
    }, [socket, event, callback]);
};
