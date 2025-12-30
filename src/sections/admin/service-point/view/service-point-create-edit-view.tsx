import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAdmin } from 'src/hooks/api/use-admin';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { AdminServicePoint } from 'src/services/admin';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ServicePointNewEditForm from '../service-point-new-edit-form';
import { Button, Stack } from '@mui/material';
import Iconify from 'src/components/iconify';
import { enqueueSnackbar } from 'notistack';
import { FormValues } from '../interface/form-value';

// ----------------------------------------------------------------------

export default function ServicePointCreateEditView() {
    const params = useParams();
    const { id } = params;

    const navigate = useNavigate();

    const { useGetUser, updateUser, createUser } = useAdmin();

    const { user: currentUser, userLoading } = useGetUser(id);

    const [currentServicePoint, setCurrentServicePoint] = useState<AdminServicePoint | undefined>(undefined);

    useEffect(() => {
        if (currentUser && currentUser.servicePoints && currentUser.servicePoints.length > 0) {
            const sp = currentUser.servicePoints[0];
            console.log('Found Service Point:', sp);

            let lat = 21.028511;
            let lng = 105.854444;

            if (sp.location) {
                const matches = sp.location.match(/POINT\(([\d\.]+) ([\d\.]+)\)/);
                if (matches && matches.length === 3) {
                    lat = parseFloat(matches[1]);
                    lng = parseFloat(matches[2]);
                }
            }

            setCurrentServicePoint({
                id: sp.id,
                name: sp.name,
                address: sp.address,
                phone: currentUser.username,
                province: sp.province,
                radius: sp.geofence_radius,
                rewardPoints: Number(sp.reward_amount),
                lat: lat,
                lng: lng,
                status: 'active',
                tax_id: currentUser.tax_id || '',
                bank_name: (currentUser as any).bankAccount?.bank_name || '',
                account_number: (currentUser as any).bankAccount?.account_number || '',
                account_holder_name: (currentUser as any).bankAccount?.account_holder_name || '',
            });
        }
    }, [currentUser]);

    const handleBack = () => {
        navigate(paths.dashboard.admin.servicePoints.root);
    };

    const handleUpdateUser = async (data: FormValues) => {
        try {
            if (id) {
                await updateUser(id, {
                    full_name: data.name,
                    address: data.address,
                    geofence_radius: data.radius,
                    reward_amount: data.rewardPoints,
                    latitude: data.lat,
                    longitude: data.lng,
                    is_active: data.status,
                    tax_id: data.tax_id,
                    province: data.province,
                    bank_name: data.bank_name,
                    account_number: data.account_number,
                    account_holder_name: data.account_holder_name,
                });
                enqueueSnackbar('Cập nhật thành công!', { variant: 'success' });
            } else {
                await createUser({
                    full_name: data.name,
                    username: data.phone,
                    password: data.password,
                    role: 'CUSTOMER',
                    address: data.address,
                    geofence_radius: data.radius,
                    reward_amount: data.rewardPoints,
                    latitude: data.lat,
                    longitude: data.lng,
                    is_active: true,
                    tax_id: data.tax_id,
                    province: data.province,
                    bank_name: data.bank_name,
                    account_number: data.account_number,
                    account_holder_name: data.account_holder_name,
                } as any);
                enqueueSnackbar('Tạo mới thành công!', { variant: 'success' });
            }
            navigate(paths.dashboard.admin.servicePoints.root);
        } catch (error: any) {
            console.error(error);
            enqueueSnackbar(error?.message || (id ? 'Cập nhật thất bại!' : 'Tạo mới thất bại!'), { variant: 'error' });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
                <Button
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    variant='contained'
                    startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                >
                    Quay lại
                </Button>
            </Stack>

            <ServicePointNewEditForm
                currentServicePoint={currentServicePoint}
                onSubmit={handleUpdateUser}
            />
        </Container>
    );
}
