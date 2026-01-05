import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                textAlign: 'center',
                position: 'relative',
                bgcolor: 'background.default',
            }}
        >
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Typography component="a" href="#" variant="caption" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Điều khoản chính sách
                </Typography>
                <Typography component="a" href="#" variant="caption" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Thông báo bảo mật
                </Typography>
            </Box>
            <Typography variant="caption" component="div">
                Copyright © 2025 NextView JSC
            </Typography>
        </Box>
    );
}
