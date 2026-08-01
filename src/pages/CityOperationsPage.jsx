import React, { useEffect, useState } from 'react';
import { OperationsMap } from '@/components/operations/OperationsMap';
import { Shield, MapPin, Radio, CarFront, Zap, AlertTriangle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

export function CityOperationsPage() {
  const [resourceData, setResourceData] = useState([]);
  const [liveFeed, setLiveFeed] = useState([]);
  const [counts, setCounts] = useState({ patrols: 12, teams: 8 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchOperationsData = async () => {
    try {
      // 1. Fetch Darkness Risk Assessments for Resource Allocation table
      const riskRes = await fetch('http://localhost:5000/api/v1/police/darkness-risk');
      if (riskRes.ok) {
        const riskJson = await riskRes.json();
        const formattedRisk = (riskJson.data || []).map((r, i) => ({
          ward: r.wardName || r.zone,
          road: r.roadName,
          risk: r.riskLevel,
          score: r.darknessRiskIndex,
          reason: r.sensitivityCategory.replace(/_/g, ' '),
          patrols: r.darknessRiskIndex >= 85 ? 2 : 1,
          teams: r.darknessRiskIndex >= 70 ? 1 : 0,
          action: r.recommendedIntervencion
        }));
        setResourceData(formattedRisk);
      }

      // 2. Fetch Live Complaints and Work Orders for Feed
      const compRes = await fetch('http://localhost:5000/api/v1/complaints');
      if (compRes.ok) {
        const compJson = await compRes.json();
        const recentFeed = (compJson.data || []).slice(0, 15).map(c => ({
          time: new Date(c.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: c.priority === 'Critical' ? 'CRITICAL ALERT' : 'SAFETY INCIDENT',
          desc: `${c.category} reported near ${c.location?.coordinates ? `GPS [${c.location.coordinates[1].toFixed(3)}, ${c.location.coordinates[0].toFixed(3)}]` : 'City Zone'}. Status: ${c.status}`,
          priority: c.priority || 'High'
        }));
        setLiveFeed(recentFeed);
      }

      // 3. Fetch active patrol & repair team counts
      const teamRes = await fetch('http://localhost:5000/api/v1/workorders/teams');
      const polRes = await fetch('http://localhost:5000/api/v1/police/units');
      let tCount = 8;
      let pCount = 12;
      if (teamRes.ok) { const td = await teamRes.json(); if (td.data?.length) tCount = td.data.length; }
      if (polRes.ok) { const pd = await polRes.json(); if (pd.data?.length) pCount = pd.data.length; }
      setCounts({ patrols: pCount, teams: tCount });

    } catch (err) {
      console.error('[CityOperations] Error loading real-time operations feed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationsData();
    const interval = setInterval(fetchOperationsData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full bg-base text-foreground flex flex-col overflow-hidden font-sans">
      <div className="shrink-0 p-4 border-b border-border bg-surface flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="text-primary" size={24} />
          <div>
            <h1 className="text-xl font-bold text-primary tracking-tight flex items-center gap-2">
              <span>Joint Operations & AI Darkness Risk Center</span>
              {isLoading && <Loader2 size={16} className="animate-spin text-primary ml-2" />}
            </h1>
            <p className="text-sm text-muted-foreground">Unified tracking for Electrical Repair Teams, Police Patrol Units, and Darkness Crime Risk Index.</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={fetchOperationsData} 
            className="p-2 hover:bg-secondary rounded text-muted-foreground transition-colors border border-border" 
            title="Force Sync"
          >
            <RefreshCw size={15} />
          </button>
          <div className="bg-secondary/50 px-3.5 py-1.5 rounded flex items-center gap-2 border border-border shadow-sm">
             <CarFront size={16} className="text-info" />
             <span className="text-xs font-bold text-foreground">{counts.patrols} Active Patrols</span>
          </div>
          <div className="bg-secondary/50 px-3.5 py-1.5 rounded flex items-center gap-2 border border-border shadow-sm">
             <Zap size={16} className="text-warning" />
             <span className="text-xs font-bold text-foreground">{counts.teams} Repair Teams</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* Left Panel: AI Resource & Darkness Risk Table (45%) */}
        <div className="w-5/12 flex flex-col h-full overflow-hidden bg-surface border border-border shadow-sm rounded">
          <div className="p-3 border-b border-border/50 bg-secondary/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio size={16} className="text-[#9333EA]" />
              <h2 className="font-extrabold text-xs uppercase tracking-wider text-[#9333EA]">AI Darkness Risk & Dispatch Engine</h2>
            </div>
            <span className="text-[10px] font-mono bg-base px-2 py-0.5 border border-border rounded font-bold text-muted-foreground">REAL-TIME INDEX</span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/10 sticky top-0 border-b border-border/50 text-[11px]">
                <tr>
                  <th className="p-3 font-semibold text-muted-foreground uppercase">Ward & Corridor</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase text-center">Risk Score</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase text-center">Patrols</th>
                  <th className="p-3 font-semibold text-muted-foreground uppercase">AI Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {resourceData.map((row, i) => (
                  <tr key={i} className="hover:bg-base transition-colors">
                    <td className="p-3">
                      <span className="font-bold text-foreground block text-xs">{row.road}</span>
                      <span className="text-[10px] text-muted-foreground font-medium block">{row.ward}</span>
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#9333EA]/10 text-[#9333EA]">
                        {row.reason}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${row.risk === 'CRITICAL' ? 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse' : 'bg-warning/10 text-warning border-warning/20'}`}>
                          {row.score} / 100
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{row.risk}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-info text-center font-bold text-sm">{row.patrols}</td>
                    <td className="p-3 font-semibold text-[11px] text-primary leading-tight">{row.action}</td>
                  </tr>
                ))}
                {resourceData.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-muted-foreground font-medium">All streetlights operational. Zero high-risk darkness sectors reported.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Center Panel: Map (55%) */}
        <div className="w-7/12 flex flex-col h-full gap-4">
          <div className="flex-1 relative bg-surface border border-border shadow-sm rounded flex flex-col overflow-hidden h-2/3">
             <div className="p-3 border-b border-border/50 bg-secondary/30 flex items-center justify-between z-10">
               <div className="flex items-center gap-2">
                 <MapPin size={16} className="text-primary" />
                 <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground">Joint Deployment & Crime Hotspot Map</h3>
               </div>
               <span className="text-[10px] bg-base px-2 py-1 border border-border rounded font-bold text-accent">VISAKHAPATNAM CCC LIVE</span>
             </div>
             <div className="flex-1 relative z-0">
               <OperationsMap />
             </div>
          </div>
          
          <div className="h-1/3 bg-surface border border-border shadow-sm rounded flex flex-col overflow-hidden">
             <div className="p-3 border-b border-border/50 bg-secondary/30 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <AlertTriangle size={16} className="text-warning" />
                 <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground">Live Incident & Telemetry Alarm Feed</h3>
               </div>
               <span className="text-[10px] text-muted-foreground font-mono">AUTOSYNC: 15S INTERVAL</span>
             </div>
             <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {liveFeed.map((feed, i) => (
                  <div key={i} className={`bg-base border p-2.5 rounded flex items-start gap-3 transition-colors ${feed.type.includes('CRITICAL') ? 'border-destructive/40 bg-destructive/5' : 'border-border/60'}`}>
                    <span className="text-[10px] font-mono font-bold text-muted-foreground mt-0.5 whitespace-nowrap">{feed.time}</span>
                    <div className="flex-1">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider ${feed.type.includes('CRITICAL') ? 'text-destructive' : 'text-warning'}`}>{feed.type}</span>
                      <p className="text-xs font-medium text-foreground mt-0.5 leading-relaxed">{feed.desc}</p>
                    </div>
                  </div>
                ))}
                {liveFeed.length === 0 && !isLoading && (
                  <div className="p-6 text-center text-xs text-muted-foreground font-medium">No live incidents in the emergency queue.</div>
                )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
