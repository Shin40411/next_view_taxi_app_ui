import * as constant from 'src/utils/constant';

export type Action =
    | { type: typeof constant.FETCH_STATS_BY_TYPE_SUCCESS; payload: any }
    | { type: typeof constant.FETCH_STATS_ERROR; payload: string }
    | { type: typeof constant.FETCH_STATS_LOADING }

    | { type: typeof constant.UPLOAD_FILES_LOADING }
    | { type: typeof constant.UPLOAD_FILES_SUCCESS }
    | { type: typeof constant.UPLOAD_FILES_ERROR; payload: string }

    | { type: typeof constant.FETCH_LIST_FILES_LOADING }
    | { type: typeof constant.FETCH_LIST_FILES_SUCCESS; payload: any[] }
    | { type: typeof constant.FETCH_LIST_FILES_ERROR; payload: string }

    | { type: typeof constant.DELETE_FILE_LOADING }
    | { type: typeof constant.DELETE_FILE_SUCCESS }
    | { type: typeof constant.DELETE_FILE_ERROR; payload: string }

    | { type: typeof constant.INSERT_FOLDER_LOADING }
    | { type: typeof constant.INSERT_FOLDER_SUCCESS }
    | { type: typeof constant.INSERT_FOLDER_ERROR; payload: string }

    | { type: typeof constant.UPDATE_FOLDER_LOADING }
    | { type: typeof constant.UPDATE_FOLDER_SUCCESS }
    | { type: typeof constant.UPDATE_FOLDER_ERROR; payload: string }

    | { type: typeof constant.FETCH_FOLDER_LOADING }
    | { type: typeof constant.FETCH_FOLDER_SUCCESS; payload: any[] }
    | { type: typeof constant.FETCH_FOLDER_ERROR; payload: string }

    | { type: typeof constant.DELETE_FOLDER_LOADING }
    | { type: typeof constant.DELETE_FOLDER_SUCCESS }
    | { type: typeof constant.DELETE_FOLDER_ERROR; payload: string }

    | { type: typeof constant.UPDATE_FILE_LOADING }
    | { type: typeof constant.UPDATE_FILE_SUCCESS }
    | { type: typeof constant.UPDATE_FILE_ERROR; payload: string }

    | { type: typeof constant.RESET_PASSWORD_LOADING }
    | { type: typeof constant.RESET_PASSWORD_SUCCESS; payload: any[] }
    | { type: typeof constant.RESET_PASSWORD_ERROR; payload: string };