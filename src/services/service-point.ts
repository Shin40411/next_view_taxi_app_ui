import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export const getServicePoints = async () => {
    const response = await axiosInstance.get(endpoints.servicePoint.root);
    return response.data;
};

export const getServicePoint = async (id: string) => {
    const response = await axiosInstance.get(`${endpoints.servicePoint.root}/${id}`);
    return response.data;
};

export const createServicePoint = async (data: any) => {
    const response = await axiosInstance.post(endpoints.servicePoint.root, data);
    return response.data;
};

export const updateServicePoint = async (id: string, data: any) => {
    const response = await axiosInstance.put(`${endpoints.servicePoint.root}/${id}`, data);
    return response.data;
};

export const deleteServicePoint = async (id: string) => {
    const response = await axiosInstance.delete(`${endpoints.servicePoint.root}/${id}`);
    return response.data;
};
