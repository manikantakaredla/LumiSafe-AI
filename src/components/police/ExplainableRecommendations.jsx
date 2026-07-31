import React from 'react';
import { Lightbulb, Users, ShieldAlert, Navigation, Activity } from 'lucide-react';

export function ExplainableRecommendations() {
  const reason = {
    failedLights: 14,
    complaintDensity: 'High (82nd percentile)',
    womenSafetyRisk: '92% (Critical)',
    nearestUnit: 'Patrol Alpha',
    distance: '1.2 km',
    confidence: 94
  };

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded flex flex-col mt-4">
      <div className="p-3 border-b border-[#1e293b] bg-success/10 flex items-center gap-2">
        <Activity size={16} className="text-success" />
        <h3 className="text-xs font-bold text-success uppercase tracking-wider">AI Recommendation Context</h3>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 bg-[#1e293b]/30 p-2 rounded border border-[#1e293b]">
          <Lightbulb size={14} className="text-slate-400" />
          <div>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Failed Lights</p>
            <p className="text-xs font-semibold text-warning">{reason.failedLights}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#1e293b]/30 p-2 rounded border border-[#1e293b]">
          <Users size={14} className="text-slate-400" />
          <div>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Complaint Density</p>
            <p className="text-xs font-semibold text-destructive">{reason.complaintDensity}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#1e293b]/30 p-2 rounded border border-[#1e293b]">
          <ShieldAlert size={14} className="text-slate-400" />
          <div>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Safety Risk</p>
            <p className="text-xs font-semibold text-destructive">{reason.womenSafetyRisk}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#1e293b]/30 p-2 rounded border border-[#1e293b]">
          <Navigation size={14} className="text-slate-400" />
          <div>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Nearest Unit</p>
            <p className="text-xs font-semibold text-info">{reason.nearestUnit} ({reason.distance})</p>
          </div>
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">AI Reasoning Summary</p>
        <p className="text-xs text-slate-300 italic border-l-2 border-primary pl-2 py-0.5">
          Based on the convergence of 14 failed streetlights and a critical Women Safety Risk score (92%), Patrol Alpha is positioned 1.2km away and is immediately recommended for dispatch to deter opportunistic crime.
        </p>
      </div>
    </div>
  );
}
