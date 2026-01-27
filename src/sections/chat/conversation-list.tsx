import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { IChatConversation } from 'src/types/chat';
import { AuthUserType } from 'src/auth/types';
import { deleteConversation } from 'src/hooks/api/use-conversation';

import ConversationItem from './conversation-item';
import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

type Props = {
    conversations: IChatConversation[];
    onSelectConversation: (id: string) => void;
    user: AuthUserType;
};

export default function ConversationList({ conversations, onSelectConversation, user }: Props) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (conversationId: string) => {
        setDeleteId(conversationId);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await deleteConversation(deleteId);
        } catch (error: any) {
            enqueueSnackbar(error.message, { variant: 'error' });
            console.error('Failed to delete conversation:', error);
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteId(null);
    };

    return (
        <Box sx={{ height: 1, bgcolor: 'background.paper' }}>
            <Stack>
                {conversations.map((conversation) => (
                    <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        selected={false}
                        onSelect={() => onSelectConversation(conversation.id)}
                        onDelete={() => handleDeleteClick(conversation.id)}
                        user={user}
                    />
                ))}
            </Stack>

            {conversations.length === 0 && (
                <Box height="100%" sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                    <EmptyContent title="Chưa có cuộc trò chuyện nào" />
                </Box>
            )}

            <ConfirmDialog
                open={!!deleteId}
                onClose={handleDeleteCancel}
                title="Xóa cuộc trò chuyện"
                content="Bạn có chắc muốn xóa cuộc trò chuyện này? Cuộc trò chuyện sẽ xuất hiện lại khi có tin nhắn mới."
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Đang xóa...' : 'Xóa'}
                    </Button>
                }
            />
        </Box>
    );
}

