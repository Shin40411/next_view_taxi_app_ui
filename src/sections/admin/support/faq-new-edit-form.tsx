import * as Yup from 'yup';
import { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
// hooks
import { useSupport, IFaq } from 'src/hooks/api/use-support';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: VoidFunction;
    currentFaq?: IFaq | null;
    onUpdate: VoidFunction;
};

export default function FaqNewEditForm({ open, onClose, currentFaq, onUpdate }: Props) {
    const { enqueueSnackbar } = useSnackbar();

    const { createFaq, updateFaq } = useSupport();

    const NewUserSchema = Yup.object().shape({
        question: Yup.string().required('Câu hỏi là bắt buộc'),
        answer: Yup.string().required('Câu trả lời là bắt buộc'),
    });

    const defaultValues = useMemo(
        () => ({
            question: currentFaq?.question || '',
            answer: currentFaq?.answer || '',
        }),
        [currentFaq]
    );

    const methods = useForm({
        resolver: yupResolver(NewUserSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (currentFaq) {
            reset(defaultValues);
        } else {
            reset({ question: '', answer: '' });
        }
    }, [currentFaq, defaultValues, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (currentFaq) {
                await updateFaq(currentFaq.id, data);
                enqueueSnackbar('Cập nhật thành công!');
            } else {
                await createFaq(data);
                enqueueSnackbar('Tạo mới thành công!');
            }
            onUpdate();
            reset();
            onClose();
        } catch (error) {
            console.error(error);
            enqueueSnackbar(currentFaq ? 'Cập nhật thất bại!' : 'Tạo mới thất bại!', { variant: 'error' });
        }
    });

    return (
        <Dialog
            fullWidth
            maxWidth={false}
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { maxWidth: 720 },
            }}
        >
            <DialogTitle>{currentFaq ? 'Cập nhật FAQ' : 'Tạo mới FAQ'}</DialogTitle>

            <FormProvider methods={methods} onSubmit={onSubmit}>
                <DialogContent>
                    <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        mt={1}
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(1, 1fr)',
                        }}
                    >
                        <RHFTextField name="question" label="Câu hỏi" />
                        <RHFTextField name="answer" label="Câu trả lời" multiline rows={4} />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Hủy
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        {currentFaq ? 'Cập nhật' : 'Tạo mới'}
                    </LoadingButton>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
}
