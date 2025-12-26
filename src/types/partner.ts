export type ISearchDestinationItem = {
    id: string;
    name: string;
    address: string;
    location: string;
    reward_amount: string;
    advertising_budget: string;
};

export type ISearchDestinationResponse = {
    statusCode: number;
    message: string;
    data: ISearchDestinationItem[];
};

export type ITrip = {
    trip_id: string;
    partner: any; // Using any for simplified relation
    servicePoint: any; // Using any for simplified relation
    guest_count: number;
    actual_guest_count?: number;
    status: string;
    reward_snapshot: number;
    created_at: Date;
    arrival_time?: Date;
};

export type ICreateTripRequestResponse = {
    message: string;
    trip_id: string;
};

export type ITripRequest = {
    id: string;
    service_point_name: string;
    service_point_address: string;
    guest_count: number;
    actual_guest_count: number | null;
    status: string;
    reward_goxu: number;
    created_at: string;
};

export type IGetMyRequestsResponse = {
    statusCode: number;
    message: string;
    data: ITripRequest[];
};

export type IPartnerStats = {
    range: string;
    total_points: number;
    total_trips: number;
    from_date: string;
    to_date: string;
};
