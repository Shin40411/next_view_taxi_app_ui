import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFEditor, RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
// hooks
import { useSupport } from 'src/hooks/api/use-support';
import { ISupportTicket } from 'src/types/support';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    ticket: ISupportTicket | null;
    onUpdate: () => void;
};

export default function SupportReplyDialog({ open, onClose, ticket, onUpdate }: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const { replyTicket } = useSupport();

    const ReplySchema = Yup.object().shape({
        content: Yup.string().required('Nội dung phản hồi là bắt buộc').max(5000, 'Nội dung không được quá 5000 ký tự'),
    });

    const methods = useForm({
        resolver: yupResolver(ReplySchema),
        defaultValues: {
            content: '',
        },
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data: any) => {
        if (!ticket) return;
        try {
            await replyTicket(ticket.id, { content: data.content });
            enqueueSnackbar('Đã gửi phản hồi thành công!');
            reset();
            onUpdate();
            onClose();
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Có lỗi xảy ra', { variant: 'error' });
        }
    };

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
            <DialogTitle>Phản hồi yêu cầu hỗ trợ</DialogTitle>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Stack spacing={3} sx={{ pt: 1 }}>
                        <RHFEditor simple name="content" />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Hủy
                    </Button>

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Gửi phản hồi
                    </LoadingButton>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
}
