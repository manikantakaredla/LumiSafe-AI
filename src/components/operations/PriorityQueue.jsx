import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Search, Wrench, ShieldAlert } from 'lucide-react';
import { eventBus } from '@/sockets/socketClient';

const ICONS = {
  'CRITICAL': ShieldAlert,
  'BLOCKED': AlertTriangle,
  'REVIEW': Search,
  'SLA': Clock,
  'DISPATCH': Wrench
};

const COLORS = {
  'CRITICAL': 'text-destructive border-destructive/20 bg-destructive/10',
  'BLOCKED': 'text-warning border-warning/20 bg-warning/10',
  'REVIEW': 'text-info border-info/20 bg-info/10',
  'SLA': 'text-destructive border-destructive/20 bg-destructive/10',
  'DISPATCH': 'text-primary border-primary/20 bg-primary/10'
};

export function PriorityQueue() {
  const [items, setItems] = useState([
    { id: '1', type: 'CRITICAL', title: 'Cascading Streetlight Failure', location: 'Ward 4', time: '2m ago' },
    { id: '2', type: 'BLOCKED', title: 'Work Order WO-1249 Blocked', location: 'Ward 2', time: '14m ago' },
    { id: '3', type: 'REVIEW', title: 'Verification Failed (Score 65)', location: 'Ward 1', time: '22m ago' },
    { id: '4', type: 'SLA', title: 'SLA Breach Imminent (WO-882)', location: 'Ward 7', time: '31m ago' },
    { id: '5', type: 'DISPATCH', title: 'Awaiting Dispatch (High Priority)', location: 'Ward 3', time: '45m ago' },
  ]);

  useEffect(() => {
    // In a real implementation, we'd add new events to the top of the queue via socket
    const sub = eventBus.subscribe('timeline.updated', (event) => {
      // Simulate adding a new event
      /*
      setItems(prev => [
        { id: Date.now().toString(), type: 'REVIEW', title: 'Live Update Event', location: 'System', time: 'Just now' },
        ...prev.slice(0, 9)
      ]);
      */
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <div className="flex-1 flex flex-col mt-4 bg-[#0f172a] border border-[#1e293b] rounded overflow-hidden">
      <div className="p-2 border-b border-[#1e293b] bg-[#1e293b]/30">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Priority Operations Queue</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {items.map(item => {
          const Icon = ICONS[item.type];
          return (
            <div key={item.id} className={`p-2 border rounded flex gap-3 items-start ${COLORS[item.type]}`}>
              <Icon size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold">{item.title}</p>
                <div className="flex gap-2 text-[10px] opacity-80 mt-1 font-mono">
                  <span>{item.location}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
