import React from 'react';
import { useOperationsStore } from '@/store/useOperationsStore';
import { Zap, Shield, User, Cpu, FileSearch, Search, MapPin } from 'lucide-react';
import { GVMC_ZONES } from '@/lib/constants';

const FILTER_CONFIG = [
  { id: 'electrical', label: 'ELEC', icon: Zap },
  { id: 'police', label: 'POL', icon: Shield },
  { id: 'citizen', label: 'CTZ', icon: User },
  { id: 'ai', label: 'AI', icon: Cpu },
  { id: 'verification', label: 'VRF', icon: FileSearch },
  { id: 'manualReview', label: 'REV', icon: Search }
];

export function OperationsFilters() {
  const { filters, toggleFilter } = useOperationsStore();

  return (
    <div className="flex items-center gap-1 mt-3 mb-2 px-2">
      <span className="text-[9px] text-slate-500 font-mono uppercase mr-2 tracking-wider">Global Filters:</span>
      <div className="flex gap-1 flex-1">
        {FILTER_CONFIG.map(f => {
          const isActive = filters[f.id];
          return (
            <button
              key={f.id}
              onClick={() => toggleFilter(f.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono transition-colors border ${
                isActive 
                  ? 'bg-primary/20 text-primary border-primary/30' 
                  : 'bg-transparent text-slate-600 border-slate-700/50 hover:bg-[#1e293b]/50'
              }`}
            >
              <f.icon size={10} />
              {f.label}
            </button>
          )
        })}
      </div>
      
      <div className="ml-4 flex items-center bg-base border border-border rounded px-2 py-1">
        <MapPin size={12} className="text-muted-foreground mr-2" />
        <select className="bg-transparent text-xs text-foreground focus:outline-none w-32">
          <option value="">All Zones</option>
          {GVMC_ZONES.map(zone => (
            <optgroup key={zone.name} label={zone.name}>
              {zone.wards.map(ward => (
                <option key={ward} value={ward}>{ward}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </div>
  );
}
