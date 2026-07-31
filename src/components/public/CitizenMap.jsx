import React from 'react'
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { ChevronLeft } from 'lucide-react'
import { CITY_CENTER, mockStreetLights } from '@/data/mockGisData'
import { useAppStore } from '@/store/useAppStore'

const createSvgIcon = (svgPath, bgColor, textColor = '#fff') => {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="${svgPath}"></path></svg>`
  const html = `<div style="background-color: ${bgColor}; color: ${textColor}; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${svgString}</div>`
  return divIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

const LIGHT_FAIL_ICON = createSvgIcon("M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83", "#EF4444", "#ffffff") 
const REPORT_ICON = createSvgIcon("M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01", "#3B82F6", "#ffffff") 

export function CitizenMap({ onBack }) {
  const { publicReports } = useAppStore()
  
  // Only show failed lights and citizen reports on public map
  const failedLights = mockStreetLights.filter(l => l.status === 'failed')

  return (
    <div className="relative w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="absolute top-4 left-4 z-[1000]">
        <button onClick={onBack} className="flex items-center gap-1 bg-surface/90 backdrop-blur border border-border px-4 py-2 rounded-full text-foreground shadow-lg hover:bg-secondary transition-colors font-medium text-sm">
          <ChevronLeft size={18} /> Back
        </button>
      </div>

      <MapContainer 
        center={CITY_CENTER} 
        zoom={13} 
        className="w-full flex-1 z-0"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          opacity={1}
        />
        <ZoomControl position="bottomright" />

        {failedLights.map(light => (
          <Marker 
            key={light.id} 
            position={[light.lat, light.lng]}
            icon={LIGHT_FAIL_ICON}
          />
        ))}

        {publicReports.map(rep => (
          <Marker 
            key={rep.id} 
            position={[rep.lat, rep.lng]}
            icon={REPORT_ICON}
          />
        ))}
      </MapContainer>
      
      <div className="bg-surface p-4 border-t border-border flex justify-around">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive border border-border"></div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reported Light</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary border border-border"></div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Report</span>
        </div>
      </div>
    </div>
  )
}
