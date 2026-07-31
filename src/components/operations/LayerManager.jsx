import React from 'react';
import { useOperationsStore } from '@/store/useOperationsStore';

export function LayerManager() {
  const { layers, toggleLayer } = useOperationsStore();

  const layerConfigs = [
    { key: 'streetLights', label: 'Street Lights (Live)' },
    { key: 'repairTeams', label: 'Electrical Teams' },
    { key: 'police', label: 'Police Units' },
    { key: 'complaints', label: 'Active Complaints' },
    { key: 'heatmap', label: 'Risk Heatmap' }
  ];

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded flex flex-col">
      <div className="p-2 border-b border-[#1e293b] bg-[#1e293b]/30">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Layer Manager</h3>
      </div>
      <div className="p-2 space-y-1">
        {layerConfigs.map(layer => (
          <label key={layer.key} className="flex items-center gap-3 p-1.5 hover:bg-[#1e293b]/50 rounded cursor-pointer transition-colors">
            <div className="relative inline-block w-8 h-4">
              <input 
                type="checkbox" 
                className="peer sr-only"
                checked={layers[layer.key]}
                onChange={() => toggleLayer(layer.key)}
              />
              <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
            </div>
            <span className="text-xs text-slate-300 font-medium">{layer.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
