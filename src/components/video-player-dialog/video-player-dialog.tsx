import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function VideoPlayerDialog() {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [videoSrc, setVideoSrc] = useState('');

    useEffect(() => {
        if (location.hash === '#tutorial') {
            setVideoSrc('/assets/files/VIDEO-HDSD-GOXU-Edited.mp4');
            setOpen(true);
        } else if (location.hash === '#tutorial-customer') {
            setVideoSrc('/assets/files/HDDN-goxu.mp4');
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [location.hash]);

    const handleClose = () => {
        setOpen(false);
        setVideoSrc('');
        navigate(location.pathname, { replace: true });
    };

    return (
        <Dialog
            fullWidth
            maxWidth="md"
            open={open}
            onClose={handleClose}
            sx={{
                '& .MuiDialog-paper': {
                    bgcolor: 'background.default',
                },
            }}
        >
            <Box sx={{ position: 'relative', p: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1,
                        px: 1,
                    }}
                >
                    <Typography variant="h6">Hướng dẫn sử dụng Goxu</Typography>
                    <IconButton onClick={handleClose}>
                        <Iconify icon="mingcute:close-line" />
                    </IconButton>
                </Box>

                {open && videoSrc && (
                    <Box
                        component="video"
                        controls
                        autoPlay
                        sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 1,
                            bgcolor: 'black',
                            display: 'block',
                        }}
                        key={videoSrc}
                    >
                        <source src={videoSrc} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                    </Box>
                )}
            </Box>
        </Dialog>
    );
}
