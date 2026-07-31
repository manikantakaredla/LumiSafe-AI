import React from 'react';
import { Users, Zap, Shield, GitCommit } from 'lucide-react';

export function JointOperationsPanel() {
  const op = {
    corridor: 'MG Road Corridor',
    electricalTeam: 'Alpha Team',
    elecStatus: 'REPAIRING',
    policePatrol: 'Patrol Beta',
    policeStatus: 'ON_SCENE',
    repairProgress: 45, // percentage
    escortRequired: true
  };

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded flex flex-col mt-4">
      <div className="p-3 border-b border-[#1e293b] bg-[#1e293b]/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-info" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Joint Operations</h3>
        </div>
        {op.escortRequired && (
          <span className="text-[9px] font-mono bg-warning/20 text-warning border border-warning/30 px-1.5 py-0.5 rounded">
            ESCORT ACTIVE
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Active Target</p>
        <p className="text-sm font-semibold text-slate-200 mb-4">{op.corridor}</p>

        <div className="relative border-l-2 border-[#1e293b] ml-2 pl-4 py-1 space-y-4">
          
          <div className="relative">
            <div className="absolute -left-[23px] top-1 p-1 bg-[#0f172a] border-2 border-info rounded-full">
              <Zap size={10} className="text-info" />
            </div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Electrical</p>
            <p className="text-xs font-semibold text-slate-200">{op.electricalTeam}</p>
            <p className="text-[10px] font-mono text-info mt-1 bg-info/10 inline-block px-1.5 rounded">{op.elecStatus}</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[23px] top-1 p-1 bg-[#0f172a] border-2 border-primary rounded-full">
              <Shield size={10} className="text-primary" />
            </div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Police</p>
            <p className="text-xs font-semibold text-slate-200">{op.policePatrol}</p>
            <p className="text-[10px] font-mono text-primary mt-1 bg-primary/10 inline-block px-1.5 rounded">{op.policeStatus}</p>
          </div>

        </div>

        <div className="mt-5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Repair Progress</span>
            <span className="text-[10px] font-mono text-success">{op.repairProgress}%</span>
          </div>
          <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
            <div className="bg-success h-full transition-all duration-1000" style={{ width: `${op.repairProgress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
