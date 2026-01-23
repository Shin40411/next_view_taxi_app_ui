
// ----------------------------------------------------------------------

export type TripStatus = 'PENDING_CONFIRMATION' | 'ARRIVED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

export type UserRole = 'ADMIN' | 'PARTNER' | 'CUSTOMER' | 'INTRODUCER' | 'ACCOUNTANT' | 'MONITOR';

export interface IUser {
    id: string;
    username: string;
    full_name: string;
    role: UserRole;
    partnerProfile?: IPartnerProfile;
    avatar?: string;
}

export interface IPartnerProfile {
    id: string;
    wallet_balance: number;
    vehicle_plate?: string;
}

export interface IServicePoint {
    id: string;
    name: string;
    address: string;
    location: string;
    geofence_radius: number;
    reward_amount: number;
    advertising_budget: number;
    province: string;
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
    updated_at: Date;
    arrival_time: Date;
    reject_reason?: string;
    trip_code?: string;
}

export interface ITripStats {
    totalSpent: number;
}

export interface ICustomerOrder {
    id: string;
    driverName: string;
    avatarUrl: string;
    licensePlate: string;
    phone: string;
    createdAt: Date | string;
    declaredGuests: number;
    actualGuestCount?: number;
    servicePointName?: string;
    pointsPerGuest?: number;
    status: string;
    arrivalTime?: Date | string;
    rejectReason?: string;
    tripCode?: string;
}

export interface IPaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}