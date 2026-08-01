import React, { useEffect, useState } from 'react'
import { ShieldCheck, MapPin, AlertTriangle, CheckCircle2, TrendingUp, AlertCircle, Activity, BarChart2, Loader2, RefreshCw, Sparkles, ArrowRight, ShieldAlert, Cpu } from 'lucide-react'
import { CompactKPIs } from '@/components/commissioner/CompactKPIs'
import { OperationsMap } from '@/components/operations/OperationsMap'
import { useNavigate } from 'react-router-dom'

export function CommissionerPage() {
  const navigate = useNavigate();

  const [topPriority, setTopPriority] = useState({
    ward: 'Ward 24 (Siripuram & AU Campus)',
    reason: 'Pole SL-2042 voltage anomaly outside Women\'s College + High footfall zone',
    impact: 'Critical Index 99 (+28% Safety Recovery upon repair)',
    assetId: 'SL-2042'
  });

  const [highRiskWards, setHighRiskWards] = useState([
    { rank: 1, ward: 'Ward 24 - Siripuram & AU Campus', failed: 4, incidents: 2, correlation: 'Strong (0.94)', score: '99/100', priority: 'Critical', action: 'Electrical Dispatch' },
    { rank: 2, ward: 'Ward 18 - MVP Colony Sector 1-4', failed: 2, incidents: 1, correlation: 'Strong (0.88)', score: '89/100', priority: 'High', action: 'Schedule Maintenance' },
    { rank: 3, ward: 'Ward 32 - RTC Complex & Asilmetta', failed: 2, incidents: 1, correlation: 'Moderate (0.82)', score: '78/100', priority: 'High', action: 'Joint Operation' },
    { rank: 4, ward: 'Ward 88 - Gajuwaka Steel Plant Junction', failed: 1, incidents: 1, correlation: 'Moderate (0.74)', score: '72/100', priority: 'Medium', action: 'Monitor Patrol' },
    { rank: 5, ward: 'Ward 71 - Kancharapalem Railway Hub', failed: 1, incidents: 1, correlation: 'Weak (0.65)', score: '70/100', priority: 'Medium', action: 'Monitor Patrol' },
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, ward: 'Ward 24', type: 'Critical', time: '2m ago', text: 'Pole SL-2042 voltage blinking outside St. Joseph\'s Women\'s College corridor.' },
    { id: 2, ward: 'Ward 32', type: 'Critical', time: '8m ago', text: 'Pitch darkness alarm at RTC Complex Central Bus Stand Shelter-2.' },
    { id: 3, ward: 'Ward 18', type: 'Warning', time: '14m ago', text: 'Pole SL-1023 lamp failure reported on MVP Colony Main Road.' },
    { id: 4, ward: 'Ward 45', type: 'Warning', time: '22m ago', text: 'Feeder cabinet line disruption near Beach Road junction.' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const fetchCommissionerAnalytics = async () => {
    setIsLoading(true);
    try {
      const riskRes = await fetch('http://localhost:5000/api/v1/police/darkness-risk');
      if (riskRes.ok) {
        const riskData = await riskRes.json();
        const items = riskData.data || [];
        if (items.length > 0) {
          const first = items[0];
          setTopPriority({
            ward: first.wardName || first.zone || 'Ward 24 (Siripuram)',
            reason: `${first.failureReason || 'Lighting fault'} outside ${first.sensitivityCategory ? first.sensitivityCategory.replace(/_/g, ' ') : 'vulnerable corridor'}`,
            impact: `Critical Index ${first.darknessRiskIndex || 95}/100 (Immediate Action Req)`,
            assetId: first.assetId || 'SL-2042'
          });

          const formattedWards = items.slice(0, 6).map((item, idx) => ({
            rank: idx + 1,
            ward: `${item.wardName || 'Ward Area'} (${item.roadName || 'Main Corridor'})`,
            failed: item.powerWatts === 0 ? 'Off (0W)' : 'Low Voltage',
            incidents: item.darknessRiskIndex > 85 ? '2 Zones' : '1 Zone',
            correlation: item.darknessRiskIndex > 85 ? 'High (0.94)' : 'Mod (0.80)',
            score: `${item.darknessRiskIndex || 88}/100`,
            priority: item.darknessRiskIndex >= 85 || item.riskLevel === 'CRITICAL' ? 'Critical' : 'High',
            action: item.darknessRiskIndex >= 85 ? 'Instant Dispatch' : 'Assign SLA'
          }));
          setHighRiskWards(formattedWards);
        }
      }

      const compRes = await fetch('http://localhost:5000/api/v1/complaints');
      if (compRes.ok) {
        const compData = await compRes.json();
        const latestComplaints = (compData.data || []).slice(0, 5).map((c, idx) => ({
          id: c.complaintId || c._id,
          ward: c.location?.coordinates ? `GPS [${c.location.coordinates[1].toFixed(2)}, ${c.location.coordinates[0].toFixed(2)}]` : `Ward ${(idx % 15) + 12}`,
          type: c.priority === 'Critical' ? 'Critical' : 'Warning',
          time: `${(idx + 1) * 3}m ago`,
          text: `${c.category || 'Light Failure'}: ${c.description || 'Immediate inspection required by municipal crew.'}`
        }));
        if (latestComplaints.length > 0) setAlerts(latestComplaints);
      }
    } catch (err) {
      console.error('[Commissioner Dashboard] Error querying live Atlas data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissionerAnalytics();
    const interval = setInterval(fetchCommissionerAnalytics, 25000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col gap-6 overflow-y-auto bg-base font-sans text-foreground scrollbar-thin scrollbar-thumb-border">
      
      {/* Executive Header Banner */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-5 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Atlas Real-time Telemetry Active
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-bold">
              <Cpu size={12} /> AI Copilot Engine On
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <span>GVMC Municipal Decision Intelligence Command</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-4xl leading-relaxed">
            Correlating street lighting failures with public safety vulnerability zones across Visakhapatnam Wards.
          </p>
        </div>
        
        <button 
          onClick={fetchCommissionerAnalytics} 
          disabled={isLoading}
          className="bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold px-4 py-2.5 rounded-lg border border-border flex items-center gap-2 shadow-sm transition-all hover:border-border-strong hover:shadow active:scale-95 shrink-0 self-start sm:self-center"
        >
          <RefreshCw size={15} className={isLoading ? 'animate-spin text-primary' : 'text-muted-foreground'} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      <div className="space-y-7 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Section 1: Today's Priority Highlight Card */}
        <div className="bg-gradient-to-r from-surface-elevated via-surface to-surface-elevated border-l-4 border-l-rose-500 border border-border/80 shadow-md rounded-xl p-5 relative overflow-hidden transition-all hover:border-slate-700/80 hover:shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-border/40 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <AlertTriangle size={18} className="animate-bounce" />
              </div>
              <h3 className="font-black text-sm text-foreground uppercase tracking-wider">Today's Highest Darkness Risk Corridor (Instant AI Action Req)</h3>
            </div>
            <span className="bg-rose-500/15 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-mono font-black shadow-xs">
              POLE ASSET: {topPriority.assetId}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Target Municipal Ward</p>
              <p className="text-base font-extrabold text-foreground tracking-tight">{topPriority.ward}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Vulnerability Analysis</p>
              <p className="text-sm font-bold text-rose-400 leading-snug">{topPriority.reason}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">AI Projected Impact</p>
              <p className="text-sm font-bold text-emerald-400">{topPriority.impact}</p>
            </div>
            <div className="flex items-center justify-end">
              <button 
                onClick={() => navigate('/app/street-lights')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-4 py-3 rounded-lg shadow-sm hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>Dispatch Emergency Crew</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Executive KPIs */}
        <div>
          <CompactKPIs />
        </div>

        {/* Section 3: Live Ward Risk Heatmap & Spatial Inspection */}
        <div className="bg-surface-elevated/70 border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-[530px] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border/60 bg-surface/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
                <MapPin size={17} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Visakhapatnam Operational Map & GIS Point-in-Polygon Overlay</h3>
                <p className="text-[11px] text-muted-foreground">Interactive Ward boundaries, defective lighting infrastructure, and live patrol vehicle telemetry</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-wider">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300">
                <span className="w-2 h-2 rounded-full bg-rose-500 block"></span> Critical Ward
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-500 block"></span> Warning Zone
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300">
                <span className="w-2 h-2 rounded-full bg-blue-500 block"></span> Patrol Unit
              </span>
            </div>
          </div>
          <div className="flex-1 relative z-0">
            <OperationsMap />
          </div>
        </div>

        {/* Section 4: Live AI Darkness Risk Assessment Table */}
        <div className="bg-surface-elevated/70 border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="px-5 py-4 border-b border-border/60 bg-surface/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg">
                <TrendingUp size={17} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">AI Darkness & Crime Risk Ranking</h3>
                <p className="text-[11px] text-muted-foreground">Prioritizing municipal repair schedules based on real-time public vulnerability scores</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-black text-purple-300 bg-purple-500/15 border border-purple-500/30 px-3 py-1 rounded-full">
              DRI ENGINE: ACTIVE
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 text-muted-foreground font-mono text-[11px]">
                <tr>
                  <th className="py-3.5 px-5 font-bold uppercase tracking-wider">Rank</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Ward & Landmark Corridor</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Darkness Index</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Lighting Faults</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Vulnerability Profile</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Priority Level</th>
                  <th className="py-3.5 px-5 font-bold uppercase tracking-wider text-right">Action Directive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-sans">
                {highRiskWards.map(row => (
                  <tr 
                    key={row.rank} 
                    onClick={() => navigate('/app/operations')}
                    className="hover:bg-secondary/50 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-5 font-mono font-black text-muted-foreground group-hover:text-primary transition-colors">#{row.rank}</td>
                    <td className="py-3.5 px-4 font-bold text-foreground group-hover:text-primary transition-colors">{row.ward}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-black text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-md">
                        {row.score}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{row.failed}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-300">{row.incidents}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                        row.priority === 'Critical' ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold text-primary group-hover:underline flex items-center justify-end gap-1">
                      <span>{row.action}</span>
                      <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grid for Correlation, Alerts, Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Section 5: Correlation Analysis Card */}
          <div className="bg-surface-elevated/70 border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-[360px] overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border/60 bg-surface/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-blue-400" />
                <h3 className="text-sm font-bold text-foreground">Crime vs Darkness Correlation</h3>
              </div>
              <span className="text-[10px] font-mono font-black text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
                Pearson = 0.91
              </span>
            </div>
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div className="text-center mb-2">
                <p className="text-xs font-black text-foreground uppercase tracking-wide mb-1">Unlit Duration vs Security Incidents</p>
                <p className="text-[11px] text-muted-foreground leading-tight">High statistical correlation in MVP Colony and RTC Complex transit shelters.</p>
              </div>
               
              <div className="flex-1 relative border-l-2 border-b-2 border-border/80 mx-4 my-3 flex items-end justify-start">
                <span className="absolute -left-7 bottom-1/2 -rotate-90 text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Incident Risk</span>
                <span className="absolute left-1/2 -bottom-5 -translate-x-1/2 text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Unlit Hours</span>
                
                <div className="absolute bottom-[15%] left-[12%] w-2 h-2 rounded-full bg-emerald-400 shadow-sm"></div>
                <div className="absolute bottom-[25%] left-[24%] w-2 h-2 rounded-full bg-emerald-400 shadow-sm"></div>
                <div className="absolute bottom-[40%] left-[44%] w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm"></div>
                <div className="absolute bottom-[60%] left-[62%] w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm"></div>
                <div className="absolute bottom-[82%] left-[78%] w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.7)] animate-pulse"></div>
                <div className="absolute bottom-[92%] left-[90%] w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                
                <div className="absolute bottom-0 left-0 w-[115%] h-0.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 origin-bottom-left -rotate-[40deg] opacity-60"></div>
              </div>
              <p className="text-[10px] font-mono text-center text-muted-foreground">Model trained on Visakhapatnam 2024-2026 civic records</p>
            </div>
          </div>

          {/* Section 6: Smart Alerts Feed */}
          <div className="bg-surface-elevated/70 border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-[360px] flex flex-col overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border/60 bg-surface/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-amber-400" />
                <h3 className="text-sm font-bold text-foreground">Live IoT & Citizen Alerts</h3>
              </div>
              <span className="text-[10px] font-mono font-black text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                REAL-TIME
              </span>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-border">
              {alerts.map((a, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate('/app/operations')}
                  className="group flex flex-col gap-1.5 p-3 rounded-xl bg-surface/50 border border-border/50 hover:bg-secondary/40 hover:border-border transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                      a.type === 'Critical' ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}>
                      {a.type} | {a.ward}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">{a.time || 'Just now'}</span>
                  </div>
                  <span className="text-xs text-foreground group-hover:text-primary transition-colors font-medium leading-normal">{a.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Automated Override Action Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-blue-500/40 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 h-[360px] flex flex-col overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="px-4 py-3.5 border-b border-border/60 bg-surface/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-400" />
                <h3 className="text-sm font-bold text-foreground">AI Automated Intervention</h3>
              </div>
              <span className="text-[10px] font-mono font-black text-blue-300 bg-blue-500/20 border border-blue-500/40 px-2.5 py-0.5 rounded-full">
                GEMINI POWERED
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
              <div>
                <h4 className="font-black text-base text-foreground mb-1 flex items-center gap-2">
                  <span>{topPriority.ward}</span>
                </h4>
                <p className="text-xs font-semibold text-rose-300/90 mb-4 leading-relaxed">{topPriority.reason}</p>
                <div className="bg-surface/80 p-3.5 rounded-xl border border-border/70 space-y-2.5 shadow-inner">
                  <div className="text-[11px] font-bold text-foreground flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mt-1 shrink-0"></span> 
                    <span><strong>Action 1:</strong> Dispatch Alpha Electrical Crew to target Asset {topPriority.assetId}</span>
                  </div>
                  <div className="text-[11px] font-bold text-foreground flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 mt-1 shrink-0"></span> 
                    <span><strong>Action 2:</strong> Route Rakshan Women Patrol Unit (P-MVP-101) to oversee unlit zone</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/app/operations')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs py-3 rounded-xl shadow-md hover:shadow-blue-500/25 transition-all mt-4 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                <span>Execute Joint Intervention Protocol</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
