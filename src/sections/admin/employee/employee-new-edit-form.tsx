import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useState, useCallback } from 'react';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Card, Grid, Stack, Typography, MenuItem } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// types
import { IUserAdmin } from 'src/types/user';
// hooks
import { useAdmin } from 'src/hooks/api/use-admin';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
// components
import FormProvider, { RHFTextField, RHFUploadAvatar, RHFSelect } from 'src/components/hook-form';
// utils
import { getFullImageUrl } from 'src/utils/get-image';

// ----------------------------------------------------------------------

type Props = {
    currentUser?: IUserAdmin;
};

export default function EmployeeNewEditForm({ currentUser }: Props) {
    const router = useRouter();

    const { createUser, updateUser } = useAdmin();



    const { enqueueSnackbar } = useSnackbar();

    const confirm = useBoolean();

    const [submitData, setSubmitData] = useState<any>(null);

    const NewUserSchema = Yup.object().shape({
        full_name: Yup.string().required('Tên nhân viên là bắt buộc').max(100, 'Tên nhân viên tối đa 100 ký tự'),
        username: Yup.string().required('Tên đăng nhập là bắt buộc').max(50, 'Tên đăng nhập tối đa 50 ký tự'),
        password: Yup.string().test({
            name: 'password',
            message: 'Mật khẩu là bắt buộc khi tạo mới',
            test: (value) => {
                if (!currentUser && !value) return false;
                return true;
            }
        }).max(100, 'Mật khẩu tối đa 100 ký tự'),
        avatarUrl: Yup.mixed<any>().nullable(),
        role: Yup.string().required('Vai trò là bắt buộc'),
    });

    const defaultValues = useMemo(
        () => ({
            full_name: currentUser?.full_name || '',
            username: currentUser?.username || '',
            password: '',
            avatarUrl: getFullImageUrl(currentUser?.avatarUrl || (currentUser as any)?.avatar),
            role: currentUser?.role || 'ACCOUNTANT',
        }),
        [currentUser]
    );

    const methods = useForm({
        resolver: yupResolver(NewUserSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (currentUser) {
            reset({
                ...defaultValues,
                avatarUrl: getFullImageUrl(currentUser?.avatarUrl || (currentUser as any)?.avatar),
            });
        }
    }, [currentUser, defaultValues, reset]);

    const onSubmit = handleSubmit(async (data) => {
        setSubmitData(data);
        confirm.onTrue();
    });

    const handleConfirm = useCallback(async () => {
        try {
            const data = submitData;
            const payload: any = {
                full_name: data.full_name,
                username: data.username,
                role: data.role,
                avatar: data.avatarUrl,
            };

            if (data.password) {
                payload.password = data.password;
            }

            if (currentUser) {
                await updateUser(currentUser.id, payload);
                enqueueSnackbar('Cập nhật thành công!');
            } else {
                await createUser(payload);
                enqueueSnackbar('Tạo mới thành công!');
            }
            confirm.onFalse();
            router.push(paths.dashboard.admin.employees.root);
        } catch (error) {
            console.error(error);
            enqueueSnackbar(error?.message || 'Có lỗi xảy ra', { variant: 'error' });
            confirm.onFalse();
        }
    }, [createUser, updateUser, currentUser, enqueueSnackbar, router, submitData, confirm]);

    const handleDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        const newFile = Object.assign(file, {
            preview: URL.createObjectURL(file),
        });

        if (file) {
            setValue('avatarUrl', newFile, { shouldValidate: true });
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ pt: 10, pb: 5, px: 3 }}>
                        <Box sx={{ mb: 5 }}>
                            <RHFUploadAvatar
                                name="avatarUrl"
                                maxSize={5242880}
                                onDrop={handleDrop}
                                helperText={
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            mt: 2,
                                            mx: 'auto',
                                            display: 'block',
                                            textAlign: 'center',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        Cho phép *.jpeg, *.jpg, *.png, *.gif
                                        <br /> tối đa 5MB
                                    </Typography>
                                }
                            />
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <RHFTextField name="full_name" label="Họ tên nhân viên" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <RHFTextField name="username" label="Tên đăng nhập" disabled={!!currentUser} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <RHFSelect
                                    name="role"
                                    label="Vai trò"
                                    disabled={!!currentUser}
                                >
                                    {[
                                        { value: 'ACCOUNTANT', label: 'Kế toán' },
                                        { value: 'MONITOR', label: 'Quản lý' },
                                    ].map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </RHFSelect>
                            </Grid>

                            {!currentUser && (
                                <Grid item xs={12} sm={6}>
                                    <RHFTextField name="password" label="Mật khẩu" type="password" />
                                </Grid>
                            )}
                        </Grid>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!currentUser ? 'Tạo nhân viên' : 'Lưu thay đổi'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title={currentUser ? 'Xác nhận cập nhật' : 'Xác nhận tạo mới'}
                content={
                    <>
                        Bạn có chắc chắn muốn {currentUser ? 'cập nhật' : 'tạo mới'} nhân viên{' '}
                        <strong>{submitData?.full_name}</strong>?
                    </>
                }
                action={
                    <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={isSubmitting}
                        onClick={handleConfirm}
                    >
                        Xác nhận
                    </LoadingButton>
                }
            />
        </FormProvider>
    );
}
