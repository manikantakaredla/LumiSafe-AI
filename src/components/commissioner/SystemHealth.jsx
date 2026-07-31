import React from 'react'
import { Activity } from 'lucide-react'

const SYSTEMS = [
  { name: 'AI Prediction Engine', status: 'Operational', color: 'text-success' },
  { name: 'Connected CCTV Nodes', status: '4,102 / 4,150', color: 'text-success' },
  { name: 'Street Lights Online', status: '98.4%', color: 'text-success' },
  { name: 'Evidence Processing', status: '8 Pending', color: 'text-warning' },
  { name: 'Active Severity 1 Alerts', status: '3 Active', color: 'text-destructive' },
]

export function SystemHealth() {
  return (
    <div className="bg-surface border rounded h-full flex flex-col">
      <div className="p-3 border-b flex items-center gap-2">
        <Activity size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">System Health</h3>
      </div>
      <div className="p-4 flex-1">
        <div className="space-y-4">
          {SYSTEMS.map((sys, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{sys.name}</span>
              <span className={`font-mono font-medium text-[11px] uppercase tracking-wider ${sys.color}`}>{sys.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
