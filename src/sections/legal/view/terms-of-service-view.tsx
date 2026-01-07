'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function TermsOfServiceView() {
    const settings = useSettingsContext();

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
                border: (theme) => `solid 1px ${theme.palette.divider}`,
                mb: 5,
            }}
        >
            <iframe
                title="Terms of Service"
                src="/assets/files/Hop Dong Taxi Nextview V2.pdf"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
            />
        </Box>
    );
}
