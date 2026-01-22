import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

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
            <Stack direction="row" spacing={2} justifyContent="center">
                <RouterLink to={paths.legal.termsOfService} target="_blank" style={{ textDecoration: 'none' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Điều khoản chính sách
                    </Typography>
                </RouterLink>
                <RouterLink to={paths.legal.privacyPolicy} target="_blank" style={{ textDecoration: 'none' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Chính sách bảo mật
                    </Typography>
                </RouterLink>
            </Stack>
            <Typography variant="caption" component="div">
                Copyright © 2025 NextView JSC
            </Typography>
        </Box>
    );
}
