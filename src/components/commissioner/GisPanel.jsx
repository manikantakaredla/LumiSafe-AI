import React from 'react'
import { Map as MapIcon, Layers, Maximize2 } from 'lucide-react'

export function GisPanel() {
  return (
    <div className="h-full min-h-[450px] bg-base border rounded relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      
      <div className="relative z-10 flex items-center justify-between p-3 border-b border-border/50 bg-surface/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapIcon size={16} className="text-primary" />
          <span>Live Operations Map</span>
        </div>
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-secondary rounded text-muted-foreground transition-colors"><Layers size={14} /></button>
          <button className="p-1.5 hover:bg-secondary rounded text-muted-foreground transition-colors"><Maximize2 size={14} /></button>
        </div>
      </div>
      
      <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <MapIcon size={48} className="mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm font-mono text-muted-foreground">GIS Layer Placeholder</p>
          <p className="text-xs text-muted-foreground mt-1">Awaiting map data integration...</p>
        </div>
      </div>

      {/* Floating Legend Placeholder */}
      <div className="absolute bottom-4 right-4 z-10 bg-surface border rounded p-3 text-xs space-y-2 font-mono text-muted-foreground shadow-lg backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-success" /> Active Unit</div>
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-warning" /> Issue Reported</div>
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-destructive" /> Critical Node</div>
      </div>
    </div>
  )
}
