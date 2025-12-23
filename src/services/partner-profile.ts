import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export const getPartnerProfiles = async () => {
    const response = await axiosInstance.get(endpoints.partner.root);
    return response.data;
};

export const getPartnerProfile = async (id: string) => {
    const response = await axiosInstance.get(`${endpoints.partner.root}/${id}`);
    return response.data;
};

export const createPartnerProfile = async (data: any) => {
    const response = await axiosInstance.post(endpoints.partner.root, data);
    return response.data;
};

export const updatePartnerProfile = async (id: string, data: any) => {
    const response = await axiosInstance.put(`${endpoints.partner.root}/${id}`, data);
    return response.data;
};

export const deletePartnerProfile = async (id: string) => {
    const response = await axiosInstance.delete(`${endpoints.partner.root}/${id}`);
    return response.data;
};
