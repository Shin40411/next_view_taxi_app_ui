import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
// components
import FormProvider, { RHFEditor, RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
// hooks
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useSupport } from 'src/hooks/api/use-support';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

type Props = {
    onSuccess: () => void;
};

export default function SupportNewForm({ onSuccess }: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const { createTicket } = useSupport();

    const NewTicketSchema = Yup.object().shape({
        subject: Yup.string().required('Vui lòng nhập chủ đề').max(255, 'Chủ đề không được quá 255 ký tự'),
        content: Yup.string().required('Vui lòng nhập nội dung chi tiết').max(5000, 'Nội dung không được quá 5000 ký tự'),
    });

    const methods = useForm({
        resolver: yupResolver(NewTicketSchema),
        defaultValues: {
            subject: '',
            content: '',
        },
    });

    const confirm = useBoolean();
    const {
        reset,
        watch,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (data) => {
        confirm.onTrue();
    });

    const isLoading = useBoolean();

    const handleConfirmSubmit = async () => {
        isLoading.onTrue();
        try {
            await createTicket({
                subject: values.subject,
                content: values.content,
            });
            enqueueSnackbar('Đã gửi yêu cầu hỗ trợ thành công!');
            reset();
            confirm.onFalse();
            onSuccess();
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Có lỗi xảy ra', { variant: 'error' });
        } finally {
            isLoading.onFalse();
        }
    };

    return (
        <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Tạo yêu cầu mới
            </Typography>

            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <Stack spacing={3}>
                            <RHFTextField name="subject" label="Chủ đề / Loại yêu cầu" placeholder="Ví dụ: Vấn đề về thanh toán..." />

                            <RHFEditor simple name="content" />

                            <LoadingButton
                                type="submit"
                                variant="contained"
                                size="large"
                                loading={isSubmitting}
                                sx={{ alignSelf: 'flex-start', mt: 2 }}
                            >
                                Gửi yêu cầu
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
            </FormProvider>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Xác nhận gửi yêu cầu"
                content="Bạn có chắc chắn muốn gửi yêu cầu hỗ trợ này không?"
                action={
                    <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={isLoading.value}
                        onClick={handleConfirmSubmit}
                    >
                        Xác nhận gửi
                    </LoadingButton>
                }
            />
        </Card>
    );
}
