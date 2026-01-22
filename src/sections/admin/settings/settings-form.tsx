import * as Yup from 'yup';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm , Controller } from 'react-hook-form';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import { useBoolean } from 'src/hooks/use-boolean';
// hooks
import { useSettings } from 'src/hooks/api/use-settings';

import Iconify from 'src/components/iconify';
// components
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider, { RHFSwitch, RHFTextField } from 'src/components/hook-form';

import { ISetting } from 'src/types/settings';

// ----------------------------------------------------------------------

export default function SettingsForm() {
    const { enqueueSnackbar } = useSnackbar();
    const { settings, updateSettings, settingsLoading } = useSettings();

    const confirm = useBoolean();
    const [tempData, setTempData] = useState<Partial<ISetting> | null>(null);

    const [currentTab, setCurrentTab] = useState('zalo');

    const schema = Yup.object().shape({
        google_client_id: Yup.string().max(255, 'Google Client ID tối đa 255 ký tự'),
        google_client_secret: Yup.string().max(255, 'Google Client Secret tối đa 255 ký tự'),
        google_callback_url: Yup.string().max(500, 'Callback URL tối đa 500 ký tự'),
        zalo_app_id: Yup.string().max(50, 'Zalo App ID tối đa 50 ký tự'),
        zalo_secret_key: Yup.string().max(255, 'Zalo Secret Key tối đa 255 ký tự'),
        zalo_template_id_otp: Yup.string().max(50, 'Template ID tối đa 50 ký tự'),
        zalo_access_token: Yup.string().max(5000, 'Access Token tối đa 5000 ký tự'),
        zalo_refresh_token: Yup.string().max(5000, 'Refresh Token tối đa 5000 ký tự'),
        mail_host: Yup.string().max(255, 'Mail Host tối đa 255 ký tự'),
        mail_port: Yup.number(),
        mail_user: Yup.string().max(255, 'Mail User tối đa 255 ký tự').email('Email không hợp lệ'),
        mail_pass: Yup.string().max(255, 'Mail Password tối đa 255 ký tự'),
        mail_from: Yup.string().max(255, 'Mail From tối đa 255 ký tự').email('Email không hợp lệ'),
        email_receive: Yup.string().max(255, 'Mail Receive tối đa 255 ký tự').email('Email không hợp lệ'),
        send_report_mail: Yup.boolean(),
        time_report_mail: Yup.string().nullable(),
        send_reminder_mail: Yup.boolean(),
        time_reminder_mail: Yup.string().nullable(),
        receive_support_mail: Yup.boolean(),
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
            email_receive: settings?.email_receive || '',
            send_report_mail: settings?.send_report_mail || false,
            time_report_mail: settings?.time_report_mail || null,
            send_reminder_mail: settings?.send_reminder_mail || false,
            time_reminder_mail: settings?.time_reminder_mail || null,
            receive_support_mail: settings?.receive_support_mail || false,
        }),
        [settings]
    );

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    const {
        reset,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (settings) {
            reset(defaultValues);
        }
    }, [settings, defaultValues, reset]);

    const onSubmit = (data: Partial<ISetting>) => {
        setTempData(data);
        confirm.onTrue();
    };

    const handleConfirm = async () => {
        try {
            if (tempData) {
                await updateSettings(tempData);
                enqueueSnackbar('Cập nhật thành công!');
                confirm.onFalse();
            }
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Có lỗi xảy ra', { variant: 'error' });
        }
    };

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    const TABS = [
        // { value: 'google', label: 'Google', icon: <Iconify icon="devicon:google" width={24} /> },
        { value: 'zalo', label: 'Zalo', icon: <Iconify icon="arcticons:zalo" width={24} /> },
        { value: 'mail', label: 'Cấu hình Mail', icon: <Iconify icon="skill-icons:gmail-light" width={24} /> },
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
                                    <RHFTextField name="email_receive" label="Mail receive" helperText="Email hệ thống để nhận thông báo từ phía người dùng" />
                                </Stack>
                            </Grid>
                            <Grid xs={12} md={6} py={2} borderTop={1} borderColor="divider">
                                <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, mb: 3 }}>
                                    <Stack spacing={2}>
                                        <RHFSwitch name="send_report_mail" label="Nhận email báo cáo chuyến đi và giao dịch từ người dùng" />
                                        <Controller
                                            name="time_report_mail"
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <TimePicker
                                                    label="Thời gian gửi"
                                                    value={parseCronTime(field.value || null)}
                                                    onChange={(newValue) => {
                                                        field.onChange(formatCronTime(newValue));
                                                    }}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: !!error,
                                                            helperText: error?.message,
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Stack>
                                </Box>
                                <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                                    <Stack spacing={2}>
                                        <RHFSwitch name="send_reminder_mail" label="Gửi email yêu cầu thông tin" />

                                        <Controller
                                            name="time_reminder_mail"
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <TimePicker
                                                    label="Thời gian gửi"
                                                    value={parseCronTime(field.value || null)}
                                                    onChange={(newValue) => {
                                                        field.onChange(formatCronTime(newValue));
                                                    }}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            error: !!error,
                                                            helperText: error?.message,
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Stack>
                                </Box>
                            </Grid>
                            <Grid xs={12} md={6} py={2} borderTop={1} borderColor="divider">
                                <Stack spacing={3}>
                                    <RHFSwitch name="receive_support_mail" label="Nhận email yêu cầu hỗ trợ từ người dùng" />
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

// ----------------------------------------------------------------------

function parseCronTime(cron: string | null) {
    if (!cron) return null;
    const parts = cron.split(' ');
    if (parts.length < 3) return null;
    const date = new Date();
    date.setHours(parseInt(parts[2], 10) || 0);
    date.setMinutes(parseInt(parts[1], 10) || 0);
    date.setSeconds(0);
    return date;
}

function formatCronTime(date: Date | null) {
    if (!date) return null;
    const m = date.getMinutes();
    const h = date.getHours();
    return `0 ${m} ${h} * * *`;
}
