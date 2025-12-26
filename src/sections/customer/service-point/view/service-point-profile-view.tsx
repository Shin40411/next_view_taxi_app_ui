'use client';

import { useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { mutate } from 'swr';
// hooks
import { useAuthContext } from 'src/auth/hooks';
import { useServicePoint } from 'src/hooks/api/use-service-point';
import axiosInstance, { endpoints } from 'src/utils/axios';
//
import ServicePointNewEditForm, { FormValues } from 'src/sections/admin/service-point/service-point-new-edit-form';
import { useAdmin } from 'src/hooks/api/use-admin';

// ----------------------------------------------------------------------

// types
import { IAdminServicePoint, IUpdateUserDto } from 'src/types/user';
import { AdminServicePoint } from 'src/services/admin';
import { mapToFormDTO } from '../helper/mapper';

// ----------------------------------------------------------------------

export default function ServicePointProfileView() {
    const settings = useSettingsContext();

    const { user: authUser } = useAuthContext();

    const { useGetUser, updateUser } = useAdmin();

    const { user, userLoading } = useGetUser(authUser?.id);

    const { enqueueSnackbar } = useSnackbar();

    const confirm = useBoolean();

    const [pendingData, setPendingData] = useState<FormValues | null>(null);
    const [resolveSubmit, setResolveSubmit] = useState<((value: void | PromiseLike<void>) => void) | null>(null);

    const handleUpdate = async (data: FormValues) => {
        setPendingData(data);
        confirm.onTrue();
        return new Promise<void>((resolve) => {
            setResolveSubmit(() => resolve);
        });
    };

    const onConfirmUpdate = async () => {
        try {
            if (!authUser?.id || !pendingData) return;

            const updateData: IUpdateUserDto = {
                full_name: pendingData.name,
                address: pendingData.address,
                reward_amount: pendingData.rewardPoints,
                geofence_radius: pendingData.radius,
                latitude: pendingData.lat,
                longitude: pendingData.lng,
                is_active: pendingData.status,
            };

            await updateUser(authUser.id, updateData);
            mutate(authUser?.id ? `${endpoints.user.root}/${authUser.id}` : null);
            enqueueSnackbar('Cập nhật thành công!');

            resolveSubmit?.();
            confirm.onFalse();
        } catch (error) {
            console.error("Failed to update service point", error);
            enqueueSnackbar('Có lỗi xảy ra!', { variant: 'error' });
            resolveSubmit?.();
            confirm.onFalse();
        }
    };

    const onCancelUpdate = () => {
        confirm.onFalse();
        resolveSubmit?.();
    };

    return (
        <Container
            maxWidth={settings.themeStretch ? false : 'xl'}
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '80vh',
            }}
        >
            {user && user.servicePoints && user.servicePoints.length > 0 && (
                <ServicePointNewEditForm
                    currentServicePoint={mapToFormDTO(user)}
                    onSubmit={handleUpdate}
                />
            )}

            {userLoading && (
                <Box sx={{ p: 3 }}>
                    <Stack spacing={3}>
                        <Skeleton variant="text" height={40} width="30%" />
                        <Stack spacing={2}>
                            <Skeleton variant="rectangular" height={56} />
                            <Skeleton variant="rectangular" height={56} />
                            <Skeleton variant="rectangular" height={56} />
                        </Stack>
                        <Skeleton variant="rectangular" height={400} />
                    </Stack>
                </Box>
            )}

            {!userLoading && (!user || !user.servicePoints || user.servicePoints.length === 0) && (
                <EmptyContent
                    filled
                    title="Không tìm thấy thông tin cơ sở kinh doanh"
                    description="Vui lòng liên hệ quản trị viên để được hỗ trợ."
                    imgUrl="/assets/icons/empty/ic_content.svg"
                />
            )}

            <ConfirmDialog
                open={confirm.value}
                onClose={onCancelUpdate}
                title="Xác nhận cập nhật"
                content="Bạn có chắc chắn muốn cập nhật thông tin này không?"
                action={
                    <Button variant="contained" color="primary" onClick={onConfirmUpdate}>
                        Xác nhận
                    </Button>
                }
            />
        </Container>
    );
}
