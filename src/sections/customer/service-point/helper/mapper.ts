import { AdminServicePoint } from "src/services/admin";
import { IAdminServicePoint, IUserAdmin } from "src/types/user";

export function mapToFormDTO(user: IUserAdmin): AdminServicePoint {
    let lat = 21.028511;
    let lng = 105.854444;

    if (!user.servicePoints) {
        return {
            id: '',
            name: '',
            address: '',
            lat: lat,
            lng: lng,
            phone: user.username,
            rewardPoints: Number(0),
            radius: 0,
            status: 'active',
        };
    }

    const sp = user.servicePoints[0];
    if (sp.location) {
        try {
            if (typeof sp.location === 'string' && sp.location.startsWith('POINT')) {
                const matches = sp.location.match(/POINT\(([\d\.]+) ([\d\.]+)\)/);
                if (matches && matches.length === 3) {
                    lat = parseFloat(matches[1]);
                    lng = parseFloat(matches[2]);
                }
            } else if (typeof sp.location === 'string' && sp.location.includes(',')) {
                const parts = sp.location.split(',');
                if (parts.length === 2) {
                    lat = parseFloat(parts[0].trim());
                    lng = parseFloat(parts[1].trim());
                }
            }
        } catch (e) {
            console.error("Error parsing location", sp.location);
        }
    }

    return {
        id: sp.id,
        name: sp.name,
        address: sp.address,
        lat: lat,
        lng: lng,
        phone: user.username,
        rewardPoints: Number(sp.reward_amount || 0),
        radius: sp.geofence_radius || 50,
        status: 'active',
    };
}