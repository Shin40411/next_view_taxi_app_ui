
export type ISupportTicket = {
    id: string;
    subject: string;
    content: string;
    admin_reply: string | null;
    status: 'PENDING' | 'RESOLVED' | 'CLOSED';
    created_at: Date;
    updated_at: Date;
    user: {
        id: string;
        full_name: string;
        avatar: string | null;
    };
};

export type ICreateTicketRequest = {
    subject: string;
    content: string;
};

export type IReplyTicketRequest = {
    content: string;
};

export type IFaq = {
    id: string;
    question: string;
    answer: string;
    created_at: Date;
    updated_at: Date;
};

export type ICreateFaqRequest = {
    question: string;
    answer: string;
};

export type IUpdateFaqRequest = {
    question?: string;
    answer?: string;
};