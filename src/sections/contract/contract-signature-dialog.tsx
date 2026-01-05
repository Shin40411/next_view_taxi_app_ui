import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: (signatureData: string, fullName: string) => void;
};

export default function ContractSignatureDialog({ open, onClose, onConfirm }: Props) {
    const sigCanvasRef = useRef<SignatureCanvas>(null);
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState<string>('');

    const handleClear = () => {
        sigCanvasRef.current?.clear();
        setFullName('');
        setError('');
    };

    const handleConfirm = () => {
        if (sigCanvasRef.current?.isEmpty()) {
            setError('Vui lòng ký tên trước khi xác nhận');
            return;
        }

        if (!fullName.trim()) {
            setError('Vui lòng nhập họ tên người ký');
            return;
        }

        // Get signature as base64 image string
        const signatureData = sigCanvasRef.current?.getCanvas().toDataURL('image/png') || '';
        onConfirm(signatureData, fullName);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Ký tên xác nhận</DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        bgcolor: '#f5f5f5',
                        height: 200,
                        position: 'relative',
                        mt: 1
                    }}
                >
                    <SignatureCanvas
                        ref={sigCanvasRef}
                        penColor="black"
                        canvasProps={{
                            width: 550,
                            height: 200,
                            className: 'sigCanvas'
                        }}
                        backgroundColor="transparent"
                    />
                </Box>

                <TextField
                    fullWidth
                    label="Họ và tên người ký"
                    placeholder="Nhập họ và tên..."
                    value={fullName}
                    onChange={(e) => {
                        setFullName(e.target.value);
                        setError('');
                    }}
                    sx={{ mt: 2 }}
                />

                {error && (
                    <Box sx={{ color: 'error.main', mt: 1, fontSize: '0.875rem' }}>
                        {error}
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClear} color="warning">
                    Ký lại
                </Button>
                <Button onClick={onClose} color="inherit">
                    Hủy bỏ
                </Button>
                <Button onClick={handleConfirm} variant="contained" color="primary">
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}
