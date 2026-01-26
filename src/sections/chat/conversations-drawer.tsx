import { useState, useMemo, useEffect, useCallback } from 'react';

import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import debounce from 'lodash/debounce';

import Iconify from 'src/components/iconify';
import { useGetConversations, markAsRead, useGetConversation, createConversation } from 'src/hooks/api/use-conversation';
import { useSocket } from 'src/hooks/use-socket';

import ConversationList from './conversation-list';
import ChatWindow from './chat-window';
import { useAuthContext } from 'src/auth/hooks';
import { useChatDrawer } from 'src/provider/chat/chat-provider';
import { useAdmin } from 'src/hooks/api/use-admin';
import { getFullImageUrl } from 'src/utils/get-image';
import { useTheme } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    boxChatId: string;
};

export default function ConversationsDrawer({ open, onClose, boxChatId }: Props) {
    const { conversations, conversationsValidating } = useGetConversations();
    const { user } = useAuthContext();
    const { setId } = useChatDrawer();
    const { useGetUsers } = useAdmin();
    const theme = useTheme();
    const { socket } = useSocket();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (open && socket && user?.id) {
            socket.emit('subscribe_all', { userId: user.id });
        }
    }, [open, socket, user?.id]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = () => {
            conversationsValidating();
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, conversationsValidating]);

    useEffect(() => {
        if (boxChatId) {
            setSelectedId(boxChatId);
        }
    }, [boxChatId]);

    const isAdminOrMonitor = user?.role === 'ADMIN' || user?.role === 'MONITOR';

    const { users: searchResults } = useGetUsers(
        undefined,
        1,
        20,
        isAdminOrMonitor ? searchQuery : undefined
    );

    const handleSearch = useMemo(
        () => debounce((value: string) => {
            setSearchQuery(value);
        }, 500),
        []
    );

    const selectedConversation = useMemo(
        () => conversations.find((item) => item.id === selectedId),
        [conversations, selectedId]
    );

    const { conversation: singleConversation, conversationLoading } = useGetConversation(
        selectedId && !selectedConversation ? selectedId : null
    );

    const finalConversation = selectedConversation || singleConversation;
    const loading = conversationLoading;

    const handleSelectConversation = async (id: string) => {
        try {
            setSelectedId(id);
            await markAsRead(id);
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleBack = () => {
        setSelectedId(null);
        setId('');
    };

    const handleUserSelect = async (selectedUser: any) => {
        if (!selectedUser) return;
        try {
            const conversation = await createConversation(selectedUser.id);
            setId(conversation.id);
            setSelectedId(conversation.id);
            await markAsRead(conversation.id);
        } catch (error) {
            console.error('Failed to create conversation:', error);
        }
    }

    const convertRole = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'Quản trị viên';
            case 'MONITOR':
                return 'Quản trị viên';
            case 'PARTNER':
                return 'Tài xế';
            case 'INTRODUCER':
                return 'CTV';
            case 'ACCOUNTANT':
                return 'Kế toán';
            default:
                return 'Công ty/ CSKD';
        }
    }

    const isChatOpen = !!selectedId;
    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor="right"
            PaperProps={{
                sx: { width: { xs: '100%', md: 500 } },
            }}
        >
            {!isChatOpen ? (
                <>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
                        <Typography variant="h6">Danh sách cuộc trò chuyện</Typography>
                        <IconButton onClick={onClose}>
                            <Iconify icon="mingcute:close-line" />
                        </IconButton>
                    </Stack>
                    {isAdminOrMonitor && (
                        <Stack sx={{ px: 2.5, py: 2 }} bgcolor='background.paper' borderBottom={`1px dashed ${theme.palette.divider}`}>
                            <Autocomplete
                                fullWidth
                                options={searchResults}
                                getOptionLabel={(option) => option.full_name || ''}
                                filterOptions={(x) => x}
                                onInputChange={(event, value) => handleSearch(value)}
                                onChange={(event, value) => handleUserSelect(value)}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Avatar src={getFullImageUrl(option.avatar)} sx={{ width: 24, height: 24 }} />
                                            <Stack>
                                                <Typography variant="body2">{option.full_name}</Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    {option.phone_number} - {convertRole(option.role)}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Tìm kiếm người dùng..."
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <>
                                                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', mr: 1 }} />
                                                    {params.InputProps.startAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Stack>
                    )}
                    <ConversationList
                        user={user}
                        conversations={conversations}
                        onSelectConversation={handleSelectConversation}
                    />
                </>
            ) : (
                <>
                    {finalConversation ? (
                        <ChatWindow
                            user={user}
                            conversation={finalConversation}
                            onBack={handleBack}
                        />
                    ) : (
                        <Stack sx={{ height: 1 }}>
                            <Box sx={{ p: 2, borderBottom: (theme) => `1px dashed ${theme.palette.divider}` }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <Stack spacing={0.5}>
                                        <Skeleton variant="text" width={120} />
                                        <Skeleton variant="text" width={80} sx={{ height: 10 }} />
                                    </Stack>
                                </Stack>
                            </Box>

                            <Stack sx={{ p: 3, flexGrow: 1, gap: 2 }}>
                                <Stack alignItems="flex-start">
                                    <Skeleton variant="rounded" width={240} height={60} />
                                </Stack>
                                <Stack alignItems="flex-end">
                                    <Skeleton variant="rounded" width={240} height={60} />
                                </Stack>
                                <Stack alignItems="flex-start">
                                    <Skeleton variant="rounded" width={240} height={60} />
                                </Stack>
                            </Stack>

                            <Box sx={{ p: 2, borderTop: (theme) => `1px dashed ${theme.palette.divider}` }}>
                                <Skeleton variant="rounded" height={40} />
                            </Box>
                        </Stack>
                    )}
                </>
            )}
        </Drawer>
    );
}
