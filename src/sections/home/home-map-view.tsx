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
import { SxProps, Theme } from '@mui/material/styles';

import { useAuthContext } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';
import { MAPBOX_API, VIETMAP_API_KEY, VIETMAP_TILE_KEY } from 'src/config-global';
import Iconify from 'src/components/iconify';
import { useResponsive } from 'src/hooks/use-responsive';
import ServiceDetailDialog from './service-detail-dialog';
import { getRoute } from 'src/services/vietmap';

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

type Props = {
    sx?: SxProps<Theme>;
    activePoint?: { lat: number; long: number } | null;
    points?: any[];
    userLocation?: { lat: number; long: number } | null;
    directionsTo?: { lat: number; long: number } | null;
};

export default function HomeMapView({ sx, activePoint, points: passedPoints, userLocation, directionsTo }: Props) {
    const router = useRouter();
    const { user } = useAuthContext();
    const mdUp = useResponsive('up', 'md');
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<vietmapgl.Map | null>(null);
    const markersRef = useRef<vietmapgl.Marker[]>([]);
    const userMarkerRef = useRef<vietmapgl.Marker | null>(null);

    const [points, setPoints] = useState(passedPoints || MOCK_SERVICE_POINTS);
    const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

    const routeLayerId = 'route-layer';
    const routeSourceId = 'route-source';

    useEffect(() => {
        if (passedPoints) {
            setPoints(passedPoints);
        }
    }, [passedPoints]);

    const selectedPoint = points.find(p => p.id === selectedPointId);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (!VIETMAP_TILE_KEY) {
            console.error('VIETMAP_TILE_KEY is missing!');
            return;
        }

        // Try setting the access token globally
        (vietmapgl as any).accessToken = VIETMAP_TILE_KEY;

        mapRef.current = new vietmapgl.Map({
            container: mapContainerRef.current,
            style: `https://maps.vietmap.vn/api/maps/light/styles.json?apikey=${VIETMAP_TILE_KEY}`,
            center: [105.854444, 21.028511],
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

    // Fly To Logic
    useEffect(() => {
        if (!mapRef.current) return;

        if (activePoint) {
            mapRef.current.flyTo({
                center: [activePoint.long, activePoint.lat],
                zoom: 15,
                essential: true
            });
        } else if (userLocation) {
            mapRef.current.flyTo({
                center: [userLocation.long, userLocation.lat],
                zoom: 15,
                essential: true
            });
        }
    }, [activePoint, userLocation]);

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

            // Marker
            const marker = new vietmapgl.Marker({ color: 'red' })
                .setLngLat([point.long, point.lat])
                .addTo(mapRef.current!);

            markersRef.current.push(marker);
        });
    }, [points]);

    // User Location Marker
    useEffect(() => {
        if (!mapRef.current) return;

        if (userLocation) {
            if (!userMarkerRef.current) {
                const el = document.createElement('div');
                el.className = 'user-marker';
                el.style.width = '20px';
                el.style.height = '20px';
                el.style.backgroundColor = '#1976d2'; // Blue
                el.style.borderRadius = '50%';
                el.style.border = '2px solid white';
                el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

                userMarkerRef.current = new vietmapgl.Marker({ element: el })
                    .setLngLat([userLocation.long, userLocation.lat])
                    .addTo(mapRef.current);
            } else {
                userMarkerRef.current.setLngLat([userLocation.long, userLocation.lat]);
            }
        } else if (userMarkerRef.current) {
            userMarkerRef.current.remove();
            userMarkerRef.current = null;
        }
    }, [userLocation]);

    // Routing
    useEffect(() => {
        const fetchRoute = async () => {
            if (!mapRef.current || !userLocation || !directionsTo) {
                // Cleanup route if exists
                if (mapRef.current?.getLayer(routeLayerId)) {
                    mapRef.current.removeLayer(routeLayerId);
                }
                if (mapRef.current?.getSource(routeSourceId)) {
                    mapRef.current.removeSource(routeSourceId);
                }
                return;
            }

            const coordinates = await getRoute(
                { lat: userLocation.lat, lng: userLocation.long },
                { lat: directionsTo.lat, lng: directionsTo.long }
            );

            if (coordinates.length > 0) {
                const geojson: any = {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates,
                    },
                };

                if (mapRef.current.getSource(routeSourceId)) {
                    (mapRef.current.getSource(routeSourceId) as any).setData(geojson);
                } else {
                    mapRef.current.addSource(routeSourceId, {
                        type: 'geojson',
                        data: geojson,
                    });

                    mapRef.current.addLayer({
                        id: routeLayerId,
                        type: 'line',
                        source: routeSourceId,
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round',
                        },
                        paint: {
                            'line-color': '#00AB55', // Primary or Success color
                            'line-width': 6,
                            'line-opacity': 0.8
                        },
                    });
                }

                // Fit bounds
                const bounds = new vietmapgl.LngLatBounds();
                coordinates.forEach((coord) => bounds.extend(coord as [number, number]));
                mapRef.current.fitBounds(bounds, { padding: 50 });
            }
        };

        fetchRoute();
    }, [userLocation, directionsTo]);

    // Popup logic
    useEffect(() => {
        const handleDetailClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('btn-detail')) {
                const id = target.getAttribute('data-id');
                if (id) {
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
                height: 'calc(100vh - 90px)',
                minHeight: 200,
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
