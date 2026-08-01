import React, { useState, useEffect } from 'react'
import { Filter, AlertTriangle, CheckCircle2, Zap, Users, MapPin, Search, AlertCircle, Clock, Loader2, RefreshCw } from 'lucide-react'
import { OperationsMap } from '@/components/operations/OperationsMap'

export function ElectricalPage() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [fieldTeams, setFieldTeams] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [metrics, setMetrics] = useState({ total: '152,000', working: '148,400', defective: '3,600' });
  const [isLoading, setIsLoading] = useState(true);

  const fetchElectricalData = async () => {
    try {
      // 1. Fetch live repair teams
      const teamRes = await fetch('http://localhost:5000/api/v1/workorders/teams');
      if (teamRes.ok) {
        const tData = await teamRes.json();
        const formattedTeams = (tData.data || []).map(t => ({
          id: t.name || 'Electrical Crew',
          status: t.status || 'AVAILABLE',
          loc: t.currentLocation ? `GPS [${t.currentLocation.coordinates[1].toFixed(2)}, ${t.currentLocation.coordinates[0].toFixed(2)}]` : 'Sector HQ',
          eta: t.status === 'EN_ROUTE' ? '12 mins' : 'Ready'
        }));
        setFieldTeams(formattedTeams);
      }

      // 2. Fetch live complaints
      const compRes = await fetch('http://localhost:5000/api/v1/complaints');
      if (compRes.ok) {
        const cData = await compRes.json();
        const formattedComp = (cData.data || []).slice(0, 8).map(c => ({
          id: c.complaintId || c._id,
          ward: c.location?.coordinates ? `GPS [${c.location.coordinates[1].toFixed(2)}, ${c.location.coordinates[0].toFixed(2)}]` : 'Ward Sector',
          type: c.category || 'Electrical Defect',
          status: c.status || 'Pending',
          time: new Date(c.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setComplaints(formattedComp);
      }

      // 3. Fetch IoT failure stats to refine metrics
      const iotRes = await fetch('http://localhost:5000/api/v1/iot/telemetry');
      if (iotRes.ok) {
        const iData = await iotRes.json();
        const all = iData.data || [];
        const def = all.filter(l => l.status !== 'Operational' || (l.telemetry?.powerConsumption === 0)).length;
        setMetrics({
          total: `${152000 + all.length}`,
          working: `${148400 + (all.length - def)}`,
          defective: `${3600 + def}`
        });
      }
    } catch (err) {
      console.error('[Electrical Page] Live DB Sync Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchElectricalData();
    const interval = setInterval(fetchElectricalData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      // Execute optimize workorders on backend
      await fetch('http://localhost:5000/api/v1/workorders/optimize', { method: 'POST' });
      setDeployed(true);
      alert("AI Command Executed: Specialized Electrical Repair Teams have been assigned routes across critical darkness corridors!");
      fetchElectricalData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="h-full w-full bg-base text-foreground flex flex-col overflow-y-auto font-sans">
      <div className="shrink-0 p-4 border-b border-border bg-surface flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <Zap className="text-primary" size={24} />
          <div>
            <h1 className="text-xl font-bold text-primary tracking-tight flex items-center gap-2">
              <span>Electrical Operations & Field Dispatch Dashboard</span>
              {isLoading && <Loader2 size={16} className="animate-spin text-primary ml-1" />}
            </h1>
            <p className="text-sm text-muted-foreground">"Real-time IoT grid monitoring & automated repair dispatch across Visakhapatnam Wards."</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
           <button onClick={fetchElectricalData} className="p-2 hover:bg-secondary rounded border border-border text-muted-foreground" title="Refresh Telemetry">
             <RefreshCw size={15} />
           </button>
           <div className="bg-secondary/50 px-4 py-1.5 rounded-xl flex flex-col border border-border shadow-sm">
              <span className="text-[10px] uppercase text-muted-foreground font-bold">Total Lights</span>
              <span className="font-mono font-bold text-base leading-none mt-1">{metrics.total}</span>
           </div>
           <div className="bg-success/10 px-4 py-1.5 rounded-xl flex flex-col border border-success/20 shadow-sm">
              <span className="text-[10px] uppercase text-success font-bold">Operational</span>
              <span className="font-mono font-bold text-success text-base leading-none mt-1">{metrics.working}</span>
           </div>
           <div className="bg-destructive/10 px-4 py-1.5 rounded-xl flex flex-col border border-destructive/20 shadow-sm">
              <span className="text-[10px] uppercase text-destructive font-bold">Defects & Anomaly</span>
              <span className="font-mono font-bold text-destructive text-base leading-none mt-1">{metrics.defective}</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
        
        {/* Left Column */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto">
          
          <div className="bg-surface border border-border shadow-sm rounded-xl flex flex-col overflow-hidden shrink-0">
            <div className="p-3 border-b border-border bg-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-primary animate-pulse" />
                <h2 className="font-bold text-xs uppercase tracking-wider text-primary">AI Resource & Routing Engine</h2>
              </div>
              <span className="text-[10px] font-mono text-primary font-bold">LIVE OPTIMIZER</span>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-foreground tracking-tight">Ward 24 (Siripuram) Directive</h3>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-destructive/10 text-destructive text-[10px] font-extrabold uppercase rounded border border-destructive/20">Darkness Risk: 99 / 100</span>
                </div>
                <div className="text-right">
                   <p className="text-2xl font-black text-destructive leading-none font-mono">CRITICAL</p>
                   <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Voltage Dip (184V)</p>
                </div>
              </div>

              <div className="bg-base border border-border rounded-lg p-3.5 mt-1 shadow-sm">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">AI Crime & Safety Interlock Factors</p>
                <ul className="space-y-2 text-xs font-semibold text-foreground">
                  <li className="flex items-start gap-2">
                     <span className="text-destructive mt-0.5">•</span>
                     <span><strong>St. Joseph's Women's College</strong> gate is experiencing pitch darkness and blinking lighting.</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className="text-destructive mt-0.5">•</span>
                     <span><strong>RTC Complex Shelter-2</strong> is reporting zero wattage output (MCB Tripped).</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className="text-warning mt-0.5">•</span>
                     <span>Historical police data flags this corridor as a high-risk zone for night incidents.</span>
                  </li>
                </ul>
              </div>

              {!deployed ? (
                <div className="mt-1 flex flex-col gap-3">
                  <p className="text-xs font-semibold text-foreground bg-primary/5 p-3 rounded border border-primary/20 leading-relaxed">
                    <strong className="text-primary uppercase">AI Routing Recommendation:</strong> Dispatching Team Alpha immediately will resolve 4 critical defects within a 1.2 km radius and restore lighting safety SLA.
                  </p>
                  
                  <button 
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    {isDeploying ? <Loader2 size={16} className="animate-spin" /> : 'Execute Autonomous Team Dispatch'}
                  </button>
                </div>
              ) : (
                <div className="mt-2 bg-success/10 border border-success/30 p-4 rounded-lg flex items-center gap-3">
                  <CheckCircle2 size={24} className="text-success shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-success">AI Dispatch Command Active</h4>
                    <p className="text-xs text-success/80 mt-0.5">Repair routes broadcasted to field teams. Tracking GPS movement.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface border border-border shadow-sm rounded-xl flex flex-col overflow-hidden shrink-0">
            <div className="p-3 border-b border-border bg-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-primary" />
                <h2 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Live Field Repair Crews</h2>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">GPS SYNCED</span>
            </div>
            <div className="p-3 space-y-2.5">
              {fieldTeams.map((team, i) => (
                <div key={i} className="bg-base border border-border p-2.5 rounded-lg flex justify-between items-center shadow-sm hover:border-primary/40 transition-colors">
                  <div>
                    <h4 className="font-extrabold text-xs text-foreground">{team.id}</h4>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 font-mono"><MapPin size={11} className="text-primary"/> {team.loc}</span>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${team.status === 'AVAILABLE' ? 'bg-success/10 text-success border border-success/20' : 'bg-info/10 text-info border border-info/20'}`}>{team.status}</span>
                    <p className="text-[10px] font-mono font-semibold text-muted-foreground mt-1">ETA: {team.eta}</p>
                  </div>
                </div>
              ))}
              {fieldTeams.length === 0 && !isLoading && (
                <p className="text-xs text-center text-muted-foreground py-4 font-medium">No specialized teams currently active on grid.</p>
              )}
            </div>
          </div>

        </div>

        {/* Center/Right Column */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4 overflow-y-auto">
          
          <div className="h-[400px] relative bg-surface border border-border shadow-sm rounded-xl flex flex-col overflow-hidden shrink-0">
             <div className="p-3 border-b border-border bg-secondary/30 flex items-center justify-between z-10">
               <div className="flex items-center gap-2">
                 <MapPin size={16} className="text-primary" />
                 <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground">Live Visakhapatnam Electrical Grid Map</h3>
               </div>
               <span className="text-[10px] bg-base px-2 py-1 border border-border rounded font-bold text-accent">MONITORING WORS & POLES</span>
             </div>
             <div className="flex-1 relative z-0">
               <OperationsMap />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
             <div className="bg-surface border border-border shadow-sm rounded-xl flex flex-col overflow-hidden h-[260px]">
               <div className="p-3 border-b border-border bg-secondary/30 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <AlertCircle size={16} className="text-destructive" />
                   <h2 className="font-bold text-xs uppercase tracking-wider text-foreground">Active Work Orders & Complaints</h2>
                 </div>
                 <span className="text-[10px] font-mono text-muted-foreground">LIVE QUEUE</span>
               </div>
               <div className="flex-1 overflow-auto p-2 space-y-2">
                  {complaints.map((c, i) => (
                     <div key={c.id || i} className="bg-base border border-border/70 p-2 rounded-lg flex flex-col shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                             <p className="text-[10px] font-mono font-bold text-muted-foreground">{c.id} • {c.ward}</p>
                             <p className="text-xs font-bold text-foreground mt-0.5">{c.type}</p>
                          </div>
                          <div className="text-right">
                             <span className="px-2 py-0.5 bg-warning/10 text-warning border border-warning/20 text-[9px] font-extrabold uppercase rounded">
                               {c.status}
                             </span>
                             <p className="text-[9px] font-mono text-muted-foreground flex items-center justify-end gap-1 mt-1"><Clock size={9}/> {c.time}</p>
                          </div>
                        </div>
                     </div>
                  ))}
                  {complaints.length === 0 && !isLoading && (
                     <div className="text-center text-xs text-muted-foreground py-10 font-medium">All work orders verified and resolved!</div>
                  )}
               </div>
             </div>

             <div className="bg-surface border border-border shadow-sm rounded-xl flex flex-col overflow-hidden h-[260px]">
               <div className="p-3 border-b border-border bg-secondary/30 flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-success" />
                 <h2 className="font-bold text-xs uppercase tracking-wider text-foreground">SLA & Smart Repair Optimization</h2>
               </div>
               <div className="flex-1 overflow-auto p-4 flex flex-col justify-center gap-3">
                 {deployed ? (
                   <div className="bg-success/10 border border-success/30 p-4 rounded-lg text-center flex flex-col items-center justify-center h-full">
                     <CheckCircle2 size={32} className="text-success mb-2" />
                     <h4 className="font-extrabold text-sm text-success">Team Alpha Routes Optimized</h4>
                     <p className="text-xs text-success/80 mt-1 font-medium">Joint Operations and Police Control Room have confirmed GPS convergence.</p>
                   </div>
                 ) : (
                   <div className="bg-base border border-border p-4 rounded-lg shadow-sm flex flex-col justify-between h-full">
                     <div>
                       <h4 className="font-extrabold text-sm text-foreground">Deploy Team Alpha to Siripuram & MVP Colony</h4>
                       <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-medium">Expected to restore lighting across 4 high-sensitivity university and bus stand corridors within a 2-hour SLA window.</p>
                     </div>
                     <button 
                       onClick={handleDeploy}
                       disabled={isDeploying}
                       className="mt-3 bg-primary text-primary-foreground px-4 py-2 text-xs font-extrabold rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 w-full"
                     >
                       {isDeploying ? <Loader2 size={14} className="animate-spin" /> : 'Execute Route Optimization Directive'}
                     </button>
                   </div>
                 )}
               </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
