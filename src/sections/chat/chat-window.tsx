import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { IChatConversation } from 'src/types/chat';


// ----------------------------------------------------------------------

type Props = {
    conversation: IChatConversation;
    onBack: () => void;
};

export default function ChatWindow({ conversation, onBack }: Props) {
    const partner = conversation.participants.find((participant) => participant.id !== 'me');

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
                alt={partner?.name}
                src={partner?.avatarUrl}
                sx={{ mr: 2 }}
            >
                {partner?.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">{partner?.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {partner?.status === 'online' ? 'Đang hoạt động' : 'Ngoại tuyến'}
                </Typography>
            </Box>

            <IconButton>
                <Iconify icon="solar:phone-bold" />
            </IconButton>
        </Stack>
    );

    const renderMessages = (
        <Scrollbar sx={{ p: 3, flexGrow: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {conversation.messages.map((message) => {
                    const isMe = message.senderId === 'me';
                    return (
                        <Box
                            key={message.id}
                            sx={{
                                display: 'flex',
                                justifyContent: isMe ? 'flex-end' : 'flex-start',
                            }}
                        >
                            {!isMe && (
                                <Avatar
                                    alt={partner?.name}
                                    src={partner?.avatarUrl}
                                    sx={{ width: 32, height: 32, mr: 2 }}
                                >
                                    {partner?.name?.charAt(0).toUpperCase()}
                                </Avatar>
                            )}

                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 1,
                                    maxWidth: '75%',
                                    bgcolor: isMe ? 'primary.main' : 'background.neutral',
                                    color: isMe ? 'primary.contrastText' : 'text.primary',
                                }}
                            >
                                <Typography variant="body2">{message.body}</Typography>
                            </Box>
                        </Box>
                    );
                })}

                {conversation.messages.length === 0 && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', mt: 5 }}>
                        Bắt đầu cuộc trò chuyện
                    </Typography>
                )}
            </Box>
        </Scrollbar>
    );

    const renderInput = (
        <Box sx={{ p: 2, borderTop: (theme) => `1px dashed ${theme.palette.divider}` }}>
            <TextField
                fullWidth
                size="small"
                placeholder="Nhập tin nhắn..."
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton edge="end" color="primary">
                                <Iconify icon="iconamoon:send-fill" />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
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
