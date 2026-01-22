import { useRef, useEffect, useContext } from 'react';

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
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!socket) return;

        const handler = (data: any) => savedCallback.current(data);

        socket.on(event, handler);

        return () => {
            socket.off(event, handler);
        };
    }, [socket, event]);
};
