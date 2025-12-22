import { FileItem } from "./fileItem";
import { FolderItem } from "./folderItem";

export interface MainState {
    stats: any;
    filteredStats: any;
    loading: boolean;
    error: string | null;
    fetchStatsByType: (type: string) => void;
    uploadFiles: (files: File[], userData: {}, folderId?: string) => Promise<void>;
    fetchListFiles: FileItem[];
    fetchFiles: () => Promise<void>;
    fetchFilesByFolder: (folderId: string) => Promise<void>;
    deleteFile: (fileId: string) => Promise<void>;
    insertFolder: (folderName: string, userData: { id?: number }) => Promise<void>;
    updateFolder: (data: { idFolder: string, newName: string }) => Promise<void>;
    fetchFolders: () => Promise<void>;
    fetchListFolders: FolderItem[];
    updateFile: (fileId: string, data: {}) => Promise<void>;
    deleteFolder: (folderId: string) => Promise<void>;
    resetPassword: (userId: string, oldPassword: string, newPassword: string) => Promise<void>;
}