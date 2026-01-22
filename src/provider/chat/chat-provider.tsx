import { useContext, useState, ReactNode, useCallback } from 'react';
import { ChatDrawerContext } from './chat-context';
import ConversationsDrawer from 'src/sections/chat/conversations-drawer';

export function ChatDrawerProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState('');

    const openDrawer = () => setIsOpen(true);
    const closeDrawer = () => setIsOpen(false);
    const toggleDrawer = () => setIsOpen((prev) => !prev);
    const setId = useCallback((id: string) => {
        setSelectedId(id);
        setIsOpen(true);
    }, []);

    return (
        <ChatDrawerContext.Provider value={{ isOpen, selectedId, openDrawer, closeDrawer, toggleDrawer, setId }}>
            {children}

            <ConversationsDrawer
                open={isOpen}
                onClose={closeDrawer}
                boxChatId={selectedId}
            />
        </ChatDrawerContext.Provider>
    );
}

export const useChatDrawer = () => {
    const context = useContext(ChatDrawerContext);
    if (!context) {
        throw new Error('useChatDrawer must be used within a ChatDrawerProvider');
    }
    return context;
};