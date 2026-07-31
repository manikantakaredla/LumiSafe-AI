import React from 'react'
import { Layers } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const LAYERS = [
  { id: 'wards', label: 'Ward Boundaries' },
  { id: 'streetLights', label: 'Street Lights' },
  { id: 'incidents', label: 'Safety Incidents' },
  { id: 'repairTeams', label: 'Repair Teams' },
  { id: 'policePatrols', label: 'Police Patrols' },
  { id: 'heatmap', label: 'Risk Heatmap' },
  { id: 'predictions', label: 'Future Predictions' },
]

export function LayerManager() {
  const { activeLayers, toggleLayer } = useAppStore()

  return (
    <div className="absolute top-4 right-4 z-20 bg-surface/90 backdrop-blur-md border border-border rounded shadow-xl w-64 overflow-hidden flex flex-col">
      <div className="px-3 py-2 border-b border-border/50 flex items-center gap-2 bg-surface">
        <Layers size={14} className="text-muted-foreground" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Intelligence Layers</span>
      </div>
      <div className="p-2 space-y-1">
        {LAYERS.map(layer => {
          const isActive = activeLayers.includes(layer.id)
          return (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={cn(
                "w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors",
                isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary text-muted-foreground"
              )}
            >
              <span className="font-medium">{layer.label}</span>
              <div className={cn(
                "w-3 h-3 rounded-sm border flex items-center justify-center transition-colors",
                isActive ? "bg-primary border-primary" : "border-border-strong bg-transparent"
              )}>
                {isActive && <div className="w-1.5 h-1.5 bg-background rounded-sm" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
