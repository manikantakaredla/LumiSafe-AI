import React, { useState, useEffect } from 'react'
import { ShieldCheck, Map, Wrench, AlertCircle, CheckCircle } from 'lucide-react'
import { eventBus } from '@/sockets/socketClient'

export function CompactKPIs() {
  const [data, setData] = useState({
    totalComplaintsToday: 0,
    activeWorkOrders: 0,
    blockedWorkOrders: 0,
    resolvedToday: 0,
    criticalOpen: 0
  });

  const fetchOverview = async () => {
    try {
      const res = await fetch('/api/v1/analytics/overview').then(r => r.json());
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOverview();
    
    // Minimal real-time update
    const sub = eventBus.subscribe('timeline.updated', () => {
      fetchOverview();
    });

    return () => sub.unsubscribe();
  }, []);

  const KPIS = [
    { id: 1, label: 'Complaints Today', value: data.totalComplaintsToday, trend: 'Daily', icon: AlertCircle, color: 'text-warning' },
    { id: 2, label: 'Active Work Orders', value: data.activeWorkOrders, trend: 'In Field', icon: Wrench, color: 'text-info' },
    { id: 3, label: 'Critical Tasks', value: data.criticalOpen, trend: 'Pending', icon: Map, color: 'text-destructive' },
    { id: 4, label: 'Blocked WOs', value: data.blockedWorkOrders, trend: 'Attention', icon: ShieldCheck, color: 'text-destructive' },
    { id: 5, label: 'Resolved Today', value: data.resolvedToday, trend: 'Closed', icon: CheckCircle, color: 'text-success' },
  ];

  return (
    <div className="flex overflow-x-auto bg-surface border border-border shadow-sm rounded-md scrollbar-hide">
      {KPIS.map((kpi, idx) => (
        <div key={kpi.id} className={`flex-1 min-w-[180px] p-4 flex items-center gap-3 ${idx !== KPIS.length - 1 ? 'border-r border-border/50' : ''}`}>
          <div className={`p-2 bg-base rounded ${kpi.color}`}>
            <kpi.icon size={18} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{kpi.label}</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-mono font-medium text-foreground">{kpi.value}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{kpi.trend}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
