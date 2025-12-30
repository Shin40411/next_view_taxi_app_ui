// ----------------------------------------------------------------------


export type AdminDashboardStats = {
    totalDrivers: number;
    totalPartners: number;
    totalProperties: number; // Service points / properties
    totalTrips: number;
    totalBonus: number;
    tripsByHour: {
        categories: string[];
        series: { name: string; data: number[] }[];
    };
    topDrivers: {
        id: string;
        name: string;
        totalTrips: number;
        avatarUrl?: string;
        bankName?: string;
        accountNumber?: string;
        accountHolderName?: string;
    }[];
    topServicePoints: {
        id: string;
        name: string;
        totalVisits: number;
        bankName?: string;
        accountNumber?: string;
        accountHolderName?: string;
    }[];
};

export type AdminLiveDriver = {
    id: string;
    name: string;
    vehiclePlate: string;
    lat: number;
    lng: number;
    status: 'online' | 'busy' | 'offline';
};

// ----------------------------------------------------------------------

export async function getDashboardStats(): Promise<AdminDashboardStats> {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                totalDrivers: 124,
                totalPartners: 45, // Partners (Drivers/CTVs)
                totalProperties: 12, // Service Points
                totalTrips: 1250,
                totalBonus: 25000000,
                tripsByHour: {
                    categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
                    series: [
                        { name: 'Hôm qua', data: [10, 5, 20, 55, 40, 70, 30] },
                        { name: 'Hôm nay', data: [12, 8, 35, 60, 20, 85, 45] },
                    ],
                },
                topDrivers: [
                    { id: '1', name: 'Nguyễn Văn A', totalTrips: 154, avatarUrl: '', bankName: 'Vietinbank', accountNumber: '1010102020', accountHolderName: 'NGUYEN VAN A' },
                    { id: '2', name: 'Trần Thị B', totalTrips: 120, avatarUrl: '', bankName: 'Vietcombank', accountNumber: '99998888', accountHolderName: 'TRAN THI B' },
                    { id: '3', name: 'Lê Văn C', totalTrips: 98, avatarUrl: '', bankName: 'Techcombank', accountNumber: '190333444', accountHolderName: 'LE VAN C' },
                    { id: '4', name: 'Phạm Văn D', totalTrips: 85, avatarUrl: '', bankName: 'MBBank', accountNumber: '55556666', accountHolderName: 'PHAM VAN D' },
                    { id: '5', name: 'Hoàng Văn E', totalTrips: 72, avatarUrl: '', bankName: 'Agribank', accountNumber: '33332222', accountHolderName: 'HOANG VAN E' },
                ],
                topServicePoints: [
                    { id: '1', name: 'Nhà hàng Biển Đông', totalVisits: 450, bankName: 'BIDV', accountNumber: '1234567890', accountHolderName: 'NHA HANG BIEN DONG' },
                    { id: '2', name: 'Karaoke Top One', totalVisits: 320, bankName: 'VPBank', accountNumber: '0987654321', accountHolderName: 'KARAOKE TOP ONE' },
                    { id: '3', name: 'Bar 1900', totalVisits: 280, bankName: 'TPBank', accountNumber: '11112222', accountHolderName: 'BAR 1900' },
                    { id: '4', name: 'Khách sạn Metropole', totalVisits: 210, bankName: 'HSBC', accountNumber: '88889999', accountHolderName: 'KHACH SAN METROPOLE' },
                    { id: '5', name: 'Cafe Trung Nguyên', totalVisits: 150, bankName: 'Sacombank', accountNumber: '77776666', accountHolderName: 'CAFE TRUNG NGUYEN' },
                ],
            });
        }, 500);
    });
}

export async function getLiveMapDrivers(): Promise<AdminLiveDriver[]> {
    // Mock API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: '1', name: 'Nguyễn Văn A', vehiclePlate: '30A-123.45', lat: 21.028511, lng: 105.854444, status: 'online' },
                { id: '2', name: 'Trần Thị B', vehiclePlate: '29B-678.90', lat: 21.030511, lng: 105.850444, status: 'online' },
                { id: '3', name: 'Lê Văn C', vehiclePlate: '30E-999.99', lat: 21.025511, lng: 105.858444, status: 'busy' },
                { id: '4', name: 'Phạm Văn D', vehiclePlate: '30F-111.11', lat: 21.035511, lng: 105.848444, status: 'online' },
            ]);
        }, 500);
    });
}

// ----------------------------------------------------------------------

export type AdminTransaction = {
    id: string;
    driverName: string;
    vehiclePlate: string;
    pickupAddress: string;
    dropoffAddress: string;
    timestamp: Date;
    amount: number;
    status: 'completed' | 'cancelled';
};

export async function getTransactions(): Promise<AdminTransaction[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 'TXN-001',
                    driverName: 'Nguyễn Văn A',
                    vehiclePlate: '30A-123.45',
                    pickupAddress: '123 Kim Mã, Ba Đình',
                    dropoffAddress: '456 Láng Hạ, Đống Đa',
                    timestamp: new Date('2025-12-23T08:30:00'),
                    amount: 150000,
                    status: 'completed',
                },
                {
                    id: 'TXN-002',
                    driverName: 'Trần Thị B',
                    vehiclePlate: '29B-678.90',
                    pickupAddress: 'Aeon Mall Long Biên',
                    dropoffAddress: 'Times City, Hai Bà Trưng',
                    timestamp: new Date('2025-12-23T09:15:00'),
                    amount: 85000,
                    status: 'completed',
                },
                {
                    id: 'TXN-003',
                    driverName: 'Lê Văn C',
                    vehiclePlate: '30E-999.99',
                    pickupAddress: 'Sân bay Nội Bài',
                    dropoffAddress: 'Royal City, Thanh Xuân',
                    timestamp: new Date('2025-12-23T10:00:00'),
                    amount: 350000,
                    status: 'completed',
                },
                {
                    id: 'TXN-004',
                    driverName: 'Phạm Văn D',
                    vehiclePlate: '30F-111.11',
                    pickupAddress: 'Hồ Gươm, Hoàn Kiếm',
                    dropoffAddress: 'Lotte Center, Ba Đình',
                    timestamp: new Date('2025-12-23T11:45:00'),
                    amount: 50000,
                    status: 'cancelled',
                },
                {
                    id: 'TXN-005',
                    driverName: 'Nguyễn Văn A',
                    vehiclePlate: '30A-123.45',
                    pickupAddress: 'Keangnam Landmark 72',
                    dropoffAddress: 'Big C Thăng Long',
                    timestamp: new Date('2025-12-23T13:20:00'),
                    amount: 60000,
                    status: 'completed',
                },
            ]);
        }, 500);
    });
}

// ----------------------------------------------------------------------

export type PartnerSummary = {
    id: string;
    fullName: string;
    vehiclePlate: string;
    phoneNumber: string;
    rewardPoints: number;
    status: 'active' | 'banned' | 'pending';
    role: 'driver' | 'collaborator'; // Added role
    avatarUrl?: string; // Mock avatar
};

export type PartnerWalletTransaction = {
    id: string;
    type: 'deposit' | 'withdraw' | 'trip_fare' | 'bonus';
    amount: number;
    timestamp: Date;
    description: string;
};

export type PartnerDetail = PartnerSummary & {
    idCardFront: string;
    idCardBack: string;
    email: string;
    joinDate: Date;
    rating: number;
    totalTrips: number;
    tripHistory: AdminTransaction[];
    walletHistory: PartnerWalletTransaction[];
};

export async function getPartners(): Promise<PartnerSummary[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 'DRV-001', fullName: 'Nguyễn Văn A', vehiclePlate: '30A-123.45', phoneNumber: '0901234567', rewardPoints: 2500, status: 'active', role: 'driver' },
                { id: 'CTV-002', fullName: 'Trần Thị B', vehiclePlate: '29B-678.90', phoneNumber: '0912345678', rewardPoints: 120, status: 'pending', role: 'collaborator' },
                { id: 'DRV-003', fullName: 'Lê Văn C', vehiclePlate: '30E-999.99', phoneNumber: '0987654321', rewardPoints: 0, status: 'banned', role: 'driver' },
                { id: 'CTV-004', fullName: 'Phạm Văn D', vehiclePlate: '30F-111.11', phoneNumber: '0968686868', rewardPoints: 5000, status: 'active', role: 'collaborator' },
                { id: 'DRV-005', fullName: 'Hoàng Văn E', vehiclePlate: '30H-222.22', phoneNumber: '0977777777', rewardPoints: 1500, status: 'active', role: 'driver' },
            ]);
        }, 800);
    });
}

export async function getPartner(id: string): Promise<PartnerDetail | null> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockTxns: AdminTransaction[] = [
                {
                    id: 'TXN-001',
                    driverName: 'Nguyễn Văn A',
                    vehiclePlate: '30A-123.45',
                    pickupAddress: '123 Kim Mã',
                    dropoffAddress: '456 Láng Hạ',
                    timestamp: new Date('2025-12-23T08:30:00'),
                    amount: 150000,
                    status: 'completed',
                },
                {
                    id: 'TXN-005',
                    driverName: 'Nguyễn Văn A',
                    vehiclePlate: '30A-123.45',
                    pickupAddress: 'Keangnam',
                    dropoffAddress: 'Big C',
                    timestamp: new Date('2025-12-23T13:20:00'),
                    amount: 60000,
                    status: 'completed',
                },
            ];

            const mockWallet: PartnerWalletTransaction[] = [
                { id: 'W-001', type: 'deposit', amount: 500, timestamp: new Date('2025-12-01'), description: 'Nạp điểm' },
                { id: 'W-002', type: 'trip_fare', amount: 150, timestamp: new Date('2025-12-23T09:00'), description: 'Thưởng chuyến đi TXN-001' },
                { id: 'W-003', type: 'withdraw', amount: -200, timestamp: new Date('2025-12-20'), description: 'Đổi quà' },
            ];

            // Infer role from ID for mock simplicity
            const role = id.startsWith('CTV') ? 'collaborator' : 'driver';

            resolve({
                id: id,
                fullName: 'Nguyễn Văn A',
                vehiclePlate: '30A-123.45',
                phoneNumber: '0901234567',
                rewardPoints: 2500,
                status: 'active',
                role: role,
                email: 'nguyenvana@example.com',
                joinDate: new Date('2025-10-15'),
                rating: 4.8,
                totalTrips: 154,
                idCardFront: 'https://via.placeholder.com/600x400?text=CCCD+Mat+Truoc',
                idCardBack: 'https://via.placeholder.com/600x400?text=CCCD+Mat+Sau',
                tripHistory: mockTxns,
                walletHistory: mockWallet,
            });
        }, 1000);
    });
}

// ----------------------------------------------------------------------

export type AdminServicePoint = {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    phone: string;
    rewardPoints: number;
    province: string;
    radius: number; // in meters
    status: 'active' | 'inactive';
    tax_id?: string;
    bank_name?: string;
    account_number?: string;
    account_holder_name?: string;
};

// export async function getServicePoints(): Promise<AdminServicePoint[]> {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve([
//                 { id: 'SP-001', name: 'Nhà hàng Biển Đông', address: '123 Phạm Văn Đồng, Hà Nội', lat: 21.053511, lng: 105.789444, phone: '0905123123', rewardPoints: 50, radius: 50, status: 'active' },
//                 { id: 'SP-002', name: 'Karaoke Top One', address: '456 Lê Đức Thọ, Hà Nội', lat: 21.034511, lng: 105.768444, phone: '0912345678', rewardPoints: 30, radius: 100, status: 'active' },
//                 { id: 'SP-003', name: 'Bar 1900', address: '8 Tạ Hiện, Hà Nội', lat: 21.034911, lng: 105.852444, phone: '0988999888', rewardPoints: 100, radius: 50, status: 'inactive' },
//             ]);
//         }, 800);
//     });
// }

// export async function getServicePoint(id: string): Promise<AdminServicePoint | null> {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             const points: AdminServicePoint[] = [
//                 { id: 'SP-001', name: 'Nhà hàng Biển Đông', address: '123 Phạm Văn Đồng, Hà Nội', lat: 21.053511, lng: 105.789444, phone: '0905123123', rewardPoints: 50, radius: 50, status: 'active' },
//                 { id: 'SP-002', name: 'Karaoke Top One', address: '456 Lê Đức Thọ, Hà Nội', lat: 21.034511, lng: 105.768444, phone: '0912345678', rewardPoints: 30, radius: 100, status: 'active' },
//                 { id: 'SP-003', name: 'Bar 1900', address: '8 Tạ Hiện, Hà Nội', lat: 21.034911, lng: 105.852444, phone: '0988999888', rewardPoints: 100, radius: 50, status: 'inactive' },
//             ];
//             resolve(points.find(p => p.id === id) || null);
//         }, 500);
//     });
// }

