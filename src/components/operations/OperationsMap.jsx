import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useOperationsStore } from '@/store/useOperationsStore';
import { ShieldAlert, CheckCircle2, MapPin, Layers, Navigation, X, Loader2 } from 'lucide-react';

const createMarkerIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const ICONS = {
  complaint: createMarkerIcon('#B91C1C'), // Destructive (Red)
  team: createMarkerIcon('#1D4ED8'), // Info (Blue)
  police: createMarkerIcon('#C2410C'), // Warning/Police (Amber)
  failedLight: createMarkerIcon('#64748B'), // Slate
  riskPoi: createMarkerIcon('#9333EA'), // Purple for AI Risk
  clickedPoi: createMarkerIcon('#10B981') // Green for GIS Inspection
};

// Component to catch general map click events for Point-in-Polygon GIS spatial inspection
function MapClickListener({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export function OperationsMap() {
  const { layers, selectedEntity, setSelectedEntity } = useOperationsStore();
  
  const [complaints, setComplaints] = useState([]);
  const [teams, setTeams] = useState([]);
  const [policeUnits, setPoliceUnits] = useState([]);
  const [failedLights, setFailedLights] = useState([]);
  const [riskPois, setRiskPois] = useState([]);
  const [wards, setWards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Point-in-Polygon GIS Inspector state
  const [gisInspector, setGisInspector] = useState({ loading: false, data: null, coords: null, error: null });
  const [showPolygons, setShowPolygons] = useState(true);

  // Fetch real-time data from backend API running on Port 5000
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        // 0. Fetch Wards GIS boundary Polygons
        const wardsRes = await fetch('http://localhost:5000/api/v1/gis/wards');
        if (wardsRes.ok) {
          const wData = await wardsRes.json();
          const parsedWards = (wData.data || []).map(w => {
            // Convert GeoJSON [lng, lat] arrays to Leaflet [lat, lng] format
            const coords = (w.boundary?.coordinates?.[0] || []).map(coord => [coord[1], coord[0]]);
            return {
              id: w._id || w.name,
              name: w.name,
              zone: w.zone,
              safetyIndex: w.safetyIndex,
              positions: coords
            };
          }).filter(w => w.positions.length > 0);
          setWards(parsedWards);
        }

        // 1. Fetch Complaints
        const compRes = await fetch('http://localhost:5000/api/v1/complaints');
        if (compRes.ok) {
          const compData = await compRes.json();
          const parsedComplaints = (compData.data || []).map(c => ({
            id: c.complaintId || c._id,
            lat: c.location?.coordinates?.[1] || 17.725,
            lng: c.location?.coordinates?.[0] || 83.315,
            title: c.category || 'Citizen Alert',
            status: c.status || 'Reported',
            description: c.description
          }));
          setComplaints(parsedComplaints);
        }

        // 2. Fetch Repair Teams
        const teamRes = await fetch('http://localhost:5000/api/v1/workorders/teams');
        if (teamRes.ok) {
          const teamData = await teamRes.json();
          const parsedTeams = (teamData.data || []).map(t => ({
            id: t.name || 'Electrical Squad',
            lat: t.currentLocation?.coordinates?.[1] || 17.740,
            lng: t.currentLocation?.coordinates?.[0] || 83.330,
            status: t.status || 'AVAILABLE',
            task: t.inventory?.[0] || 'Equipment Kit',
            eta: '15 mins'
          }));
          setTeams(parsedTeams);
        }

        // 3. Fetch Police Patrol Units
        const polRes = await fetch('http://localhost:5000/api/v1/police/units');
        if (polRes.ok) {
          const polData = await polRes.json();
          const parsedPolice = (polData.data || []).map(p => ({
            id: p.name || p.unitId,
            lat: p.location?.coordinates?.[1] || 17.728,
            lng: p.location?.coordinates?.[0] || 83.315,
            status: p.status || 'PATROLLING',
            ward: p.zone || 'East Zone',
            coverage: '94%'
          }));
          setPoliceUnits(parsedPolice);
        }

        // 4. Fetch IoT Streetlight Failures
        const iotRes = await fetch('http://localhost:5000/api/v1/iot/failures');
        if (iotRes.ok) {
          const iotData = await iotRes.json();
          const parsedLights = (iotData.data || []).map(l => ({
            id: l.poleId,
            lat: l.coordinates?.[1] || 17.724,
            lng: l.coordinates?.[0] || 83.314,
            reason: l.failureReason,
            road: l.roadName,
            power: l.powerConsumption,
            status: l.status
          }));
          setFailedLights(parsedLights);
        }

        // 5. Fetch AI Darkness Risk Assessment
        const riskRes = await fetch('http://localhost:5000/api/v1/police/darkness-risk');
        if (riskRes.ok) {
          const riskData = await riskRes.json();
          const parsedRisk = (riskData.data || []).filter(r => r.darknessRiskIndex >= 60).map(r => ({
            id: r.assetId,
            lat: (r.coordinates?.[1] || 17.722) + 0.0003,
            lng: (r.coordinates?.[0] || 83.313) + 0.0003,
            type: r.sensitivityCategory.replace(/_/g, ' '),
            riskScore: r.darknessRiskIndex,
            status: `${r.riskLevel} RISK ZONE`,
            road: r.roadName,
            action: r.recommendedIntervencion
          }));
          setRiskPois(parsedRisk);
        }

      } catch (err) {
        console.error('[OperationsMap] Error fetching real-time data from server:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSpatialLookup = async (lat, lng) => {
    setGisInspector({ loading: true, data: null, coords: [lat, lng], error: null });
    try {
      const res = await fetch('http://localhost:5000/api/v1/gis/spatial-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGisInspector({ loading: false, data: data.data, coords: [lat, lng], error: null });
      } else {
        throw new Error(data.message || 'Spatial lookup failed');
      }
    } catch (err) {
      console.error('[GIS Lookup Error]', err);
      setGisInspector({ loading: false, data: null, coords: [lat, lng], error: err.message || 'Error querying GIS server' });
    }
  };

  const getOpacity = (entityType, entityId) => {
    if (!selectedEntity) return 1;
    if (selectedEntity.type === entityType && selectedEntity.id === entityId) return 1;
    return 0.35;
  };

  return (
    <div className="h-full w-full bg-base rounded-xl overflow-hidden relative font-sans">
      {isLoading && (
        <div className="absolute inset-0 bg-base/80 z-[500] flex items-center justify-center text-sm font-bold text-primary animate-pulse">
          Syncing LIVE Visakhapatnam Wards & GIS Telemetry...
        </div>
      )}

      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 z-[400] flex gap-2">
        <button 
          onClick={() => setShowPolygons(!showPolygons)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 shadow-sm transition-all ${showPolygons ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface text-foreground border-border hover:bg-secondary'}`}
        >
          <Layers size={14} />
          <span>{showPolygons ? 'Ward GIS Polygons Active' : 'Show Ward Boundaries'}</span>
        </button>
        {selectedEntity && (
          <button 
            className="bg-surface text-foreground font-bold text-xs px-3 py-1.5 rounded-lg shadow-md border border-border transition-colors hover:bg-secondary flex items-center gap-1"
            onClick={() => setSelectedEntity(null)}
          >
            <X size={14} />
            <span>Clear Selection</span>
          </button>
        )}
      </div>

      {/* Point-in-Polygon GIS Intelligence Overlay Box */}
      {gisInspector.coords && (
        <div className="absolute top-3 right-3 z-[400] w-80 bg-surface border border-border rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-border pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Navigation size={16} className="text-primary" />
              <span className="font-extrabold text-xs uppercase tracking-wider text-foreground">GIS Point-in-Polygon Lookup</span>
            </div>
            <button onClick={() => setGisInspector({ loading: false, data: null, coords: null, error: null })} className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          </div>

          {gisInspector.loading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs font-bold text-muted-foreground">
              <Loader2 size={24} className="animate-spin text-primary" />
              <span>Executing $geoIntersects spatial query...</span>
            </div>
          ) : gisInspector.data ? (
            <div className="space-y-3">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold text-primary uppercase">WARD BOUNDARY LAYER</span>
                  <span className="text-[10px] font-mono font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                    Score: {gisInspector.data.ward?.safetyIndex || 85}
                  </span>
                </div>
                <p className="text-xs font-black text-foreground mt-1">{gisInspector.data.ward?.name || 'Outside Municipal Wards'}</p>
                <p className="text-[10px] font-medium text-muted-foreground mt-0.5">{gisInspector.data.ward?.matchMethod}</p>
              </div>

              <div className="bg-base border border-border rounded-lg p-2.5 space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">NEAREST ROAD & ASSET ($nearSphere)</span>
                  <p className="text-xs font-extrabold text-foreground mt-0.5">
                    Pole {gisInspector.data.roadNetwork?.poleId} • <span className="text-primary font-bold">{gisInspector.data.roadNetwork?.distanceMeters}m away</span>
                  </p>
                  <p className="text-[11px] font-medium text-muted-foreground truncate">{gisInspector.data.roadNetwork?.roadName}</p>
                </div>
              </div>

              <div className="bg-base border border-border rounded-lg p-2.5 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">ASSIGNED REPAIR SQUAD</span>
                  <p className="text-xs font-extrabold text-foreground">{gisInspector.data.dispatchUnits?.repairCrew?.teamName || 'General Crew'}</p>
                </div>
                <span className="px-2 py-1 bg-success/10 text-success border border-success/20 text-[10px] font-bold rounded">
                  {gisInspector.data.dispatchUnits?.repairCrew?.estimatedResponseMins || 10} min ETA
                </span>
              </div>

              <p className="text-[10px] text-center font-mono text-muted-foreground pt-1">
                GPS: [{gisInspector.coords[0].toFixed(4)}, {gisInspector.coords[1].toFixed(4)}]
              </p>
            </div>
          ) : (
            <p className="text-xs text-destructive font-semibold py-4 text-center">{gisInspector.error || 'No GIS metadata available'}</p>
          )}
        </div>
      )}

      <MapContainer 
        center={[17.725, 83.315]} 
        zoom={14} 
        style={{ height: '100%', width: '100%', background: 'var(--color-base)' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> & GVMC GIS'
        />

        <MapClickListener onMapClick={handleSpatialLookup} />

        {/* Render Ward Boundary Polygons */}
        {showPolygons && wards.map(w => (
          <Polygon
            key={w.id}
            positions={w.positions}
            pathOptions={{
              color: w.safetyIndex < 70 ? '#DC2626' : w.safetyIndex < 80 ? '#D97706' : '#2563EB',
              weight: 2,
              fillOpacity: 0.1,
              dashArray: '4'
            }}
          >
            <Tooltip sticky>
              <div className="font-sans">
                <strong className="font-extrabold text-xs block">{w.name}</strong>
                <span className="text-[11px] text-gray-600 block">{w.zone}</span>
                <span className={`text-[10px] font-bold ${w.safetyIndex < 70 ? 'text-red-600' : 'text-blue-600'}`}>
                  Safety Index: {w.safetyIndex} / 100
                </span>
              </div>
            </Tooltip>
          </Polygon>
        ))}

        {/* Click inspection indicator marker */}
        {gisInspector.coords && (
          <Marker position={gisInspector.coords} icon={ICONS.clickedPoi}>
            <Popup><span className="font-bold text-xs">Inspected GPS Target</span></Popup>
          </Marker>
        )}

        {layers.complaints && complaints.map(c => (
          <Marker 
            key={c.id} 
            position={[c.lat, c.lng]} 
            icon={ICONS.complaint}
            opacity={getOpacity('COMPLAINT', c.id)}
            eventHandlers={{ click: (e) => { L.DomEvent.stopPropagation(e); setSelectedEntity({ type: 'COMPLAINT', id: c.id }); } }}
          >
            <Popup>
              <div className="font-sans min-w-[200px]">
                <strong className="block text-destructive font-mono">{c.id}</strong>
                <span className="font-bold text-sm text-foreground">{c.title}</span>
                <p className="text-xs text-muted-foreground mt-1 mb-1 line-clamp-3">{c.description}</p>
                <span className="inline-block bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-0.5 rounded">
                  Status: {c.status}
                </span>
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
            eventHandlers={{ click: (e) => { L.DomEvent.stopPropagation(e); setSelectedEntity({ type: 'TEAM', id: t.id }); } }}
          >
            <Popup>
              <div className="font-sans min-w-[180px]">
                <strong className="block text-primary font-bold text-sm">{t.id}</strong>
                <span className="text-xs text-muted-foreground block mt-0.5">Inventory: {t.task}</span>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-bold bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px]">{t.status}</span>
                  <span className="font-mono text-xs font-bold text-foreground">ETA: {t.eta}</span>
                </div>
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
            eventHandlers={{ click: (e) => { L.DomEvent.stopPropagation(e); setSelectedEntity({ type: 'POLICE', id: p.id }); } }}
          >
            <Popup>
               <div className="font-sans min-w-[200px]">
                <strong className="block text-warning font-bold text-sm">{p.id}</strong>
                <span className="text-xs text-muted-foreground block">{p.ward}</span>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-bold bg-warning/10 text-warning px-2 py-0.5 rounded text-[10px]">{p.status}</span>
                  <span className="font-bold text-success text-[10px]">Coverage: {p.coverage}</span>
                </div>
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
            <Popup>
              <div className="font-sans min-w-[180px]">
                <strong className="block text-foreground font-mono font-bold text-sm">Pole: {l.id} ({l.status})</strong>
                <span className="text-xs text-primary font-semibold block">{l.road}</span>
                <p className="text-xs text-destructive mt-1 font-medium">Fault: {l.reason}</p>
                <div className="mt-2 bg-secondary/30 p-1 rounded flex justify-between text-[10px] font-mono">
                  <span>Power: {l.power}W</span>
                  <span className="text-destructive font-bold">ANOMALY DETECTED</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {riskPois.map(poi => (
          <Marker 
            key={poi.id} 
            position={[poi.lat, poi.lng]} 
            icon={ICONS.riskPoi}
            opacity={getOpacity('POI', poi.id)}
            eventHandlers={{ click: (e) => { L.DomEvent.stopPropagation(e); setSelectedEntity({ type: 'POI', id: poi.id }); } }}
          >
            <Popup>
               <div className="font-sans min-w-[240px]">
                <strong className="block text-[#9333EA] font-extrabold uppercase text-[10px] tracking-wider mb-1">AI Darkness Risk & Crime Interlock</strong>
                <span className="font-bold text-foreground text-sm uppercase">{poi.type}</span>
                <span className="text-xs text-muted-foreground block mb-2">{poi.road}</span>
                
                <div className="bg-[#9333EA]/15 border border-[#9333EA]/40 p-2 rounded text-center my-1.5">
                   <span className="text-xs font-black text-[#9333EA]">DARKNESS RISK INDEX: {poi.riskScore} / 100</span>
                   <p className="text-[10px] font-extrabold text-[#9333EA] mt-0.5">{poi.status}</p>
                </div>
                
                <p className="text-[10px] bg-secondary p-2 rounded text-foreground font-semibold leading-relaxed border border-border mt-2">
                  {poi.action}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute bottom-3 left-3 z-[400] bg-surface/95 backdrop-blur px-3 py-1.5 rounded border border-border shadow-sm flex flex-wrap items-center gap-3.5 text-[10px] font-bold">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#B91C1C]"></span> Complaints</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]"></span> Electrical Teams</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C2410C]"></span> Police Patrols</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#64748B]"></span> Defective Poles</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#9333EA]"></span> AI Risk Hotspot</span>
        <span className="flex items-center gap-1.5 border-l border-border pl-2 text-primary">💡 Click anywhere on map for Point-in-Polygon query</span>
      </div>
    </div>
  );
}
