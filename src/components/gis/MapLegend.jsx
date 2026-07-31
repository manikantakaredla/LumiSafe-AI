import React from 'react'

export function MapLegend() {
  return (
    <div className="absolute bottom-4 right-4 z-20 bg-surface/90 backdrop-blur-md border border-border rounded p-3 shadow-xl pointer-events-none">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2 border-b border-border/50 pb-1">Operational Legend</span>
      <div className="space-y-1.5 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-success border border-white/20" /> Optimal Node</div>
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-destructive border border-white/20" /> Failed Node</div>
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-warning border border-white/20" /> Active Incident</div>
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-info border border-white/20" /> Repair Team</div>
        <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 border border-white/20" /> Police Patrol</div>
      </div>
    </div>
  )
}
