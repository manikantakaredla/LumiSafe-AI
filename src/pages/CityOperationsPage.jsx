import React from 'react';
import { OperationsMap } from '@/components/operations/OperationsMap';
import { Shield, MapPin, Radio, CarFront, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function CityOperationsPage() {
  const resourceData = [
    { ward: 'Ward 14', risk: 'Critical', reason: 'High Defect Density', patrols: 3, teams: 2, action: 'Re-route Patrol Alpha' },
    { ward: 'Ward 4', risk: 'High', reason: 'Dark Corridor Alert', patrols: 1, teams: 1, action: 'Assign Electrical Team' },
    { ward: 'Ward 11', risk: 'Medium', reason: 'Routine Maintenance', patrols: 2, teams: 0, action: 'Monitor' },
  ];

  const liveFeed = [
    { time: '10:42 AM', type: 'SLA Alert', desc: 'Repair delayed by 2 hours in Ward 14.' },
    { time: '10:35 AM', type: 'Unit Status', desc: 'Patrol Beta arrived at MVP Colony sector.' },
    { time: '10:15 AM', type: 'Incident', desc: 'New safety concern logged in Ward 4.' },
  ];

  return (
    <div className="h-full w-full bg-base text-foreground flex flex-col overflow-hidden font-sans">
      <div className="shrink-0 p-4 border-b border-border bg-surface flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="text-primary" size={24} />
          <div>
            <h1 className="text-xl font-bold text-primary tracking-tight">Joint Operations Center</h1>
            <p className="text-sm text-muted-foreground">Unified tracking for Electrical Repair Teams and Police Patrol Units.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-secondary/50 px-3 py-1.5 rounded flex items-center gap-2 border border-border">
             <CarFront size={16} className="text-info" />
             <span className="text-xs font-bold">12 Active Patrols</span>
          </div>
          <div className="bg-secondary/50 px-3 py-1.5 rounded flex items-center gap-2 border border-border">
             <Zap size={16} className="text-warning" />
             <span className="text-xs font-bold">8 Repair Teams</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* Left Panel: Resource Allocation Table (40%) */}
        <div className="w-2/5 flex flex-col h-full overflow-hidden bg-surface border border-border shadow-sm rounded">
          <div className="p-3 border-b border-border/50 bg-secondary/30 flex items-center gap-2">
            <Radio size={16} className="text-primary" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Resource Allocation</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/10 sticky top-0 border-b border-border/50">
                <tr>
                  <th className="p-3 font-semibold text-muted-foreground uppercase">Ward</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase text-center">Patrols</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase text-center">Repair Teams</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase">Risk</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {resourceData.map((row, i) => (
                  <tr key={i} className="hover:bg-base">
                    <td className="p-3 font-medium text-foreground">{row.ward}</td>
                    <td className="p-3 font-mono text-info text-center font-bold">{row.patrols}</td>
                    <td className="p-3 font-mono text-warning text-center font-bold">{row.teams}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${row.risk === 'Critical' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                        {row.risk.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-primary">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Center Panel: Map (60%) */}
        <div className="w-3/5 flex flex-col h-full gap-4">
          <div className="flex-1 relative bg-surface border border-border shadow-sm rounded flex flex-col overflow-hidden h-2/3">
             <div className="p-3 border-b border-border/50 bg-secondary/30 flex items-center gap-2 z-10">
               <MapPin size={16} className="text-primary" />
               <h3 className="text-sm font-bold text-foreground">Joint Deployment Map</h3>
               <span className="ml-auto text-[10px] bg-base px-2 py-1 border border-border rounded font-bold text-muted-foreground">Showing Patrols & Repairs</span>
             </div>
             <div className="flex-1 relative z-0">
               <OperationsMap />
             </div>
          </div>
          
          <div className="h-1/3 bg-surface border border-border shadow-sm rounded flex flex-col overflow-hidden">
             <div className="p-3 border-b border-border/50 bg-secondary/30 flex items-center gap-2">
               <AlertTriangle size={16} className="text-warning" />
               <h3 className="text-sm font-bold text-foreground">Live Incident Feed & Alerts</h3>
             </div>
             <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {liveFeed.map((feed, i) => (
                  <div key={i} className="bg-base border border-border/50 p-2 rounded flex items-start gap-3">
                    <span className="text-[10px] font-mono text-muted-foreground mt-0.5">{feed.time}</span>
                    <div>
                      <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">{feed.type}</span>
                      <p className="text-xs font-medium text-foreground">{feed.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
