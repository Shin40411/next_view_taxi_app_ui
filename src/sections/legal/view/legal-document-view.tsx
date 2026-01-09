'use client';

import Box from '@mui/material/Box';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

type Props = {
    title: string;
    pdfUrl: string;
};

export default function LegalDocumentView({ title, pdfUrl }: Props) {
    const settings = useSettingsContext();

    return (
        <Box
            sx={{
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
                border: (theme) => `solid 1px ${theme.palette.divider}`,
                borderRadius: 2,
                bgcolor: 'background.paper',
            }}
        >
            <iframe
                title={title}
                src={pdfUrl}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
            />
        </Box>
    );
}
