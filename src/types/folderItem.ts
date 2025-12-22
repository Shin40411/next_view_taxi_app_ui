export interface FolderItem {
    resources: {
        id: string;
        filename: string;
        originalFilename: string | null;
        path: string;
        type: 'IMAGE' | 'VIDEO' | 'FILE';
        size: number;
        createdAt: Date;
        folderId: string | null;
        userId: number;
    }[];
    id: string;
    createdAt: Date;
    name: string;
}