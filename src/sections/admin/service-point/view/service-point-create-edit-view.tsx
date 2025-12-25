import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAdmin } from 'src/hooks/api/use-admin';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { getServicePoint, AdminServicePoint } from 'src/services/admin';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ServicePointNewEditForm from '../service-point-new-edit-form';
import { Button, Stack } from '@mui/material';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ServicePointCreateEditView() {
    const params = useParams();
    const { id } = params;

    const navigate = useNavigate();

    const { useGetUser } = useAdmin();

    const { user: currentUser, userLoading } = useGetUser(id);

    const [currentServicePoint, setCurrentServicePoint] = useState<AdminServicePoint | undefined>(undefined);

    useEffect(() => {
        console.log('User Data:', currentUser);
        if (currentUser && currentUser.servicePoints && currentUser.servicePoints.length > 0) {
            const sp = currentUser.servicePoints[0];
            console.log('Found Service Point:', sp);

            // Parse location "POINT(lat lng)" or "POINT(lng lat)"
            // Assuming "POINT(10.776111 106.701111)" where 10.77 is Lat, 106.70 is Lng based on HCMC coordinates.
            let lat = 21.028511;
            let lng = 105.854444;

            if (sp.location) {
                const matches = sp.location.match(/POINT\(([\d\.]+) ([\d\.]+)\)/);
                if (matches && matches.length === 3) {
                    // Based on user data: POINT(10.776111 106.701111) -> 10.77 is Lat
                    lat = parseFloat(matches[1]);
                    lng = parseFloat(matches[2]);
                }
            }

            setCurrentServicePoint({
                id: sp.id,
                name: sp.name,
                address: sp.address,
                phone: currentUser.username, // Using username as phone based on provided data structure
                radius: sp.geofence_radius,
                rewardPoints: Number(sp.reward_amount),
                lat: lat,
                lng: lng,
                status: 'active', // Default to active or map if available
            });
        }
    }, [currentUser]);

    const handleBack = () => {
        navigate(paths.dashboard.admin.servicePoints.root);
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

            <CustomBreadcrumbs
                heading={currentServicePoint ? 'Chỉnh sửa điểm dịch vụ' : 'Tạo điểm dịch vụ mới'}
                links={[
                    {
                        name: 'Điểm dịch vụ',
                        href: paths.dashboard.admin.servicePoints.root,
                    },
                    { name: currentServicePoint?.name || 'Tạo mới' },
                ]}
                sx={{
                    my: { xs: 3, md: 5 },
                }}
            />

            <ServicePointNewEditForm currentServicePoint={currentServicePoint} />
        </Container>
    );
}
