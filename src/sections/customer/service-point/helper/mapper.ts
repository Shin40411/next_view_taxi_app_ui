
import { AdminServicePoint } from 'src/services/admin';
import { IUserAdmin } from 'src/types/user';

export function mapToFormDTO(user: IUserAdmin | null): AdminServicePoint | undefined {
    if (!user || !user.servicePoints || user.servicePoints.length === 0) {
        return undefined;
    }

    const servicePoint = user.servicePoints[0];

    let lat = 21.028511;
    let lng = 105.854444;

    if (servicePoint.location) {
        try {
            const parts = servicePoint.location.split(',').map(s => parseFloat(s.trim()));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                lat = parts[0];
                lng = parts[1];
            }
        } catch (e) {
            console.error('Failed to parse location', servicePoint.location);
        }
    }

    return {
        id: servicePoint.id,
        name: servicePoint.name,
        address: servicePoint.address,
        lat: lat,
        lng: lng,
        phone: user.username || '',
        rewardPoints: Number(servicePoint.reward_amount || 0),
        discount: Number(servicePoint.discount || 0),
        province: servicePoint.province || '',
        radius: servicePoint.geofence_radius || 100,
        status: 'active',
        tax_id: user.tax_id || servicePoint.id,
        bank_name: (user as any).bankAccount?.bank_name || '',
        account_number: (user as any).bankAccount?.account_number || '',
        account_holder_name: (user as any).bankAccount?.account_holder_name || '',
    };
}
