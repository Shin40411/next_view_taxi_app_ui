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

// ----------------------------------------------------------------------

// Mock Data for Service Points
const MOCK_SERVICE_POINTS = [
    {
        id: '1',
        name: 'Nhà hàng Biển Đông',
        address: '123 Đường ABC',
        lat: 21.028511,
        long: 105.854444,
        type: 'Restaurant',
    },
    {
        id: '2',
        name: 'Cafe Trung Nguyên',
        address: '456 Đường XYZ',
        lat: 21.029511,
        long: 105.850444,
        type: 'Cafe',
    },
    {
        id: '3',
        name: 'Khách sạn Metropole',
        address: '15 Ngô Quyền',
        lat: 21.025511,
        long: 105.858444,
        type: 'Hotel',
    },
];

type Props = {
    //
};

export default function HomeMapView({ }: Props) {
    const router = useRouter();
    const { user } = useAuthContext();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<vietmapgl.Map | null>(null);
    const markersRef = useRef<vietmapgl.Marker[]>([]);

    const [points, setPoints] = useState(MOCK_SERVICE_POINTS);

    const handleFlyTo = (point: typeof MOCK_SERVICE_POINTS[0]) => {
        mapRef.current?.flyTo({
            center: [point.long, point.lat],
            zoom: 15,
            essential: true
        });
    }

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
            const popup = new vietmapgl.Popup({ offset: 25 }).setHTML(
                `<div style="padding: 5px;">
           <h4 style="margin: 0;">${point.name}</h4>
           <p style="margin: 5px 0 0 0; color: gray;">${point.type}</p>
           <p style="margin: 0; font-size: 12px; color: gray;">${point.address}</p>
           <button class="btn-detail" data-id="${point.id}" style="
             margin-top: 8px;
             background-color: #00AB55;
             color: white;
             border: none;
             padding: 4px 8px;
             border-radius: 4px;
             cursor: pointer;
             font-size: 12px;
           ">Xem chi tiết</button>
         </div>`
            );

            // Marker
            const marker = new vietmapgl.Marker({ color: 'red' }) // Use default red marker for now
                .setLngLat([point.long, point.lat])
                .setPopup(popup)
                .addTo(mapRef.current!);

            markersRef.current.push(marker);
        });
    }, [points]);

    // Handle popup button click
    useEffect(() => {
        const handleDetailClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('btn-detail')) {
                const id = target.getAttribute('data-id');
                if (id) {
                    router.push(`/service/${id}`);
                }
            }
        };

        document.addEventListener('click', handleDetailClick);
        return () => {
            document.removeEventListener('click', handleDetailClick);
        };
    }, [router]);


    // (empty, removing duplicate handlers)

    return (
        <Box
            sx={{
                width: 1,
                height: 'calc(100vh - 80px)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Card
                sx={{
                    p: 2,
                    top: 20,
                    left: 20,
                    width: 320,
                    position: 'absolute',
                    zIndex: 9,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Typography variant="h6">Tìm kiếm dịch vụ</Typography>

                <Autocomplete
                    fullWidth
                    autoHighlight
                    options={MOCK_SERVICE_POINTS}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                            <Iconify icon="eva:pin-fill" sx={{ color: 'primary.main', mr: 1 }} />
                            {option.name}
                            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>
                                ({option.type})
                            </Typography>
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Nhập tên quán..."
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <>
                                        <InputAdornment position="start">
                                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                        </InputAdornment>
                                        {params.InputProps.startAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                    onChange={(event, newValue) => {
                        if (newValue) {
                            handleFlyTo(newValue);
                        }
                    }}
                />

                {/* Removed manual list Stack since Autocomplete handles selection */}

                {/* Debug Info */}
                {!VIETMAP_TILE_KEY && (
                    <Typography variant="caption" color="error" sx={{ mt: 2 }}>
                        Error: Missing VIETMAP_TILE_KEY in .env
                    </Typography>
                )}
            </Card>

            {/* Map Container */}
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

            {user?.role === 'PARTNER' && (
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="eva:arrow-back-fill" />}
                    onClick={() => router.push(paths.dashboard.driver.root)}
                    sx={{
                        position: 'absolute', // Absolute to the View Box
                        top: 20,
                        left: 360, // Right next to the Search Card (width 320 + left 20 + gap 20)
                        zIndex: 9,
                        boxShadow: 3,
                    }}
                >
                    Quay lại
                </Button>
            )}
        </Box>
    );
}
