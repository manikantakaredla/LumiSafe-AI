import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { policeProvider } from '@/services/policeProvider';

const createMarkerIcon = (color, size = 12) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

const ICONS = {
  police: createMarkerIcon('#eab308', 14), // Yellow Police
  complaint: createMarkerIcon('#ef4444', 10), // Red
  lightFailed: createMarkerIcon('#64748b', 8) // Gray Light
};

export function PoliceOperationsMap() {
  const [policeUnits, setPoliceUnits] = useState([]);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const pUnits = await policeProvider.getPoliceUnits();
        setPoliceUnits(pUnits);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMapData();
  }, []);

  return (
    <div className="h-full w-full bg-[#090e17] rounded-lg overflow-hidden border border-[#1e293b] relative">
      <MapContainer 
        center={[17.73, 83.32]} 
        zoom={14} 
        style={{ height: '100%', width: '100%', background: '#090e17' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Women Safety Risk Heatmap Layer (Simulated with CircleMarkers) */}
        <CircleMarker center={[17.72, 83.31]} radius={60} pathOptions={{ color: 'transparent', fillColor: '#ef4444', fillOpacity: 0.2 }} />
        <CircleMarker center={[17.72, 83.31]} radius={30} pathOptions={{ color: 'transparent', fillColor: '#ef4444', fillOpacity: 0.4 }} />
        
        {/* Patrol Coverage Heatmap Layer (Simulated) */}
        <CircleMarker center={[17.74, 83.34]} radius={80} pathOptions={{ color: 'transparent', fillColor: '#3b82f6', fillOpacity: 0.15 }} />

        {policeUnits.map(p => (
          <Marker 
            key={p.id} 
            position={[p.location[1], p.location[0]]}
            icon={ICONS.police}
          >
            <Popup className="dark-popup">{p.name} - {p.status}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
