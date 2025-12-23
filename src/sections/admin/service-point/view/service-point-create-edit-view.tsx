import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { getServicePoint, AdminServicePoint } from 'src/services/admin';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ServicePointNewEditForm from '../service-point-new-edit-form';

// ----------------------------------------------------------------------

export default function ServicePointCreateEditView() {
    const params = useParams();
    const { id } = params;

    const [currentServicePoint, setCurrentServicePoint] = useState<AdminServicePoint | undefined>(undefined);

    useEffect(() => {
        if (id) {
            const fetchDetail = async () => {
                const data = await getServicePoint(id);
                if (data) {
                    setCurrentServicePoint(data);
                }
            };
            fetchDetail();
        }
    }, [id]);

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={currentServicePoint ? 'Chỉnh sửa điểm dịch vụ' : 'Tạo điểm dịch vụ mới'}
                links={[
                    {
                        name: 'Dashboard',
                        href: paths.dashboard.root,
                    },
                    {
                        name: 'Điểm dịch vụ',
                        href: paths.dashboard.admin.servicePoints.root,
                    },
                    { name: currentServicePoint?.name || 'Tạo mới' },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <ServicePointNewEditForm currentServicePoint={currentServicePoint} />
        </Container>
    );
}
