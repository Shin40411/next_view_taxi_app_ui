export interface FileItem {
    id: string;
    filename: string;
    originalFilename: string;
    path: string;
    type: 'IMAGE' | 'VIDEO' | 'FILE';
    size: number;
    createdAt: string;
    folderId: string | null;
    userId: number;
}