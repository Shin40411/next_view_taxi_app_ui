
// ----------------------------------------------------------------------

export type TripStatus = 'PENDING_CONFIRMATION' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

export type UserRole = 'ADMIN' | 'PARTNER' | 'CUSTOMER';

export interface IUser {
    id: string;
    username: string;
    full_name: string;
    role: UserRole;
    partnerProfile?: IPartnerProfile;
}

export interface IPartnerProfile {
    id: string;
    wallet_balance: number;
    vehicle_plate?: string;
    // Add other fields as needed
}

export interface IServicePoint {
    id: string;
    name: string;
    address: string;
    location: string;
    geofence_radius: number;
    reward_amount: number;
    advertising_budget: number;
    owner: IUser;
}

export interface ITrip {
    trip_id: string;
    partner: IUser;
    servicePoint: IServicePoint;
    guest_count: number;
    actual_guest_count?: number;
    status: TripStatus;
    reward_snapshot: number;
    created_at: Date;
    arrival_time?: Date;
}

export interface ITripStats {
    totalSpent: number;
}