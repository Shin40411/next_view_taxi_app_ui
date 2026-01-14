export interface ICompanyBankAccount {
    id: string;
    bankName: string;
    accountName: string;
    accountNo: string;
    content: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type ICreateCompanyBankAccountDto = Omit<ICompanyBankAccount, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>;

export type IUpdateCompanyBankAccountDto = Partial<ICreateCompanyBankAccountDto> & {
    isActive?: boolean;
};

export interface ICompanyBankAccountResponse {
    data: ICompanyBankAccount[];
    total: number;
}
