import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';
import { IChatConversation } from 'src/types/chat';

// ----------------------------------------------------------------------

type Props = {
    conversations: IChatConversation[];
    onSelectConversation: (id: string) => void;
};

export default function ConversationList({ conversations, onSelectConversation }: Props) {
    return (
        <Stack>
            {conversations.map((conversation) => {
                const partner = conversation.participants.find((participant) => participant.id !== 'me');
                const lastMessage = conversation.messages[conversation.messages.length - 1];
                const createdAt = lastMessage?.createdAt;

                return (
                    <ListItemButton
                        key={conversation.id}
                        disableGutters
                        onClick={() => onSelectConversation(conversation.id)}
                        sx={{
                            py: 1.5,
                            px: 2.5,
                            borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: 1 }}>
                            <Badge
                                color="error"
                                overlap="circular"
                                badgeContent={conversation.unreadCount}
                                invisible={conversation.unreadCount === 0}
                            >
                                <Avatar alt={partner?.name} src={partner?.avatarUrl}>
                                    {partner?.name?.charAt(0).toUpperCase()}
                                </Avatar>
                            </Badge>

                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                    <Typography variant="subtitle2" noWrap>
                                        {partner?.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                        {createdAt ? fToNow(createdAt) : ''}
                                    </Typography>
                                </Stack>

                                <Typography
                                    variant="body2"
                                    noWrap
                                    sx={{
                                        color: conversation.unreadCount > 0 ? 'text.primary' : 'text.secondary',
                                        fontWeight: conversation.unreadCount > 0 ? 'fontWeightSemiBold' : 'fontWeightRegular',
                                    }}
                                >
                                    {lastMessage?.body || 'Chưa có tin nhắn'}
                                </Typography>
                            </Box>
                        </Stack>
                    </ListItemButton>
                );
            })}

            {conversations.length === 0 && (
                <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                    Chưa có cuộc trò chuyện nào
                </Box>
            )}
        </Stack>
    );
}
