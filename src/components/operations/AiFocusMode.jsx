import React from 'react';
import { useOperationsStore } from '@/store/useOperationsStore';
import { Target, Search, ShieldAlert, Clock } from 'lucide-react';

const FOCUS_MODES = [
  { id: 'MANUAL_REVIEWS', label: 'Manual Reviews', icon: Search, color: 'text-warning' },
  { id: 'CRITICAL_INCIDENTS', label: 'Critical Incidents', icon: ShieldAlert, color: 'text-destructive' },
  { id: 'SLA_VIOLATIONS', label: 'SLA Violations', icon: Clock, color: 'text-info' }
];

export function AiFocusMode() {
  const { focusMode, setFocusMode } = useOperationsStore();

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded flex flex-col mt-4">
      <div className="p-2 border-b border-[#1e293b] bg-[#1e293b]/30 flex items-center gap-2">
        <Target size={14} className="text-primary" />
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">AI Focus Mode</h3>
      </div>
      <div className="p-2 flex flex-col gap-2">
        {FOCUS_MODES.map(mode => {
          const isActive = focusMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setFocusMode(isActive ? null : mode.id)}
              className={`flex items-center gap-2 p-2 rounded text-[11px] font-mono transition-colors w-full border ${
                isActive 
                  ? 'bg-primary/20 text-white border-primary/50 shadow-[0_0_10px_rgba(139,92,246,0.3)]' 
                  : 'bg-transparent text-slate-400 border-slate-700/50 hover:bg-[#1e293b]/50 hover:text-slate-200'
              }`}
            >
              <mode.icon size={12} className={mode.color} />
              {mode.label}
              {isActive && <span className="ml-auto text-[9px] text-primary animate-pulse">ACTIVE</span>}
            </button>
          )
        })}
      </div>
    </div>
  );
}
