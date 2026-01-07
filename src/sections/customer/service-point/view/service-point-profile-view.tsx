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
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { useBoolean } from 'src/hooks/use-boolean';
import PasswordChange from 'src/components/dialogs/password-change';
import { ConfirmDialog } from 'src/components/custom-dialog';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { mutate } from 'swr';
import { ASSETS_API } from 'src/config-global';
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
import { useContract } from 'src/hooks/api/use-contract';
import ContractPreview from 'src/sections/contract/contract-preview';

// ----------------------------------------------------------------------

export default function ServicePointProfileView() {
    const settings = useSettingsContext();

    const { user: authUser } = useAuthContext();

    const { useGetUser, updateUser } = useAdmin();

    const { user, userLoading } = useGetUser(authUser?.id);

    const { enqueueSnackbar } = useSnackbar();

    const [currentTab, setCurrentTab] = useState('info');

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    const handleUpdate = async (data: FormValues) => {
        try {
            if (!authUser?.id) return;

            const updateData: IUpdateUserDto = {
                username: data.phone,
                full_name: data.name,
                address: data.address,
                reward_amount: data.rewardPoints,
                discount: data.discount,
                geofence_radius: data.radius,
                latitude: data.lat,
                longitude: data.lng,
                is_active: data.status,
                province: data.province,
                tax_id: data.tax_id,
                bank_name: data.bank_name,
                account_number: data.account_number,
                account_holder_name: data.account_holder_name,
                contract: typeof data.contract === 'string' ? undefined : data.contract,
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
            <Tabs
                value={currentTab}
                onChange={handleChangeTab}
                sx={{
                    mb: 3,
                }}
            >
                <Tab value="info" label="Thông tin" />
                {user?.servicePoints?.[0]?.contract && (
                    <Tab value="contract" label="Hợp đồng đã ký" />
                )}
                <Tab value="security" label="Bảo mật" />
            </Tabs>

            {currentTab === 'info' && (
                <>
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
                </>
            )}

            {currentTab === 'security' && (
                <Card sx={{ p: 3 }}>
                    <PasswordChange />
                </Card>
            )}

            {currentTab === 'contract' && user?.servicePoints?.[0]?.contract && (
                <Card sx={{ mb: 3, p: 3, height: '80vh' }}>
                    {user.servicePoints[0].contract.endsWith('.pdf') ? (
                        <iframe
                            src={`${ASSETS_API}/${user.servicePoints[0].contract}`}
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                        />
                    ) : (
                        <Box
                            component="img"
                            src={`${ASSETS_API}/${user.servicePoints[0].contract}`}
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }}
                        />
                    )}
                </Card>
            )}
        </Container>
    );
}
