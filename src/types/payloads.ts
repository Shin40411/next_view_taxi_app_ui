export type RegisterPayload = {
    username: string;
    password: string;
    role: 'ctv' | 'driver' | 'cosokd';
    fullName?: string;
    phoneNumber?: string;
    address?: string;
    pointsPerGuest?: number;
    branches?: any[];
    taxiBrand?: string;
    licensePlate?: string;
};