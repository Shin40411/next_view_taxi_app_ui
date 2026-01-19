import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function VideoPlayerDialog() {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (location.hash === '#tutorial') {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [location.hash]);

    const handleClose = () => {
        setOpen(false);
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
                >
                    <source src="/assets/files/VIDEO-HDSD-GOXU-Edited.mp4" type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ thẻ video.
                </Box>
            </Box>
        </Dialog>
    );
}
