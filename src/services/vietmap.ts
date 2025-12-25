import axios from 'axios';
import { VIETMAP_API_KEY } from 'src/config-global';

// ----------------------------------------------------------------------

const VIETMAP_API_URL = 'https://maps.vietmap.vn/api';

export type VietmapAutocompleteResponse = {
    ref_id: string;
    address: string;
    name: string;
    display?: string;
};

export type VietmapPlaceDetailResponse = {
    lat: number;
    lng: number;
    address: string;
    name: string;
};

export const searchAddress = async (keyword: string): Promise<VietmapAutocompleteResponse[]> => {
    try {
        const response = await axios.get(`${VIETMAP_API_URL}/autocomplete/v3`, {
            params: {
                apikey: VIETMAP_API_KEY,
                text: keyword,
            },
        });
        return response.data || [];
    } catch (error) {
        console.error('Error searching address:', error);
        return [];
    }
};

export const getPlaceDetail = async (refId: string): Promise<VietmapPlaceDetailResponse | null> => {
    try {
        const response = await axios.get(`${VIETMAP_API_URL}/place/v3`, {
            params: {
                apikey: VIETMAP_API_KEY,
                refid: refId,
            },
        });
        return response.data || null;
    } catch (error) {
        console.error('Error getting place detail:', error);
        return null;
    }
};

export const getRoute = async (
    start: { lat: number; lng: number },
    end: { lat: number; lng: number }
): Promise<[number, number][]> => {
    try {
        const url = `${VIETMAP_API_URL}/route?api-version=1.1&apikey=${VIETMAP_API_KEY}&vehicle=car&point=${start.lat},${start.lng}&point=${end.lat},${end.lng}&points_encoded=false`;

        const response = await axios.get(url);

        if (response.data && response.data.paths && response.data.paths[0] && response.data.paths[0].points) {
            return response.data.paths[0].points.coordinates;
        }
        return [];
    } catch (error) {
        console.error('Error getting route:', error);
        return [];
    }
};
