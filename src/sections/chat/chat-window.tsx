import { useRef, useEffect, useState, useMemo, KeyboardEvent, useLayoutEffect, UIEvent } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { IChatMessage, IChatConversation } from 'src/types/chat';
import { useSocket } from 'src/hooks/use-socket';
import { useGetMessages, sendMessage, markAsRead, getMoreMessages } from 'src/hooks/api/use-conversation';
import { useAuthContext } from 'src/auth/hooks';
import { getFullImageUrl } from 'src/utils/get-image';
import { fToNow } from 'src/utils/format-time';
import EmptyContent from 'src/components/empty-content';
import { AuthUserType } from 'src/auth/types';
import { CircularProgress } from '@mui/material';

type Props = {
    conversation: IChatConversation;
    onBack: () => void;
    user: AuthUserType;
};

export default function ChatWindow({ conversation, onBack, user }: Props) {
    const { socket } = useSocket();
    const { messages: swrMessages, messagesEmpty, totalMessages } = useGetMessages(conversation.id);
    const [messageBody, setMessageBody] = useState('');
    const [localMessages, setLocalMessages] = useState<IChatMessage[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [currentConversationId, setCurrentConversationId] = useState(conversation.id);

    const scrollRef = useRef<HTMLDivElement>(null);
    const lastMessageIdRef = useRef<string | null>(null);

    if (conversation.id !== currentConversationId) {
        setCurrentConversationId(conversation.id);
        setLocalMessages([]);
    }

    const targetUser = useMemo(() =>
        conversation.participants.find(p => p.id !== user?.id),
        [conversation, user]);

    const isSpecialRole = targetUser?.role === 'PARTNER' || targetUser?.role === 'INTRODUCER';
    const isCustomer = targetUser?.role === 'CUSTOMER';
    const getStatusLabel = () => {
        if (isSpecialRole) {
            console.log(targetUser?.status);
            return targetUser?.status === 'online' ? 'Đang hoạt động' : 'Ngoại tuyến';
        }
        if (isCustomer) {
            return 'Công ty/ CSKD';
        }
        return 'Quản trị viên';
    };

    const { name, avatar } = conversation;

    useEffect(() => {
        if (!swrMessages || swrMessages.length === 0) return;

        setLocalMessages((prev) => {
            if (prev.length === 0) {
                const hasMore = swrMessages.length >= 10 && swrMessages.length < totalMessages;
                setHasMoreMessages(hasMore);
                return swrMessages;
            }

            const prevIds = new Set(prev.map(m => m.id));
            const newMessages: IChatMessage[] = [];
            const updatedPrev = [...prev];

            swrMessages.forEach(msg => {
                if (prevIds.has(msg.id)) {
                    const index = updatedPrev.findIndex(m => m.id === msg.id);
                    if (index !== -1) {
                        updatedPrev[index] = msg;
                    }
                } else {
                    const lastLocal = updatedPrev[updatedPrev.length - 1];
                    if (!lastLocal || new Date(msg.created_at) > new Date(lastLocal.created_at)) {
                        newMessages.push(msg);
                    }
                }
            });

            const newLen = updatedPrev.length + newMessages.length;
            setHasMoreMessages(newLen < totalMessages);
            return [...updatedPrev, ...newMessages];
        });
    }, [swrMessages, conversation.id, totalMessages]);

    useEffect(() => {
        if (socket && conversation.id) {
            socket.emit('join_room', { conversationId: conversation.id });

            const handleReceiveMessage = (message: any) => {
                const messageConversationId = message.conversation_id || message.conversation?.id;
                if (messageConversationId === conversation.id && message.sender_id !== user?.id) {
                    markAsRead(conversation.id);
                }
            };

            socket.on('receive_message', handleReceiveMessage);

            return () => {
                socket.emit('leave_room', { conversationId: conversation.id });
                socket.off('receive_message', handleReceiveMessage);
            };
        }
        return undefined;
    }, [socket, conversation.id, user?.id]);

    useEffect(() => {
        if (localMessages.length > 0) {
            const lastMsg = localMessages[localMessages.length - 1];
            const isLastMessageNew = lastMsg.id !== lastMessageIdRef.current;

            if (isLastMessageNew) {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            }
            lastMessageIdRef.current = lastMsg.id;
        }
    }, [localMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversation.id]);

    useEffect(() => {
        if (conversation.id && localMessages.length > 0) {
            const lastMessage = localMessages[localMessages.length - 1];
            if (lastMessage && lastMessage.sender_id !== user?.id) {
                markAsRead(conversation.id);
            }
        }
    }, [conversation.id, localMessages, user?.id]);

    const handleSend = async () => {
        if (!messageBody.trim()) return;
        try {
            await sendMessage(conversation.id, messageBody);
            setMessageBody('');
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const prevScrollHeightRef = useRef<number | null>(null);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);

    useLayoutEffect(() => {
        if (prevScrollHeightRef.current !== null && scrollRef.current) {
            const newHeight = scrollRef.current.scrollHeight;
            const diff = newHeight - prevScrollHeightRef.current;
            scrollRef.current.scrollTop = diff;
            prevScrollHeightRef.current = null;
            setIsLoadingMore(false);
        }
    }, [localMessages]);

    const loadMoreMessages = async () => {
        if (isLoadingMore || !hasMoreMessages || localMessages.length === 0) return;

        setIsLoadingMore(true);
        const currentTopMessage = localMessages[0];
        if (scrollRef.current) {
            prevScrollHeightRef.current = scrollRef.current.scrollHeight;
        }

        try {
            const beforeDate = new Date(currentTopMessage.created_at).toISOString();

            const olderMessages = await getMoreMessages(conversation.id, beforeDate, currentTopMessage.id);

            if (olderMessages.length > 0) {
                setLocalMessages(prev => {
                    const newLen = prev.length + olderMessages.length;
                    const hasMore = olderMessages.length >= 10 && newLen < totalMessages;
                    setHasMoreMessages(hasMore);
                    return [...olderMessages, ...prev];
                });
            } else {
                setHasMoreMessages(false);
                prevScrollHeightRef.current = null;
            }
            setIsLoadingMore(false);
        } catch (err) {
            console.error('Failed to load older messages', err);
            setIsLoadingMore(false);
            prevScrollHeightRef.current = null;
        }
    };

    const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
        const { scrollTop } = e.currentTarget;
        if (scrollTop === 0 && hasMoreMessages) {
            loadMoreMessages();
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

    const isDeletedUser = conversation.name === 'Unknown';

    const renderHead = (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                p: 2,
                borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
            }}
        >
            <IconButton onClick={onBack} sx={{ mr: 1 }}>
                <Iconify icon="eva:arrow-ios-back-fill" />
            </IconButton>

            <Avatar
                alt={name}
                src={getFullImageUrl(avatar || '')}
                sx={{ mr: 2 }}
            >
                {name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">{name}</Typography>
                <Typography
                    variant="caption"
                    sx={{ color: isDeletedUser ? 'error.main' : ((isSpecialRole && targetUser?.isOnline) ? 'success.main' : 'text.disabled') }}
                >
                    {isDeletedUser ? 'Tài khoản đã bị xóa' : getStatusLabel()}
                </Typography>
            </Box>
        </Stack>
    );

    const renderMessages = (
        <Scrollbar
            ref={scrollRef}
            sx={{ p: 3, flexGrow: 1, height: '100%', bgcolor: 'background.paper' }}
            onScroll={handleScroll}
        >
            <Box height="100%" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {hasMoreMessages && localMessages.length > 0 && (
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Button
                            size="small"
                            variant="text"
                            onClick={loadMoreMessages}
                            disabled={isLoadingMore}
                            startIcon={isLoadingMore ? <CircularProgress size={16} /> : <Iconify icon="bxs:up-arrow" />}
                        >
                            {isLoadingMore ? 'Đang tải...' : 'Tải tin nhắn cũ hơn'}
                        </Button>
                    </Box>
                )}
                {localMessages.map((message, index) => {
                    const isMe = message.sender_id === user?.id;
                    const partner = conversation.participants?.find((p) => p.id !== user?.id);
                    const isLastMessage = index === localMessages.length - 1;
                    const isSeen =
                        isMe &&
                        isLastMessage &&
                        partner?.last_read_at &&
                        new Date(partner.last_read_at) >= new Date(message.created_at);

                    return (
                        <Box
                            key={message.id}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isMe ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: isMe ? 'flex-end' : 'flex-start',
                                }}
                            >
                                {!isMe && (
                                    <Avatar
                                        alt={message.sender.full_name}
                                        src={getFullImageUrl(message.sender.avatar || '')}
                                        sx={{ width: 32, height: 32, mr: 2 }}
                                    >
                                        {message.sender.full_name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                )}

                                <Box
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 1,
                                        bgcolor: isMe ? 'primary.main' : 'background.neutral',
                                        color: isMe ? 'primary.contrastText' : 'text.primary',
                                    }}
                                >
                                    <Typography variant="body2">{message.body}</Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: 0.5,
                                    pl: isMe ? 0 : '48px',
                                    pr: isMe ? 0 : 0
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.7rem',
                                        mr: 1
                                    }}
                                >
                                    {fToNow(message.created_at)}
                                </Typography>

                                {isSeen && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: 'primary.main',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Đã xem
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    );
                })}

                {localMessages.length === 0 && messagesEmpty && (
                    <EmptyContent
                        title='Bắt đầu cuộc trò chuyện'
                    />
                )}
            </Box>
        </Scrollbar>
    );

    const renderInput = (
        <Box sx={{ p: 2, borderTop: (theme) => `1px dashed ${theme.palette.divider}`, bgcolor: 'background.default' }}>
            {isDeletedUser ? (
                <Typography variant="body2" sx={{ color: 'text.disabled', textAlign: 'center' }}>
                    Không thể gửi tin nhắn. Tài khoản người nhận đã bị xóa.
                </Typography>
            ) : (
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Nhập tin nhắn..."
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    onKeyDown={handleKeyDown}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton edge="end" color="primary" onClick={handleSend}>
                                    <Iconify icon="iconamoon:send-fill" />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            )}
        </Box>
    );

    return (
        <Stack sx={{ height: 1 }}>
            {renderHead}
            {renderMessages}
            {renderInput}
        </Stack>
    );
}
