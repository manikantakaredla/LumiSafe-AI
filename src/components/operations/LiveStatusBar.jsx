import React, { useState, useEffect } from 'react';
import { Activity, Zap, Shield, ShieldAlert, Cpu, HardDrive } from 'lucide-react';
import { eventBus } from '@/sockets/socketClient';

export function LiveStatusBar() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [stats, setStats] = useState({
    electricalTeams: 12,
    policeUnits: 5,
    criticalIncidents: 3,
    manualReviews: 1,
    aiStatus: 'ONLINE',
    socketStatus: 'CONNECTED',
    mongoStatus: 'HEALTHY'
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    
    // Listen for socket connection status
    const onConnect = () => setStats(s => ({ ...s, socketStatus: 'CONNECTED' }));
    const onDisconnect = () => setStats(s => ({ ...s, socketStatus: 'DISCONNECTED' }));
    
    eventBus.subscribe('timeline.updated', () => {
      // flash some indicator or just keep it active
    });

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="w-full bg-[#090e17] border-b border-[#1e293b] flex items-center justify-between px-4 py-1.5 text-[11px] font-mono shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-info">
          <Zap size={14} />
          <span>ELEC: {stats.electricalTeams} ACTIVE</span>
        </div>
        <div className="flex items-center gap-2 text-primary">
          <Shield size={14} />
          <span>POLICE: {stats.policeUnits} ACTIVE</span>
        </div>
        <div className="flex items-center gap-2 text-destructive">
          <ShieldAlert size={14} />
          <span>CRITICAL: {stats.criticalIncidents}</span>
        </div>
        <div className="flex items-center gap-2 text-warning">
          <Activity size={14} />
          <span>REVIEWS: {stats.manualReviews}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-success">
          <Cpu size={14} />
          <span>AI: {stats.aiStatus}</span>
        </div>
        <div className="flex items-center gap-2 text-success">
          <Activity size={14} />
          <span>WSS: {stats.socketStatus}</span>
        </div>
        <div className="flex items-center gap-2 text-success">
          <HardDrive size={14} />
          <span>DB: {stats.mongoStatus}</span>
        </div>
        <div className="text-slate-400 pl-4 border-l border-slate-700">
          SYS TIME: {time}
        </div>
      </div>
    </div>
  );
}
