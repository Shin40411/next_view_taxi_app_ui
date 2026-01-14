import { IUserAdmin } from './user';

export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';

export type TransactionStatus = 'PENDING' | 'FALSE' | 'SUCCESS';

export interface IWalletTransaction {
    id: string;
    sender: IUserAdmin;
    receiver: IUserAdmin | null;
    amount: number;
    type: TransactionType;
    bill: string | null;
    status: TransactionStatus;
    employee: IUserAdmin | null;
    created_at: Date;
    reason?: string;
}

export interface IWalletResponse {
    data: IWalletTransaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface IBank {
    id: number;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo: string;
    transferSupported: number;
    lookupSupported: number;
}

export interface IBankListResponse {
    code: string;
    desc: string;
    data: IBank[];
}
