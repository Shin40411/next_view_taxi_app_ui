import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// ----------------------------------------------------------------------
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import TemplateField from '../template-field';
import { paths } from 'src/routes/paths';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider from 'src/components/hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { useSettings } from 'src/hooks/api/use-settings';

// ----------------------------------------------------------------------

type FormValues = {
    tpl_trip_request: string;
    tpl_driver_arrived: string;
    tpl_trip_cancelled: string;
    tpl_trip_confirmed: string;
    tpl_trip_rejected: string;
    tpl_wallet_success: string;
    tpl_wallet_failed: string;

    tpl_contract_approved: string;
    tpl_contract_terminated: string;
};

export default function PushNotificationView() {
    const settings = useSettingsContext();
    const { enqueueSnackbar } = useSnackbar();
    const { settings: currentSettings, settingsLoading, updateSettings } = useSettings();

    const [loading, setLoading] = useState(false);

    const SettingsSchema = Yup.object().shape({
        tpl_trip_request: Yup.string().required('Vui lòng nhập mẫu thông báo'),
        tpl_driver_arrived: Yup.string().required('Vui lòng nhập mẫu thông báo'),
        tpl_trip_cancelled: Yup.string().required('Vui lòng nhập mẫu thông báo'),
        tpl_trip_confirmed: Yup.string().required('Vui lòng nhập mẫu thông báo'),
        tpl_trip_rejected: Yup.string().required('Vui lòng nhập mẫu thông báo'),
        tpl_wallet_success: Yup.string().required('Vui lòng nhập mẫu thông báo'),
        tpl_wallet_failed: Yup.string().required('Vui lòng nhập mẫu thông báo'),

        tpl_contract_approved: Yup.string().required('Vui lòng nhập mẫu thông báo'),
        tpl_contract_terminated: Yup.string().required('Vui lòng nhập mẫu thông báo'),
    });

    const defaultValues: FormValues = useMemo(
        () => ({
            tpl_trip_request: currentSettings?.tpl_trip_request || '',
            tpl_driver_arrived: currentSettings?.tpl_driver_arrived || '',
            tpl_trip_cancelled: currentSettings?.tpl_trip_cancelled || '',
            tpl_trip_confirmed: currentSettings?.tpl_trip_confirmed || '',
            tpl_trip_rejected: currentSettings?.tpl_trip_rejected || '',
            tpl_wallet_success: currentSettings?.tpl_wallet_success || '',
            tpl_wallet_failed: currentSettings?.tpl_wallet_failed || '',

            tpl_contract_approved: currentSettings?.tpl_contract_approved || '',
            tpl_contract_terminated: currentSettings?.tpl_contract_terminated || '',
        }),
        [currentSettings]
    );

    const methods = useForm<FormValues>({
        resolver: yupResolver(SettingsSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        setValue,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (currentSettings) {
            reset(defaultValues);
        }
    }, [currentSettings, defaultValues, reset]);

    const confirm = useBoolean();
    const [tempData, setTempData] = useState<FormValues | null>(null);

    const onSubmit = (data: FormValues) => {
        setTempData(data);
        confirm.onTrue();
    };

    const handleUpdate = async () => {
        if (!tempData) return;
        try {
            setLoading(true);
            await updateSettings(tempData);
            enqueueSnackbar('Cập nhật thành công!');
            setLoading(false);
            confirm.onFalse();
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Có lỗi xảy ra', { variant: 'error' });
            setLoading(false);
        }
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Cài đặt thông báo đẩy"
                links={[
                    { name: 'Cấu hình hệ thống', href: paths.dashboard.admin.overview },
                    { name: 'Cài đặt', href: paths.dashboard.admin.settings },
                    { name: 'Mẫu thông báo' },
                ]}
                sx={{
                    my: { xs: 3, md: 3 },
                }}
            />

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid xs={12} md={12}>
                        <Card sx={{ p: 3, mb: 2 }}>
                            <CardHeader title="Mẫu thông báo" sx={{ mb: 2, p: 0 }} />

                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                            >
                                {[
                                    { name: 'tpl_trip_request', label: 'Yêu cầu đặt xe mới' },
                                    { name: 'tpl_driver_arrived', label: 'Tài xế đã đến' },
                                    { name: 'tpl_trip_cancelled', label: 'Chuyến xe bị hủy' },
                                    { name: 'tpl_trip_confirmed', label: 'Chuyến xe xác nhận (Hoàn thành)' },
                                    { name: 'tpl_trip_rejected', label: 'Yêu cầu bị từ chối' },
                                    { name: 'tpl_wallet_success', label: 'Giao dịch ví thành công' },
                                    { name: 'tpl_wallet_failed', label: 'Giao dịch ví thất bại' },
                                    { name: 'tpl_contract_approved', label: 'Hợp đồng được duyệt' },
                                    { name: 'tpl_contract_terminated', label: 'Hợp đồng bị hủy' },
                                ].map((field) => (
                                    <TemplateField
                                        key={field.name}
                                        name={field.name}
                                        label={field.label}
                                        control={control}
                                        setValue={setValue}
                                        watch={watch}
                                    />
                                ))}
                            </Box>

                            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                                <LoadingButton type="submit" variant="contained" loading={isSubmitting || loading}>
                                    Lưu thay đổi
                                </LoadingButton>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </FormProvider>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Xác nhận cập nhật"
                content="Bạn có chắc chắn muốn cập nhật các mẫu thông báo này không?"
                action={
                    <Button variant="contained" color="primary" onClick={handleUpdate}>
                        Xác nhận
                    </Button>
                }
            />
        </Container>
    );
}
