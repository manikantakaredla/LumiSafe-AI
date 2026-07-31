import React from 'react'
import { Activity } from 'lucide-react'

export function OperationsOverview() {
  return (
    <div className="absolute bottom-4 left-4 z-20 bg-surface/90 backdrop-blur-md border border-border rounded shadow-xl w-64 p-3 flex flex-col gap-3">
      <div className="flex items-center gap-2 border-b border-border/50 pb-2">
        <Activity size={14} className="text-primary" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Operations Overview</span>
      </div>
      
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-muted-foreground uppercase">City Safety Index</span>
          <span className="text-xl font-mono text-success font-medium">84.2</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] font-mono text-muted-foreground uppercase">System Status</span>
          <span className="text-xs text-success font-medium">Nominal</span>
        </div>
      </div>
    </div>
  )
}
