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
            <Typography variant="caption" component="div">
                Copyright © 2025 NextView JSC
            </Typography>
        </Box>
    );
}
