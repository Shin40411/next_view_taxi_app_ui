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

import axiosInstance, { endpoints } from 'src/utils/axios';
//
import ServicePointNewEditForm from 'src/sections/admin/service-point/service-point-new-edit-form';
import { useAdmin } from 'src/hooks/api/use-admin';

// ----------------------------------------------------------------------

// types
import { IAdminServicePoint, IUpdateUserDto } from 'src/types/user';
import { AdminServicePoint } from 'src/services/admin';
import { mapToFormDTO } from '../helper/mapper';
import { FormValues } from 'src/sections/admin/service-point/interface/form-value';

// ----------------------------------------------------------------------

export default function ServicePointProfileView() {
    const settings = useSettingsContext();

    const { user: authUser } = useAuthContext();

    const { useGetUser, updateUser } = useAdmin();

    const { user, userLoading } = useGetUser(authUser?.id);

    const { enqueueSnackbar } = useSnackbar();



    const handleUpdate = async (data: FormValues) => {
        try {
            if (!authUser?.id) return;

            const updateData: IUpdateUserDto = {
                full_name: data.name,
                address: data.address,
                reward_amount: data.rewardPoints,
                geofence_radius: data.radius,
                latitude: data.lat,
                longitude: data.lng,
                is_active: data.status,
                province: data.province,
                tax_id: data.tax_id,
            };

            await updateUser(authUser.id, updateData);
            mutate(authUser?.id ? `${endpoints.user.root}/${authUser.id}` : null);
            enqueueSnackbar('Cập nhật thành công!');
        } catch (error: any) {
            console.error("Failed to update service point", error);
            enqueueSnackbar(error?.message || 'Có lỗi xảy ra!', { variant: 'error' });
        }
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
        </Container>
    );
}
