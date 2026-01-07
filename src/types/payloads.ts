export type RegisterPayload = {
    username: string;
    password: string;
    full_name: string;
    role: string;
    vehicle_plate?: string;
    id_card_front?: string;
    id_card_back?: string;
    tax_id?: string;
    province?: string;
    [key: string]: any;
};