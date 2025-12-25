'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define the marker icon
const customMarkerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Dynamically import the map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

export default function MapPreview({ latitude, longitude, locationName }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full rounded-lg overflow-hidden shadow-md flex items-center justify-center bg-gray-200" style={{ height: '400px' }}>
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  if (!latitude || !longitude) {
    return (
      <div className="w-full rounded-lg overflow-hidden shadow-md flex items-center justify-center bg-gray-200" style={{ height: '400px' }}>
        <p className="text-gray-600">Enter a valid location to preview the map</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-md border border-gray-300" style={{ height: '400px' }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {latitude && longitude && (
          <Marker position={[latitude, longitude]} icon={customMarkerIcon}>
            <Popup>{locationName || 'Your Location'}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
