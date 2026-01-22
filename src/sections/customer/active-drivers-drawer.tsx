import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import axiosInstance from 'src/utils/axios';

import { ASSETS_API } from 'src/config-global';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useChatDrawer } from 'src/provider/chat/chat-provider';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    onOpenChat: () => void;
};

type Driver = {
    id: string;
    full_name: string;
    vehicle_plate: string;
    phone: string;
    is_online: boolean;
    avatarUrl?: string;
};

export default function ActiveDriversDrawer({ open, onClose, onOpenChat }: Props) {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(false);
    const mockIdChat = '1';
    const { setId } = useChatDrawer();

    useEffect(() => {
        if (open) {
            fetchDrivers();
        }
    }, [open]);

    const fetchDrivers = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/customer/active-drivers');

            const driversData = res.data?.data || res.data;

            if (Array.isArray(driversData)) {
                setDrivers(driversData);
            } else {
                console.error('Invalid drivers data:', res.data);
                setDrivers([]);
            }
        } catch (error) {
            console.error(error);
            setDrivers([]);
        } finally {
            setLoading(false);
        }
    };

    const directChatBox = () => {
        onOpenChat();
        setId(mockIdChat);
    }

    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor="right"
            PaperProps={{
                sx: { width: 320 },
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
                <Typography variant="h6">Tài xế đang hoạt động ({drivers.length})</Typography>
                <IconButton onClick={onClose}>
                    <Iconify icon="mingcute:close-line" />
                </IconButton>
            </Stack>

            <Scrollbar>
                <Stack spacing={2} sx={{ p: 2.5 }}>
                    {drivers.map((driver) => (
                        <Stack key={driver.id} direction="row" alignItems="center" spacing={2}>
                            <Stack position="relative">
                                <Avatar alt={driver.full_name} src={driver.avatarUrl ? `${ASSETS_API}/${driver.avatarUrl}` : undefined}>
                                    {driver.full_name.charAt(0).toUpperCase()}
                                </Avatar>
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
                            </Stack>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" noWrap>
                                    {driver.full_name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
                                    Bs: {driver.vehicle_plate}
                                </Typography>
                            </Box>

                            {/* <IconButton
                                color="primary"
                                onClick={directChatBox}
                                sx={{ bgcolor: 'rgba(0, 120, 255, 0.16)', '&:hover': { bgcolor: 'rgba(0, 120, 255, 0.32)' } }}
                            >
                                <Iconify icon="solar:chat-round-dots-bold" />
                            </IconButton> */}
                        </Stack>
                    ))}

                    {!loading && drivers.length === 0 && (
                        <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                            Không có tài xế nào đang hoạt động
                        </Box>
                    )}
                </Stack>
            </Scrollbar>
        </Drawer>
    );
}
