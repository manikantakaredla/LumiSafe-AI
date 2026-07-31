import React from 'react'
import { ShieldCheck, Map, Wrench, AlertCircle, FileSearch } from 'lucide-react'

const KPIS = [
  { id: 1, label: 'City Safety Index', value: '84.2', trend: '+1.4', icon: ShieldCheck, color: 'text-success' },
  { id: 2, label: 'Critical Wards', value: '3', trend: '-1', icon: Map, color: 'text-warning' },
  { id: 3, label: 'Active Repair Teams', value: '12', trend: 'Optimal', icon: Wrench, color: 'text-info' },
  { id: 4, label: 'Pending Complaints', value: '142', trend: '+12', icon: AlertCircle, color: 'text-destructive' },
  { id: 5, label: 'Evidence Pending', value: '8', trend: '-2', icon: FileSearch, color: 'text-warning' },
]

export function CompactKPIs() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
      {KPIS.map(kpi => (
        <div key={kpi.id} className="flex-1 min-w-[200px] bg-surface border rounded p-3 flex items-center gap-3">
          <div className={`p-2 bg-base rounded ${kpi.color}`}>
            <kpi.icon size={18} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{kpi.label}</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-mono font-medium text-foreground">{kpi.value}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{kpi.trend}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
