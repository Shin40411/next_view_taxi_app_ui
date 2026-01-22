import { useRef, useState, useEffect } from 'react';
import '@vietmap/vietmap-gl-js/dist/vietmap-gl.css';
import vietmapgl from '@vietmap/vietmap-gl-js/dist/vietmap-gl.js';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { VIETMAP_TILE_KEY } from 'src/config-global';
import { AdminLiveDriver, getLiveMapDrivers } from 'src/services/admin';

// ----------------------------------------------------------------------

export default function AdminLiveMapView() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<vietmapgl.Map | null>(null);
    const markersRef = useRef<vietmapgl.Marker[]>([]);

    const [drivers, setDrivers] = useState<AdminLiveDriver[]>([]);

    useEffect(() => {
        const fetchDrivers = async () => {
            const data = await getLiveMapDrivers();
            setDrivers(data);
        };
        fetchDrivers();
        // Poll every 10s
        const interval = setInterval(fetchDrivers, 10000);
        return () => clearInterval(interval);
    }, []);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (!VIETMAP_TILE_KEY) {
            console.error('VIETMAP_TILE_KEY is missing!');
            return;
        }

        (vietmapgl as any).accessToken = VIETMAP_TILE_KEY;

        mapRef.current = new vietmapgl.Map({
            container: mapContainerRef.current,
            style: `https://maps.vietmap.vn/api/maps/light/styles.json?apikey=${VIETMAP_TILE_KEY}`,
            center: [105.854444, 21.028511], // Hanoi
            zoom: 12,
            pitch: 0,
            bearing: 0,
        });

        mapRef.current.addControl(new vietmapgl.NavigationControl(), 'top-right');

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

        drivers.forEach((driver) => {
            // Marker Element
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.width = '40px';
            el.style.height = '40px';
            el.style.cursor = 'pointer';

            el.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                    <path fill="#0c0b08ff" d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
            `;

            // Popup
            const popup = new vietmapgl.Popup({ offset: 25 }).setHTML(
                `<div style="padding: 5px;">
                   <h5 style="margin: 0;">${driver.name}</h5>
                   <p style="margin: 2px 0;">${driver.vehiclePlate}</p>
                   <span style="color: ${driver.status === 'online' ? 'green' : 'orange'}">● ${driver.status.toUpperCase()}</span>
                 </div>`
            );

            // Marker
            const marker = new vietmapgl.Marker({ element: el })
                .setLngLat([driver.lng, driver.lat])
                .setPopup(popup)
                .addTo(mapRef.current!);

            markersRef.current.push(marker);
        });
    }, [drivers]);

    return (
        <Box sx={{ height: 600, position: 'relative', borderRadius: 2, overflow: 'hidden', boxShadow: (theme) => theme.shadows[10] }}>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

            <Card sx={{ position: 'absolute', top: 20, left: 20, p: 2, zIndex: 9 }}>
                <Typography variant="h6">Bản đồ trực tuyến</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                    Đang trực tuyến: {drivers.filter(d => d.status === 'online').length} tài xế
                </Typography>
            </Card>
        </Box>
    );
}
