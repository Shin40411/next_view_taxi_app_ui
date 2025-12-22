import { MainState } from "./mainstate";

export const initialState: MainState = {
    stats: null,
    filteredStats: null,
    loading: false,
    error: null,
    fetchStatsByType: () => { },
    uploadFiles: async () => { },
    fetchListFiles: [],
    fetchFiles: async () => { },
    fetchFilesByFolder: async () => { },
    deleteFile: async () => { },
    insertFolder: async () => { },
    updateFolder: async () => { },
    fetchFolders: async () => { },
    fetchListFolders: [],
    updateFile: async () => { },
    deleteFolder: async () => { },
    resetPassword: async () => { },
};