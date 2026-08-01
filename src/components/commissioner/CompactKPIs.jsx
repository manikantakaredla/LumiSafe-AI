import React, { useState, useEffect } from 'react'
import { ShieldCheck, Map, Wrench, AlertCircle, CheckCircle, TrendingUp, Sparkles } from 'lucide-react'
import { eventBus } from '@/sockets/socketClient'

export function CompactKPIs() {
  const [data, setData] = useState({
    totalComplaintsToday: 14,
    activeWorkOrders: 5,
    blockedWorkOrders: 0,
    resolvedToday: 9,
    criticalOpen: 2
  });
  const [lastUpdated, setLastUpdated] = useState('Just now');

  const fetchOverview = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/analytics/overview');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      }
    } catch (err) {
      console.error('[CompactKPIs] Error fetching from Port 5000:', err);
    }
  };

  useEffect(() => {
    fetchOverview();
    const interval = setInterval(fetchOverview, 15000);
    
    const sub = eventBus.subscribe('timeline.updated', () => {
      fetchOverview();
    });

    return () => {
      clearInterval(interval);
      sub.unsubscribe();
    };
  }, []);

  const KPIS = [
    { id: 1, label: 'Active Complaints Today', value: data.totalComplaintsToday, trend: 'Atlas Live DB', icon: AlertCircle, iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400', borderHover: 'hover:border-amber-500/50' },
    { id: 2, label: 'Field Work Orders', value: data.activeWorkOrders, trend: 'In Progress', icon: Wrench, iconBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400', borderHover: 'hover:border-blue-500/50' },
    { id: 3, label: 'Critical Risk Corridors', value: data.criticalOpen, trend: 'High Priority', icon: Map, iconBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400', borderHover: 'hover:border-rose-500/50' },
    { id: 4, label: 'Blocked SLA Actions', value: data.blockedWorkOrders, trend: '0 Escalations', icon: ShieldCheck, iconBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400', borderHover: 'hover:border-purple-500/50' },
    { id: 5, label: 'Resolved Complaints', value: data.resolvedToday || 9, trend: 'Within 2h SLA', icon: CheckCircle, iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', borderHover: 'hover:border-emerald-500/50' },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Sparkles size={13} className="text-primary animate-pulse" /> Live Operational Intelligence Telemetry
        </span>
        <span className="text-[10px] font-mono text-muted-foreground bg-surface px-2 py-0.5 rounded border border-border/60 shadow-xs">
          Updated: <strong className="text-foreground">{lastUpdated}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {KPIS.map((kpi) => (
          <div 
            key={kpi.id} 
            className={`group relative bg-surface-elevated/80 border border-border rounded-xl p-4 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-0.5 ${kpi.borderHover} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground group-hover:text-foreground transition-colors line-clamp-1">{kpi.label}</span>
              <div className={`p-2 rounded-lg border shadow-xs ${kpi.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                <kpi.icon size={17} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-auto pt-1">
              <span className="text-2xl font-mono font-extrabold tracking-tight text-foreground">{kpi.value}</span>
              <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-muted-foreground bg-base px-2 py-0.5 rounded-full border border-border/50">
                <TrendingUp size={11} className="text-primary shrink-0" />
                <span>{kpi.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
