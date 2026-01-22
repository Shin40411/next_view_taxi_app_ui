import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useParams, useNavigate } from 'react-router-dom';

import { Stack, Button } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useAdmin } from 'src/hooks/api/use-admin';

import { AdminServicePoint } from 'src/services/admin';

import Iconify from 'src/components/iconify';

import { FormValues } from '../interface/form-value';
import ServicePointNewEditForm from '../service-point-new-edit-form';

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
                phone: currentUser.phone_number || currentUser.username,
                email: currentUser.email || undefined,
                province: sp.province,
                radius: sp.geofence_radius,
                rewardPoints: Number(sp.reward_amount),
                discount: Number(sp.discount),
                lat,
                lng,
                status: 'active',
                tax_id: currentUser.tax_id || '',
                bank_name: (currentUser as any).bankAccount?.bank_name || '',
                account_number: (currentUser as any).bankAccount?.account_number || '',
                account_holder_name: (currentUser as any).bankAccount?.account_holder_name || '',
                contract: sp.contract,
                avatar: currentUser.avatarUrl || (currentUser as any).avatar,
                wallet_expiry_date: sp.wallet_expiry_date,
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
                    full_name: data.name.trim(),
                    username: data.phone.trim(),
                    phone_number: data.phone.trim(),
                    email: data.email,
                    address: data.address,
                    geofence_radius: data.radius,
                    reward_amount: data.rewardPoints,
                    discount: data.discount,
                    latitude: data.lat,
                    longitude: data.lng,
                    is_active: data.status,
                    tax_id: data.tax_id,
                    province: data.province,
                    bank_name: data.bank_name,
                    account_number: data.account_number,
                    account_holder_name: data.account_holder_name,
                    contract: typeof data.contract === 'string' ? undefined : data.contract,
                    avatar: typeof data.avatar === 'string' ? undefined : data.avatar,
                    wallet_expiry_date: data.wallet_expiry_date ? data.wallet_expiry_date.toISOString() : undefined,
                });
                enqueueSnackbar('Cập nhật thành công!', { variant: 'success' });
            } else {
                await createUser({
                    full_name: data.name.trim(),
                    username: data.phone.trim(),
                    phone_number: data.phone.trim(),
                    email: data.email,
                    password: data.password,
                    role: 'CUSTOMER',
                    address: data.address,
                    geofence_radius: data.radius,
                    reward_amount: data.rewardPoints,
                    discount: data.discount,
                    latitude: data.lat,
                    longitude: data.lng,
                    is_active: true,
                    tax_id: data.tax_id,
                    province: data.province,
                    bank_name: data.bank_name,
                    account_number: data.account_number,
                    account_holder_name: data.account_holder_name,
                    contract: data.contract,
                    avatar: data.avatar,
                    wallet_expiry_date: data.wallet_expiry_date ? data.wallet_expiry_date.toISOString() : undefined,
                    send_notification: data.send_notification,
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
