import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'src/routes/hooks';
import vietmapgl from '@vietmap/vietmap-gl-js/dist/vietmap-gl.js';
import '@vietmap/vietmap-gl-js/dist/vietmap-gl.css';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import Button from '@mui/material/Button';
import { useAuthContext } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';
import { MAPBOX_API, VIETMAP_API_KEY, VIETMAP_TILE_KEY } from 'src/config-global';
import Iconify from 'src/components/iconify';
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

// Mock Data for Service Points
export const MOCK_SERVICE_POINTS = [
    {
        id: '1',
        name: 'Nhà hàng Biển Đông',
        address: '123 Đường ABC, Hoàn Kiếm, Hà Nội',
        lat: 21.028511,
        long: 105.854444,
        type: 'Restaurant',
        description: 'Nhà hàng hải sản tươi sống với không gian sang trọng.',
        coverUrl: 'https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_1.jpg',
        point: 100,
    },
    {
        id: '2',
        name: 'Cafe Trung Nguyên',
        address: '456 Đường XYZ, Đống Đa, Hà Nội',
        lat: 21.029511,
        long: 105.850444,
        type: 'Cafe',
        description: 'Không gian cafe yên tĩnh, thích hợp làm việc.',
        coverUrl: 'https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_2.jpg',
        point: 50,
    },
    {
        id: '3',
        name: 'Khách sạn Metropole',
        address: '15 Ngô Quyền, Hoàn Kiếm, Hà Nội',
        lat: 21.025511,
        long: 105.858444,
        type: 'Hotel',
        description: 'Khách sạn 5 sao đẳng cấp quốc tế.',
        coverUrl: 'https://api-prod-minimal-v510.vercel.app/assets/images/cover/cover_3.jpg',
        point: 200,
    },
];

import { SxProps, Theme } from '@mui/material/styles';

type Props = {
    sx?: SxProps<Theme>;
    activePoint?: { lat: number; long: number } | null;
};

import ServiceDetailDialog from './service-detail-dialog';

export default function HomeMapView({ sx, activePoint }: Props) {
    const router = useRouter();
    const { user } = useAuthContext();
    const mdUp = useResponsive('up', 'md');
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<vietmapgl.Map | null>(null);
    const markersRef = useRef<vietmapgl.Marker[]>([]);

    // Use passed points or default (currently duplicate, but good for future ext)
    const [points, setPoints] = useState(MOCK_SERVICE_POINTS);
    const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

    const selectedPoint = points.find(p => p.id === selectedPointId);

    // Fly to active point when it changes
    useEffect(() => {
        if (activePoint && mapRef.current) {
            mapRef.current.flyTo({
                center: [activePoint.long, activePoint.lat],
                zoom: 15,
                essential: true
            });
        }
    }, [activePoint]);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        // console.log('Initializing Vietmap with TILE_KEY:', VIETMAP_TILE_KEY);

        if (!VIETMAP_TILE_KEY) {
            console.error('VIETMAP_TILE_KEY is missing! Make sure it is in your .env and you restarted the server.');
            return;
        }

        if (!VIETMAP_TILE_KEY) {
            console.error('VIETMAP_TILE_KEY is missing!');
            return;
        }

        // Try setting the access token globally
        (vietmapgl as any).accessToken = VIETMAP_TILE_KEY;

        // Debug
        // console.log('Using Style URL:', `https://maps.vietmap.vn/api/maps/light/styles.json?apikey=${VIETMAP_TILE_KEY}`);

        mapRef.current = new vietmapgl.Map({
            container: mapContainerRef.current,
            style: `https://maps.vietmap.vn/api/maps/light/styles.json?apikey=${VIETMAP_TILE_KEY}`,
            center: [105.854444, 21.028511], // Hanoi
            zoom: 13,
            pitch: 0,
            bearing: 0,
        });

        mapRef.current.addControl(new vietmapgl.NavigationControl(), 'top-right');
        mapRef.current.addControl(
            new vietmapgl.GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
                trackUserLocation: true,
            }),
            'top-right'
        );

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    // Update Markers
    useEffect(() => {
        if (!mapRef.current) return;

        // Clear existing markers
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        points.forEach((point) => {
            // Create a DOM element for each marker.
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = 'url(/assets/icons/map/ic_marker.svg)'; // You might need a marker icon
            el.style.width = '30px';
            el.style.height = '30px';
            el.style.backgroundSize = '100%';
            el.style.cursor = 'pointer';

            // Fallback if no icon
            if (!el.style.backgroundImage) {
                el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>';
            }

            // Popup
            //     const popup = new vietmapgl.Popup({ offset: 25 }).setHTML(
            //         `<div style="padding: 5px;">
            //    <h4 style="margin: 0;">${point.name}</h4>
            //    <p style="margin: 5px 0 0 0; color: gray;">${point.type}</p>
            //    <p style="margin: 0; font-size: 12px; color: gray;">${point.address}</p>
            //    <button class="btn-detail" data-id="${point.id}" style="
            //      margin-top: 8px;
            //      background-color: #00AB55;
            //      color: white;
            //      border: none;
            //      padding: 4px 8px;
            //      border-radius: 4px;
            //      cursor: pointer;
            //      font-size: 12px;
            //    ">Xem chi tiết</button>
            //  </div>`
            //     );

            // Marker
            const marker = new vietmapgl.Marker({ color: 'red' })
                .setLngLat([point.long, point.lat])
                // .setPopup(popup)
                .addTo(mapRef.current!);

            markersRef.current.push(marker);
        });
    }, [points]);

    useEffect(() => {
        const handleDetailClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('btn-detail')) {
                const id = target.getAttribute('data-id');
                if (id) {
                    // router.push(`/service/${id}`);
                    setSelectedPointId(id);
                }
            }
        };

        document.addEventListener('click', handleDetailClick);
        return () => {
            document.removeEventListener('click', handleDetailClick);
        };
    }, [router]);


    return (
        <Box
            sx={{
                width: 1,
                height: 'calc(100vh - 80px)',
                position: 'relative',
                overflow: 'hidden',
                ...sx,
            }}
        >
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

            {selectedPoint && (
                <ServiceDetailDialog
                    open={!!selectedPoint}
                    onClose={() => setSelectedPointId(null)}
                    service={selectedPoint}
                />
            )}
        </Box>
    );
}
