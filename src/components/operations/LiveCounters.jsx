import React, { useState, useEffect } from 'react';
import { eventBus } from '@/sockets/socketClient';

export function LiveCounters() {
  const [counts, setCounts] = useState({
    complaints: 142,
    resolved: 38,
    blocked: 4,
    reviews: 8,
    events: 4201,
    socketMsgs: 12550
  });

  useEffect(() => {
    const handleEvent = () => {
      setCounts(c => ({
        ...c,
        events: c.events + 1,
        socketMsgs: c.socketMsgs + 1
      }));
    };

    const sub = eventBus.subscribe('timeline.updated', handleEvent);
    
    // Simulate high volume socket messages for visual effect
    const msgTimer = setInterval(() => {
      setCounts(c => ({ ...c, socketMsgs: c.socketMsgs + Math.floor(Math.random() * 5) }));
    }, 500);

    return () => {
      sub.unsubscribe();
      clearInterval(msgTimer);
    };
  }, []);

  const items = [
    { label: 'COMPLAINTS TODAY', value: counts.complaints, color: 'text-slate-200' },
    { label: 'RESOLVED', value: counts.resolved, color: 'text-success' },
    { label: 'BLOCKED', value: counts.blocked, color: 'text-destructive' },
    { label: 'MANUAL REVIEWS', value: counts.reviews, color: 'text-warning' },
    { label: 'EVENTS PROCESSED', value: counts.events, color: 'text-info' },
    { label: 'SOCKET MESSAGES', value: counts.socketMsgs, color: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(item => (
        <div key={item.label} className="bg-[#0f172a] border border-[#1e293b] rounded p-2 flex flex-col justify-between">
          <span className="text-[9px] text-slate-500 font-mono tracking-wider">{item.label}</span>
          <span className={`text-xl font-mono font-medium ${item.color}`}>{item.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
