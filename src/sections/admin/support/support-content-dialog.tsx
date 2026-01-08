import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
// components
import Markdown from 'src/components/markdown';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    title: string;
    content: string;
};

export default function SupportContentDialog({ open, onClose, title, content }: Props) {
    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>

            <DialogContent sx={{ minHeight: 400 }}>
                <Markdown children={content} />
            </DialogContent>

            <DialogActions>
                <Button variant="contained" onClick={onClose}>
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}
