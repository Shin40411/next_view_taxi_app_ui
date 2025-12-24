export type RegisterPayload = {
    username: string;
    password: string;
    full_name: string;
    role: string;
    vehicle_plate?: string;
    id_card_front?: string;
    id_card_back?: string;
    tax_id?: string;
    // For FormData support (optional to include here but good for type safety if we weren't using FormData object directly)
    [key: string]: any;
};