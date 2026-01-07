

export interface NotificationItemProps {
    notification: INotification;
    onDelete?: () => void;
};

export interface INotification {
    id: string;
    title: string;
    body: string;
    type: string;
    is_read: boolean;
    created_at: Date;
    avatarUrl?: string | null;
    data?: any;
    userId: string;
}