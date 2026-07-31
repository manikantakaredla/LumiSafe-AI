import React from 'react';
import { useOperationsStore } from '@/store/useOperationsStore';
import { X, CheckCircle2, XCircle, RefreshCw, AlertTriangle, Shield, MapPin, Activity } from 'lucide-react';

export function IncidentCommandPanel() {
  const { selectedEntity, setSelectedEntity } = useOperationsStore();

  if (!selectedEntity) return null;

  // Mock data based on selected entity
  const details = {
    incident: `Entity ${selectedEntity.id} - Cascading Failure`,
    priority: 'CRITICAL',
    ward: 'Ward 4 - Madhurawada',
    assignedTeam: 'Alpha Team (ETA 14m)',
    nearestPatrol: 'Patrol Beta (1.2km)',
    nearbyComplaints: 3,
    nearbyFailedLights: 14,
    expectedSafetyImprovement: '+18% Sector Safety Index',
    recommendedAction: 'Dispatch Alpha Team immediately. Reroute Patrol Beta to manage traffic.'
  };

  return (
    <div className="absolute top-4 right-4 w-80 bg-[#0f172a] border border-[#1e293b] rounded-md shadow-2xl z-[500] flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Header */}
      <div className="bg-destructive/10 border-b border-destructive/20 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle size={16} />
          <h3 className="text-xs font-bold uppercase tracking-wider">Incident Command</h3>
        </div>
        <button onClick={() => setSelectedEntity(null)} className="text-slate-400 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Details Grid */}
      <div className="p-4 flex flex-col gap-3 text-sm">
        <div>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-0.5">Incident</p>
          <p className="font-semibold text-slate-200">{details.incident}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-0.5">Priority</p>
            <p className="font-mono text-destructive">{details.priority}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-0.5">Ward</p>
            <p className="font-mono text-slate-300">{details.ward}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-0.5">Assigned Team</p>
            <p className="font-mono text-info">{details.assignedTeam}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-0.5">Nearest Patrol</p>
            <p className="font-mono text-primary flex items-center gap-1"><Shield size={12}/> {details.nearestPatrol}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-0.5">Nearby Complaints</p>
            <p className="font-mono text-slate-300">{details.nearbyComplaints}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-0.5">Failed Lights</p>
            <p className="font-mono text-warning">{details.nearbyFailedLights}</p>
          </div>
        </div>

        <div className="mt-2 bg-[#1e293b]/50 p-3 rounded border border-[#1e293b]">
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
            <Activity size={12} className="text-success" /> AI Recommendation
          </p>
          <p className="text-xs text-slate-300">{details.recommendedAction}</p>
          <p className="text-xs text-success font-semibold mt-2">Impact: {details.expectedSafetyImprovement}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 bg-[#1e293b]/30 border-t border-[#1e293b] flex flex-col gap-2">
        <button className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-2">
          <CheckCircle2 size={14} /> Approve AI Plan
        </button>
        <div className="flex gap-2">
          <button className="flex-1 py-1.5 bg-secondary text-foreground hover:bg-secondary/80 rounded text-xs font-medium transition-colors flex items-center justify-center gap-2">
            <RefreshCw size={12} /> Reassign
          </button>
          <button className="flex-1 py-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded text-xs font-medium transition-colors flex items-center justify-center gap-2">
            <XCircle size={12} /> Reject
          </button>
        </div>
      </div>

    </div>
  );
}
