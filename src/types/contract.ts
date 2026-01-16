export interface ContractData {
    full_name: string;
    birth_year: string;
    phone_number: string;
    cccd: string;
    address: string;
    vehicle: string;
    signature: string;
    created_at?: string | Date;
    expire_date?: string | Date;
    signed_date?: string | Date;
};

export type IContract = {
    id: string;
    full_name: string;
    birth_year: string;
    phone_number: string;
    cccd: string;
    address: string;
    vehicle: string;
    signature: string;
    created_at: Date;
    user_id: string;
    status: 'ACTIVE' | 'TERMINATED' | 'INACTIVE';
    expire_date?: Date;
    signed_date?: Date;
};

export type ICreateContractRequest = {
    full_name: string;
    birth_year: string;
    phone_number: string;
    cccd: string;
    address: string;
    vehicle: string;
    signature: string;
};