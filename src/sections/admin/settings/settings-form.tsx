import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';

// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';

// hooks
import { useSettings, ISetting } from 'src/hooks/api/use-settings';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

export default function SettingsForm() {
    const { enqueueSnackbar } = useSnackbar();
    const { settings, updateSettings, settingsLoading } = useSettings();

    const confirm = useBoolean();
    const [tempData, setTempData] = useState<any>(null);

    const [currentTab, setCurrentTab] = useState('google');

    const schema = Yup.object().shape({
        google_client_id: Yup.string(),
        google_client_secret: Yup.string(),
        google_callback_url: Yup.string(),
        zalo_app_id: Yup.string(),
        zalo_secret_key: Yup.string(),
        zalo_template_id_otp: Yup.string(),
        zalo_access_token: Yup.string(),
        zalo_refresh_token: Yup.string(),
        mail_host: Yup.string(),
        mail_port: Yup.number(),
        mail_user: Yup.string(),
        mail_pass: Yup.string(),
        mail_from: Yup.string(),
    });

    const defaultValues = useMemo(
        () => ({
            google_client_id: settings?.google_client_id || '',
            google_client_secret: settings?.google_client_secret || '',
            google_callback_url: settings?.google_callback_url || '',
            zalo_app_id: settings?.zalo_app_id || '',
            zalo_secret_key: settings?.zalo_secret_key || '',
            zalo_template_id_otp: settings?.zalo_template_id_otp || '',
            zalo_access_token: settings?.zalo_access_token || '',
            zalo_refresh_token: settings?.zalo_refresh_token || '',
            mail_host: settings?.mail_host || '',
            mail_port: settings?.mail_port || 587,
            mail_user: settings?.mail_user || '',
            mail_pass: settings?.mail_pass || '',
            mail_from: settings?.mail_from || '',
        }),
        [settings]
    );

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (settings) {
            reset(defaultValues);
        }
    }, [settings, defaultValues, reset]);

    const onSubmit = (data: any) => {
        setTempData(data);
        confirm.onTrue();
    };

    const handleConfirm = async () => {
        try {
            await updateSettings(tempData);
            enqueueSnackbar('Cập nhật thành công!');
            confirm.onFalse();
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Có lỗi xảy ra', { variant: 'error' });
        }
    };

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    const TABS = [
        { value: 'google', label: 'Google', icon: <Iconify icon="devicon:google" width={24} /> },
        { value: 'zalo', label: 'Zalo', icon: <Iconify icon="arcticons:zalo" width={24} /> },
        { value: 'mail', label: 'Cấu hình Mail', icon: <Iconify icon="fluent:mail-settings-24-regular" width={24} /> },
    ];

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ mb: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleChangeTab}
                    sx={{
                        px: 2,
                        bgcolor: 'background.neutral',
                    }}
                >
                    {TABS.map((tab) => (
                        <Tab key={tab.value} value={tab.value} label={tab.label} icon={tab.icon} />
                    ))}
                </Tabs>

                <Divider />

                <Box sx={{ p: 3 }}>
                    {currentTab === 'google' && (
                        <Grid container spacing={3}>
                            <Grid xs={12} md={12}>
                                <Stack spacing={3}>
                                    <RHFTextField name="google_client_id" label="Google Client ID" />
                                    <RHFTextField name="google_client_secret" label="Google Client Secret" type="password" />
                                    <RHFTextField name="google_callback_url" label="Google Callback URL" />
                                </Stack>
                            </Grid>
                        </Grid>
                    )}

                    {currentTab === 'zalo' && (
                        <Grid container spacing={3}>
                            <Grid xs={12} md={12}>
                                <Stack spacing={3}>
                                    <RHFTextField name="zalo_app_id" label="Zalo App ID" />
                                    <RHFTextField name="zalo_secret_key" label="Zalo Secret Key" type="password" />
                                    <RHFTextField name="zalo_template_id_otp" label="Template ID (OTP)" />
                                    <RHFTextField name="zalo_access_token" label="Access Token" multiline minRows={3} />
                                    <RHFTextField name="zalo_refresh_token" label="Refresh Token" multiline minRows={3} />
                                </Stack>
                            </Grid>
                        </Grid>
                    )}

                    {currentTab === 'mail' && (
                        <Grid container spacing={3}>
                            <Grid xs={12} md={6}>
                                <Stack spacing={3}>
                                    <RHFTextField name="mail_host" label="Mail Host" />
                                    <RHFTextField name="mail_port" label="Mail Port" type="number" />
                                    <RHFTextField name="mail_from" label="Mail From Address" />
                                </Stack>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <Stack spacing={3}>
                                    <RHFTextField name="mail_user" label="Mail User" />
                                    <RHFTextField name="mail_pass" label="Mail Password" type="password" />
                                </Stack>
                            </Grid>
                        </Grid>
                    )}

                    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            Lưu thay đổi
                        </LoadingButton>
                    </Stack>
                </Box>
            </Card>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Xác nhận thay đổi"
                content="Thay đổi cài đặt hệ thống có thể ảnh hưởng đến hoạt động của ứng dụng. Bạn có chắc chắn muốn tiếp tục?"
                action={
                    <LoadingButton variant="contained" color="error" loading={isSubmitting} onClick={handleConfirm}>
                        Xác nhận
                    </LoadingButton>
                }
            />
        </FormProvider>
    );
}
