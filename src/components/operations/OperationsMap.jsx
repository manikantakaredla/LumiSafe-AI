import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useOperationsStore } from '@/store/useOperationsStore';

const createMarkerIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 6px rgba(0,0,0,0.2);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const ICONS = {
  complaint: createMarkerIcon('#B91C1C'), // Destructive (Red)
  team: createMarkerIcon('#1D4ED8'), // Info (Blue)
  police: createMarkerIcon('#C2410C'), // Warning/Police (Amber)
  failedLight: createMarkerIcon('#64748B'), // Slate
  riskPoi: createMarkerIcon('#9333EA') // Purple for AI Risk
};

export function OperationsMap() {
  const { layers, selectedEntity, setSelectedEntity } = useOperationsStore();
  
  // Highly realistic mock data based on user PRD
  const complaints = [
    { id: 'CMP-8821', lat: 17.725, lng: 83.315, title: 'Pole Damaged - Beach Road', status: 'Pending' },
    { id: 'CMP-8822', lat: 17.721, lng: 83.311, title: 'Suspicious Activity - MVP Colony', status: 'Assigned' }
  ];

  const teams = [
    { id: 'Team Alpha', lat: 17.724, lng: 83.314, status: 'Repairing', task: 'Beach Road', eta: '18 mins' },
    { id: 'Team Beta', lat: 17.740, lng: 83.330, status: 'En Route', task: 'Ward 4', eta: '32 mins' }
  ];

  const policeUnits = [
    { id: 'Patrol P3', lat: 17.726, lng: 83.318, status: 'Patrolling', ward: 'Ward 18', coverage: '82%' },
    { id: 'Patrol P1', lat: 17.735, lng: 83.325, status: 'Stationary', ward: 'Ward 4', coverage: '45%' }
  ];

  const failedLights = [
    { id: 'L-101', lat: 17.723, lng: 83.312 },
    { id: 'L-102', lat: 17.7235, lng: 83.3125 },
    { id: 'L-103', lat: 17.724, lng: 83.313 },
  ];

  const riskPois = [
    { id: 'POI-1', lat: 17.722, lng: 83.313, type: "Women's College", riskScore: 92, status: 'Critical Risk Zone' },
    { id: 'POI-2', lat: 17.7255, lng: 83.316, type: "Major Bus Stop", riskScore: 85, status: 'High Risk Zone' },
    { id: 'POI-3', lat: 17.720, lng: 83.310, type: "Heavy Footfall", riskScore: 78, status: 'Elevated Risk Zone' }
  ];



  const getOpacity = (entityType, entityId) => {
    if (!selectedEntity) return 1;
    if (selectedEntity.type === entityType && selectedEntity.id === entityId) return 1;
    return 0.3;
  };

  return (
    <div className="h-full w-full bg-base rounded-xl overflow-hidden relative">
      <MapContainer 
        center={[17.725, 83.315]} 
        zoom={15} 
        style={{ height: '100%', width: '100%', background: 'var(--color-base)' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />



        {layers.complaints && complaints.map(c => (
          <Marker 
            key={c.id} 
            position={[c.lat, c.lng]} 
            icon={ICONS.complaint}
            opacity={getOpacity('COMPLAINT', c.id)}
            eventHandlers={{ click: () => setSelectedEntity({ type: 'COMPLAINT', id: c.id }) }}
          >
            <Popup>
              <div className="font-sans">
                <strong className="block text-destructive">{c.id}</strong>
                <span>{c.title}</span><br/>
                <span className="text-xs text-muted-foreground">Status: {c.status}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {layers.repairTeams && teams.map(t => (
          <Marker 
            key={t.id} 
            position={[t.lat, t.lng]} 
            icon={ICONS.team}
            opacity={getOpacity('TEAM', t.id)}
            eventHandlers={{ click: () => setSelectedEntity({ type: 'TEAM', id: t.id }) }}
          >
            <Popup>
              <div className="font-sans">
                <strong className="block text-primary">{t.id}</strong>
                <span className="text-xs">Road: {t.task}</span><br/>
                <span className="text-xs">Status: {t.status}</span><br/>
                <span className="text-xs font-bold">ETA: {t.eta}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {layers.police && policeUnits.map(p => (
          <Marker 
            key={p.id} 
            position={[p.lat, p.lng]} 
            icon={ICONS.police}
            opacity={getOpacity('POLICE', p.id)}
            eventHandlers={{ click: () => setSelectedEntity({ type: 'POLICE', id: p.id }) }}
          >
            <Popup>
               <div className="font-sans">
                <strong className="block text-warning">{p.id}</strong>
                <span className="text-xs">{p.ward}</span><br/>
                <span className="text-xs">Status: {p.status}</span><br/>
                <span className="text-xs font-bold text-success">Coverage: {p.coverage}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {failedLights.map(l => (
          <Marker 
            key={l.id} 
            position={[l.lat, l.lng]} 
            icon={ICONS.failedLight}
          >
            <Popup>Failed Street Light</Popup>
          </Marker>
        ))}

        {riskPois.map(poi => (
          <Marker 
            key={poi.id} 
            position={[poi.lat, poi.lng]} 
            icon={ICONS.riskPoi}
            opacity={getOpacity('POI', poi.id)}
            eventHandlers={{ click: () => setSelectedEntity({ type: 'POI', id: poi.id }) }}
          >
            <Popup>
               <div className="font-sans">
                <strong className="block text-[#9333EA] uppercase text-[10px] tracking-wider mb-1">AI Risk Correlation Point</strong>
                <span className="font-bold text-foreground text-sm">{poi.type}</span><br/>
                <span className="text-xs text-muted-foreground">{poi.status}</span><br/>
                <div className="mt-2 bg-[#9333EA]/10 border border-[#9333EA]/30 p-1 rounded text-center">
                   <span className="text-xs font-black text-[#9333EA]">Darkness Risk Score: {poi.riskScore}/100</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {selectedEntity && (
        <button 
          className="absolute top-4 right-4 z-[400] bg-surface text-foreground font-bold text-xs px-3 py-1.5 rounded shadow-md border border-border transition-colors hover:bg-secondary"
          onClick={() => setSelectedEntity(null)}
        >
          Clear Selection
        </button>
      )}
    </div>
  );
}
