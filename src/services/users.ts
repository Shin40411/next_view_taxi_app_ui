import axiosInstance, { endpoints } from 'src/utils/axios';
import { IUserItem, IUserProfile } from 'src/types/user';

// ----------------------------------------------------------------------

export const getUsers = async () => {
    const response = await axiosInstance.get(endpoints.user.root);
    return response.data as IUserItem[];
};

export const getUser = async (id: string) => {
    const response = await axiosInstance.get(`${endpoints.user.root}/${id}`);
    return response.data as IUserProfile;
};

export const createUser = async (data: any) => {
    const response = await axiosInstance.post(endpoints.user.root, data);
    return response.data;
};

export const updateUser = async (id: string, data: any) => {
    const response = await axiosInstance.put(`${endpoints.user.root}/${id}`, data);
    return response.data;
};

export const deleteUser = async (id: string) => {
    const response = await axiosInstance.delete(`${endpoints.user.root}/${id}`);
    return response.data;
};
