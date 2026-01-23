import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';
import { IChatConversation } from 'src/types/chat';
import { getFullImageUrl } from 'src/utils/get-image';
import { AuthUserType } from 'src/auth/types';

import ConversationItem from './conversation-item';
import EmptyContent from 'src/components/empty-content';

// ----------------------------------------------------------------------

type Props = {
    conversations: IChatConversation[];
    onSelectConversation: (id: string) => void;
    user: AuthUserType;
};

export default function ConversationList({ conversations, onSelectConversation, user }: Props) {
    return (
        <>
            <Stack
                bgcolor="background.paper"
            >
                {conversations.map((conversation) => (
                    <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        selected={false}
                        onSelect={() => onSelectConversation(conversation.id)}
                        onDelete={() => alert('Chức năng đang phát triển')}
                        user={user}
                    />
                ))}
            </Stack>
            {conversations.length === 0 && (
                <Box height="100%" sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                    <EmptyContent
                        title="Chưa có cuộc trò chuyện nào"
                    />
                </Box>
            )}
        </>
    );
}
