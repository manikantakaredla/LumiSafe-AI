import React, { useState, useEffect } from 'react';
import { eventBus } from '@/sockets/socketClient';

export function LiveEventStream() {
  const [events, setEvents] = useState([
    { id: '1', timestamp: new Date(Date.now() - 1000 * 60 * 2), type: 'COMPLAINT_CREATED', text: 'Citizen submitted complaint #1492 in Ward 4.' },
    { id: '2', timestamp: new Date(Date.now() - 1000 * 60 * 1), type: 'AI_CLASSIFIED', text: 'AI classified #1492 as CRITICAL priority.' },
    { id: '3', timestamp: new Date(Date.now() - 1000 * 30), type: 'RECOMMENDATION', text: 'Generated dispatch recommendation for Alpha Team.' },
  ]);

  useEffect(() => {
    const sub = eventBus.subscribe('timeline.updated', (event) => {
      // Simulate real incoming backend events
      setEvents(prev => [
        { id: Date.now().toString(), timestamp: new Date(), type: 'SYSTEM_EVENT', text: `Processed event: ${event.type || 'Update'}` },
        ...prev.slice(0, 49) // Keep last 50
      ]);
    });
    return () => sub.unsubscribe();
  }, []);

  const getTypeColor = (type) => {
    if (type.includes('CRITICAL') || type.includes('FAILED')) return 'text-destructive';
    if (type.includes('AI')) return 'text-success';
    if (type.includes('COMPLAINT')) return 'text-info';
    if (type.includes('RECOMMENDATION')) return 'text-primary';
    return 'text-slate-400';
  };

  return (
    <div className="flex-1 bg-[#0f172a] border border-[#1e293b] rounded mt-0 flex flex-col overflow-hidden">
      <div className="p-2 border-b border-[#1e293b] bg-[#1e293b]/30 flex items-center justify-between shrink-0">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          Live Event Stream
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-[10px]">
        {events.map((evt) => (
          <div key={evt.id} className="flex gap-3 border-b border-[#1e293b]/50 pb-2 last:border-0 animate-in fade-in slide-in-from-top-1">
            <span className="text-slate-500 shrink-0">{evt.timestamp.toLocaleTimeString()}</span>
            <div>
              <span className={`font-semibold ${getTypeColor(evt.type)}`}>[{evt.type}]</span>
              <span className="text-slate-300 ml-2">{evt.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
