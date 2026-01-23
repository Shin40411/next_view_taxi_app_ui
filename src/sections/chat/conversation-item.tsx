import { useState } from 'react';
import { m, PanInfo, useMotionValue, useTransform } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';
import { getFullImageUrl } from 'src/utils/get-image';

import Iconify from 'src/components/iconify';

import { IChatConversation } from 'src/types/chat';

// ----------------------------------------------------------------------

type Props = {
    conversation: IChatConversation;
    selected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    user: any;
};

export default function ConversationItem({ conversation, selected, onSelect, onDelete, user }: Props) {
    const theme = useTheme();
    const { name, avatar, unread_count, last_message, participants } = conversation;
    const createdAt = last_message?.createdAt;

    const [isDeleting, setIsDeleting] = useState(false);
    const x = useMotionValue(0);

    const handleDragEnd = (event: any, info: PanInfo) => {
        if (info.offset.x < -100) {
            setIsDeleting(true);
        } else {
            setIsDeleting(false);
        }
    };

    return (
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <Box
                className="delete-action"
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '100px',
                    bgcolor: 'error.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 0,
                }}
            >
                <IconButton onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }} color="error">
                    <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
            </Box>

            <m.div
                drag="x"
                dragConstraints={{ left: -100, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                style={{
                    x,
                    backgroundColor: theme.palette.background.paper,
                    position: 'relative',
                    zIndex: 1,
                    height: '100%',
                }}
            >
                <ListItemButton
                    disableGutters
                    onClick={onSelect}
                    sx={{
                        py: 1.5,
                        px: 2.5,
                        bgcolor: 'background.paper',
                        borderBottom: `1px dashed ${theme.palette.divider}`,
                        ...(selected && {
                            bgcolor: 'action.selected',
                        }),
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ width: 1 }}>
                        <Stack position="relative">
                            <Badge
                                color="error"
                                overlap="circular"
                                badgeContent={unread_count}
                                invisible={unread_count === 0}
                            >
                                <Avatar alt={name} src={getFullImageUrl(avatar || '')}>
                                    {name?.charAt(0).toUpperCase()}
                                </Avatar>
                            </Badge>
                            {conversation.participants.find(p => p.id !== user?.id)?.role === 'PARTNER' && (
                                <Box
                                    position="absolute"
                                    bottom={0}
                                    right={-3}
                                    bgcolor="#fff"
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        bgcolor: 'success.main',
                                        flexShrink: 0
                                    }}
                                />
                            )}
                        </Stack>

                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                <Typography variant="subtitle2" noWrap>
                                    {participants.length > 2 ? 'Nhóm ' : ''}{name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                    {createdAt ? fToNow(createdAt) : ''}
                                </Typography>
                            </Stack>

                            <Typography
                                variant="body2"
                                noWrap
                                sx={{
                                    color: unread_count > 0 ? 'text.primary' : 'text.secondary',
                                    fontWeight: unread_count > 0 ? 'fontWeightSemiBold' : 'fontWeightRegular',
                                }}
                            >
                                {last_message?.isMe ? 'Bạn: ' : (participants.length > 2 ? `${last_message?.senderName}: ` : '')}{last_message?.body || 'Chưa có tin nhắn'}
                            </Typography>
                        </Box>
                    </Stack>
                </ListItemButton>
            </m.div>
        </Box>
    );
}
