import React from 'react';
import { useOperationsStore } from '@/store/useOperationsStore';
import { PlayCircle, History, Calendar } from 'lucide-react';

export function PlaybackControls() {
  const { playbackMode, setPlaybackMode } = useOperationsStore();

  const modes = [
    { id: 'LIVE', label: 'LIVE', icon: PlayCircle },
    { id: 'LAST_HOUR', label: 'Last Hour', icon: History },
    { id: 'LAST_DAY', label: 'Last Day', icon: Calendar }
  ];

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded flex flex-col mt-4">
      <div className="p-2 border-b border-[#1e293b] bg-[#1e293b]/30">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Playback Mode</h3>
      </div>
      <div className="p-2 flex flex-col gap-2">
        {modes.map(mode => {
          const isActive = playbackMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setPlaybackMode(mode.id)}
              className={`flex items-center gap-2 p-2 rounded text-xs font-semibold transition-colors w-full ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary/50 text-slate-400 hover:bg-secondary hover:text-slate-200'
              }`}
            >
              <mode.icon size={14} className={isActive && mode.id === 'LIVE' ? 'animate-pulse text-red-500' : ''} />
              {mode.label}
            </button>
          )
        })}
      </div>
    </div>
  );
}
