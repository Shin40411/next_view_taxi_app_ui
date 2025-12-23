import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export const getTrips = async () => {
    const response = await axiosInstance.get(endpoints.trips.root);
    return response.data;
};

export const getTrip = async (id: string) => {
    const response = await axiosInstance.get(`${endpoints.trips.root}/${id}`);
    return response.data;
};

export const createTrip = async (data: any) => {
    const response = await axiosInstance.post(endpoints.trips.root, data);
    return response.data;
};

export const updateTrip = async (id: string, data: any) => {
    const response = await axiosInstance.put(`${endpoints.trips.root}/${id}`, data);
    return response.data;
};

export const deleteTrip = async (id: string) => {
    const response = await axiosInstance.delete(`${endpoints.trips.root}/${id}`);
    return response.data;
};
