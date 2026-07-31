import React from 'react';
import { AlertTriangle, MapPin, ShieldAlert, Activity } from 'lucide-react';

export function AiUnsafeCorridors() {
  const corridors = [
    {
      id: 'COR-882',
      name: 'MG Road Corridor',
      length: '1.2 km',
      failedLights: 14,
      complaintDensity: 'High',
      womenSafetyRisk: 92,
      requiredPatrol: 'Immediate Sweeps',
      aiConfidence: 94
    },
    {
      id: 'COR-914',
      name: 'Beach Road Sector 4',
      length: '0.8 km',
      failedLights: 8,
      complaintDensity: 'Medium',
      womenSafetyRisk: 68,
      requiredPatrol: 'Hourly Drive-by',
      aiConfidence: 88
    }
  ];

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded flex flex-col">
      <div className="p-3 border-b border-[#1e293b] bg-destructive/10 flex items-center gap-2">
        <AlertTriangle size={16} className="text-destructive" />
        <h3 className="text-xs font-bold text-destructive uppercase tracking-wider">AI Unsafe Corridors</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {corridors.map((c) => (
          <div key={c.id} className="p-3 border border-destructive/20 bg-destructive/5 rounded cursor-pointer hover:bg-destructive/10 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-semibold text-slate-200">{c.name}</h4>
              <span className="text-[10px] font-mono text-destructive px-2 py-0.5 border border-destructive/30 rounded bg-destructive/10">RISK: {c.womenSafetyRisk}%</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mt-3">
              <div>
                <span className="text-slate-500 block mb-0.5">Length</span>
                <span className="text-slate-300">{c.length}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Failed Lights</span>
                <span className="text-warning">{c.failedLights}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Complaint Density</span>
                <span className="text-info">{c.complaintDensity}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Required Patrol</span>
                <span className="text-primary font-semibold">{c.requiredPatrol}</span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between text-[9px] font-mono border-t border-[#1e293b] pt-2">
              <span className="text-success flex items-center gap-1"><Activity size={10}/> AI Confidence: {c.aiConfidence}%</span>
              <button className="text-primary hover:text-white transition-colors">VIEW ON MAP</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
