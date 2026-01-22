import { useState, useMemo, useEffect } from 'react';

import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import { IChatConversation } from 'src/types/chat';

import ConversationList from './conversation-list';
import ChatWindow from './chat-window';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    boxChatId: string;
};

const MOCK_CONVERSATIONS: IChatConversation[] = [
    {
        id: '1',
        type: 'ONE_TO_ONE',
        unreadCount: 2,
        participants: [
            {
                id: '101',
                name: 'Nguyễn Văn A',
                role: 'driver',
                email: 'driver1@example.com',
                address: '',
                avatarUrl: '',
                phoneNumber: '0901234567',
                lastActivity: new Date(),
                status: 'online',
            },
            {
                id: 'me',
                name: 'Tôi',
                role: 'customer',
                email: 'me@example.com',
                address: '',
                avatarUrl: '',
                phoneNumber: '',
                lastActivity: new Date(),
                status: 'online',
            },
        ],
        messages: [
            { id: 'm1', body: 'Chào bạn, tôi đang tới', contentType: 'text', senderId: '101', createdAt: new Date(new Date().getTime() - 1000 * 60 * 5), attachments: [] },
            { id: 'm2', body: 'Vâng, tôi đang đợi ở sảnh', contentType: 'text', senderId: 'me', createdAt: new Date(new Date().getTime() - 1000 * 60 * 4), attachments: [] },
            { id: 'm3', body: 'Tôi đang đến đón bạn nhé', contentType: 'text', senderId: '101', createdAt: new Date(new Date().getTime() - 1000 * 60 * 1), attachments: [] },
        ],
    },
    {
        id: '2',
        type: 'ONE_TO_ONE',
        unreadCount: 0,
        participants: [
            {
                id: '102',
                name: 'Trần Thị B',
                role: 'driver',
                email: 'driver2@example.com',
                address: '',
                avatarUrl: '',
                phoneNumber: '0901234568',
                lastActivity: new Date(),
                status: 'offline',
            },
            {
                id: 'me',
                name: 'Tôi',
                role: 'customer',
                email: 'me@example.com',
                address: '',
                avatarUrl: '',
                phoneNumber: '',
                lastActivity: new Date(),
                status: 'online',
            },
        ],
        messages: [
            { id: 'm1', body: 'Cảm ơn bạn đã sử dụng dịch vụ', contentType: 'text', senderId: '102', createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2), attachments: [] },
        ],
    },
    {
        id: '3',
        type: 'ONE_TO_ONE',
        unreadCount: 0,
        participants: [
            {
                id: '103',
                name: 'Lê Văn C',
                role: 'driver',
                email: 'driver3@example.com',
                address: '',
                avatarUrl: '',
                phoneNumber: '0901234569',
                lastActivity: new Date(),
                status: 'busy',
            },
            {
                id: 'me',
                name: 'Tôi',
                role: 'customer',
                email: 'me@example.com',
                address: '',
                avatarUrl: '',
                phoneNumber: '',
                lastActivity: new Date(),
                status: 'online',
            },
        ],
        messages: [
            { id: 'm1', body: 'Bạn đợi mình 5 phút nhé', contentType: 'text', senderId: '103', createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24), attachments: [] },
        ],
    },
];

export default function ConversationsDrawer({ open, onClose, boxChatId }: Props) {
    const [conversations, setConversations] = useState<IChatConversation[]>(MOCK_CONVERSATIONS);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        if (boxChatId) {
            setSelectedId(boxChatId);
        }
    }, [boxChatId]);

    const selectedConversation = useMemo(
        () => conversations.find((item) => item.id === selectedId),
        [conversations, selectedId]
    );

    const handleSelectConversation = (id: string) => {
        setSelectedId(id);
    };

    const handleBack = () => {
        setSelectedId(null);
    };

    const isChatOpen = !!selectedId && !!selectedConversation;

    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor="right"
            PaperProps={{
                sx: { width: { xs: '100%', md: 500 } },
            }}
        >
            {!isChatOpen && (
                <>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
                        <Typography variant="h6">Tin nhắn</Typography>
                        <IconButton onClick={onClose}>
                            <Iconify icon="mingcute:close-line" />
                        </IconButton>
                    </Stack>
                    <ConversationList
                        conversations={conversations}
                        onSelectConversation={handleSelectConversation}
                    />
                </>
            )}

            {isChatOpen && (
                <ChatWindow
                    conversation={selectedConversation}
                    onBack={handleBack}
                />
            )}
        </Drawer>
    );
}
