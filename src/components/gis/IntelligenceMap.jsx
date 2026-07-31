import React from 'react'
import { MapContainer, TileLayer, Polygon, Marker, Tooltip, ZoomControl } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { divIcon } from 'leaflet'
import { useAppStore } from '@/store/useAppStore'
import { CITY_CENTER, mockWards, mockStreetLights, mockRepairTeams, mockPolicePatrols, mockIncidents } from '@/data/mockGisData'

const getWardColor = (riskLevel) => {
  if (riskLevel === 'high') return '#EF4444' // destructive
  if (riskLevel === 'medium') return '#F59E0B' // warning
  return '#10B981' // success
}

const createSvgIcon = (svgPath, bgColor, textColor = '#fff') => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="${svgPath}"></path></svg>`
  const html = `<div style="background-color: ${bgColor}; color: ${textColor}; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 4px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 4px 6px rgba(0,0,0,0.4);">${svgString}</div>`
  return divIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

// Minimalistic SVG paths
const LIGHT_OK_ICON = createSvgIcon("M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83", "#111827", "#10B981") 
const LIGHT_FAIL_ICON = createSvgIcon("M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83", "#EF4444", "#ffffff") 
const REPAIR_TEAM_ICON = createSvgIcon("M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z", "#3B82F6", "#ffffff") 
const POLICE_ICON = createSvgIcon("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "#6366F1", "#ffffff") 
const INCIDENT_ICON = createSvgIcon("M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01", "#F59E0B", "#111827") 

  export function IntelligenceMap() {
  const { activeLayers, openDrawer, publicReports } = useAppStore()

  const handleEntityClick = (entity, type) => {
    openDrawer(entity.name || entity.title || entity.id, type, entity.id)
  }

  // Combine mock incidents and live public reports
  const allIncidents = [
    ...mockIncidents,
    ...publicReports.map(rep => ({
      id: rep.id,
      title: rep.category || 'Citizen Report',
      priority: rep.priority,
      lat: rep.lat,
      lng: rep.lng,
      type: 'Complaint'
    }))
  ]

  return (
    <MapContainer 
      center={CITY_CENTER} 
      zoom={12} 
      className="w-full h-full bg-[#0B1120] z-0 cursor-crosshair"
      zoomControl={false}
      attributionControl={false}
    >
      {/* Dark Matter CartoDB Basemap */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        opacity={0.8}
      />

      {/* Ward Boundaries */}
      {activeLayers.includes('wards') && mockWards.features.map(ward => (
        <Polygon
          key={ward.properties.id}
          positions={ward.geometry.coordinates[0].map(coord => [coord[1], coord[0]])}
          pathOptions={{
            color: getWardColor(ward.properties.riskLevel),
            fillOpacity: 0.1,
            weight: 1.5,
            dashArray: '4'
          }}
          eventHandlers={{
            click: () => handleEntityClick(ward.properties, 'Ward')
          }}
        >
          <Tooltip sticky direction="top" opacity={1} className="dark-tooltip">
            <div className="font-sans font-semibold text-xs">{ward.properties.name}</div>
            <div className="font-mono text-[10px]">Risk: {ward.properties.riskLevel.toUpperCase()}</div>
          </Tooltip>
        </Polygon>
      ))}

      {/* Street Lights (Clustered) */}
      {activeLayers.includes('streetLights') && (
        <MarkerClusterGroup 
          chunkedLoading
          maxClusterRadius={40}
          showCoverageOnHover={false}
        >
          {mockStreetLights.map(light => (
            <Marker 
              key={light.id} 
              position={[light.lat, light.lng]}
              icon={light.status === 'failed' ? LIGHT_FAIL_ICON : LIGHT_OK_ICON}
              eventHandlers={{ click: () => handleEntityClick(light, 'Street Light') }}
            />
          ))}
        </MarkerClusterGroup>
      )}

      {/* Incidents / Complaints */}
      {activeLayers.includes('incidents') && allIncidents.map(inc => (
        <Marker 
          key={inc.id} 
          position={[inc.lat, inc.lng]}
          icon={INCIDENT_ICON}
          eventHandlers={{ click: () => handleEntityClick(inc, inc.type) }}
        />
      ))}

      {/* Repair Teams */}
      {activeLayers.includes('repairTeams') && mockRepairTeams.map(team => (
        <Marker 
          key={team.id} 
          position={[team.lat, team.lng]}
          icon={REPAIR_TEAM_ICON}
          eventHandlers={{ click: () => handleEntityClick(team, team.type) }}
        />
      ))}

      {/* Police Patrols */}
      {activeLayers.includes('policePatrols') && mockPolicePatrols.map(patrol => (
        <Marker 
          key={patrol.id} 
          position={[patrol.lat, patrol.lng]}
          icon={POLICE_ICON}
          eventHandlers={{ click: () => handleEntityClick(patrol, patrol.type) }}
        />
      ))}

    </MapContainer>
  )
}
