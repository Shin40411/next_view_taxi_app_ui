import '@vietmap/vietmap-gl-js/dist/vietmap-gl.css';
import { useMemo, useState, useCallback } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import vietmapGl from '@vietmap/vietmap-gl-js/dist/vietmap-gl.js';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { VIETMAP_API_KEY } from 'src/config-global';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    sx?: any;
};

export default function StoreMap({ sx }: Props) {
    const theme = useTheme();

    // Default location (Hanoi)
    const defaultViewState = {
        latitude: 21.0285,
        longitude: 105.8542,
        zoom: 14,
    };

    const [viewState, setViewState] = useState(defaultViewState);
    const [markerPosition, setMarkerPosition] = useState({
        latitude: 21.0285,
        longitude: 105.8542,
    });

    const [mapError, setMapError] = useState(false);

    const onDragEnd = useCallback((event: any) => {
        setMarkerPosition({
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
        });
    }, []);

    const handleError = useCallback(() => {
        console.error("Vietmap failed to load.");
        setMapError(true);
    }, []);

    // Google Maps Fallback (Embed Iframe)
    // Using a generic search query for the default location or the current marker
    const googleMapsUrl = useMemo(() => `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096472449553!2d${markerPosition.longitude}!3d${markerPosition.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAxJzQyLjYiTiAxMDXCsDUxJzE1LjEiRQ!5e0!3m2!1sen!2s!4v1636531234567!5m2!1sen!2s`, [markerPosition]);

    if (mapError || !VIETMAP_API_KEY) {
        return (
            <Box
                sx={{
                    width: '100%',
                    height: 200,
                    borderRadius: 1,
                    bgcolor: 'grey.200',
                    position: 'relative',
                    overflow: 'hidden',
                    ...sx,
                }}
            >
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6322898717906!2d105.7989953147631!3d21.007372986010077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aca1d6c382db%3A0x6758654855a9073e!2sDuy%20Tan%2C%20Cau%20Giay%2C%20Hanoi!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
                {/* <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        p: 0.5,
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        color: 'text.secondary'
                    }}
                >
                    Vietmap error, showing Google Maps fallback
                </Box> */}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: '100%',
                height: 200,
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative',
                border: `1px solid ${theme.palette.divider}`,
                ...sx,
            }}
        >
            <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                mapLib={vietmapGl as any}
                style={{ width: '100%', height: '100%' }}
                mapStyle={`https://maps.vietmap.vn/api/maps/light/styles.json?apikey=${VIETMAP_API_KEY}`}
                onError={handleError}
            >
                <NavigationControl position="top-right" />
                <Marker
                    longitude={markerPosition.longitude}
                    latitude={markerPosition.latitude}
                    draggable
                    onDragEnd={onDragEnd}
                >
                    <Iconify icon="eva:pin-fill" width={32} sx={{ color: 'error.main', transform: 'translate(-50%, -100%)' }} />
                </Marker>
            </Map>

            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block', width: '100%', textAlign: 'center', position: 'absolute', bottom: 10, zIndex: 1, bgcolor: 'rgba(255,255,255,0.7)', py: 0.5 }}>
                Kéo thả để ghim vị trí chính xác
            </Typography>
        </Box>
    );
}
