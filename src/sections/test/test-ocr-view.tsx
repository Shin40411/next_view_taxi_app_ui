
import { useState } from 'react';
import { useScanIdentityCard } from 'src/hooks/use-scan-identity-card';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { alpha, useTheme } from '@mui/material/styles';

import Iconify from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------


export default function TestOcrView() {
    const theme = useTheme();
    const { scanIdentityCard, loading, error, parsedData, rawData } = useScanIdentityCard();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleScan = async () => {
        if (file) {
            await scanIdentityCard(file);
        }
    };

    const renderRaw = (
        <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Raw OCR Result</Typography>
            {rawData?.ParsedResults?.map((result: any, index: number) => (
                <div key={index} style={{ marginBottom: 10 }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                        {result.ParsedText}
                    </Typography>
                    {result.ErrorMessage && (
                        <Typography variant="caption" color="error">
                            Error: {result.ErrorMessage}
                        </Typography>
                    )}
                </div>
            ))}
        </Card>
    );

    const renderParsed = parsedData && (
        <Card sx={{ p: 3, mt: 3, maxWidth: 600, mx: 'auto', border: `1px solid ${alpha(theme.palette.primary.main, 0.24)} ` }}>
            <Stack spacing={3}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Iconify icon="mdi:card-account-details-outline" width={40} sx={{ color: 'primary.main' }} />
                    <Typography variant="h5">Citizen Identity Card</Typography>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary', width: 140 }}>No.</Typography>
                        <Typography variant="subtitle1" sx={{ flex: 1, textAlign: 'right' }}>{parsedData.id || '---'}</Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary', width: 140 }}>Full Name</Typography>
                        <Typography variant="subtitle1" sx={{ flex: 1, textAlign: 'right', color: 'primary.main', textTransform: 'uppercase' }}>
                            {parsedData.fullName || '---'}
                        </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary', width: 140 }}>Date of birth</Typography>
                        <Typography variant="subtitle1" sx={{ flex: 1, textAlign: 'right' }}>{parsedData.dob || '---'}</Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary', width: 140 }}>Sex</Typography>
                        <Typography variant="subtitle1" sx={{ flex: 1, textAlign: 'right' }}>{parsedData.sex || '---'}</Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary', width: 140 }}>Nationality</Typography>
                        <Typography variant="subtitle1" sx={{ flex: 1, textAlign: 'right' }}>{parsedData.nationality || '---'}</Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="body2" sx={{ color: 'text.secondary', width: 140, mt: 0.5 }}>Place of origin</Typography>
                        <Typography variant="subtitle2" sx={{ flex: 1, textAlign: 'right' }}>{parsedData.placeOfOrigin || '---'}</Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="body2" sx={{ color: 'text.secondary', width: 140, mt: 0.5 }}>Place of residence</Typography>
                        <Typography variant="subtitle2" sx={{ flex: 1, textAlign: 'right' }}>{parsedData.placeOfResidence || '---'}</Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Card>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Typography variant="h4" sx={{ mb: 5 }}>
                OCR Test - Identity Card
            </Typography>

            <Card sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Button variant="contained" component="label" startIcon={<Iconify icon="eva:cloud-upload-fill" />}>
                        Upload Image
                        <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                    </Button>

                    <LoadingButton
                        loading={loading}
                        variant="contained"
                        color="primary"
                        onClick={handleScan}
                        disabled={!file}
                    >
                        Scan Identity Card
                    </LoadingButton>
                </Stack>

                {previewUrl && (
                    <Stack justifyContent="center" alignItems="center" sx={{ mb: 2, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                        <img src={previewUrl} alt="Preview" style={{ maxHeight: 300, maxWidth: '100%' }} />
                    </Stack>
                )}

                {error && <Typography color="error">{error}</Typography>}
            </Card>

            {renderParsed}

            {rawData && <Stack sx={{ mt: 5 }}><Typography variant="overline" sx={{ color: 'text.disabled' }}>Debug Information</Typography>{renderRaw}</Stack>}
        </Container>
    );
}
