import React from 'react'
import { ShieldCheck, MapPin, AlertTriangle, CheckCircle2, TrendingUp, AlertCircle, Activity, BarChart2 } from 'lucide-react'
import { CompactKPIs } from '@/components/commissioner/CompactKPIs'
import { OperationsMap } from '@/components/operations/OperationsMap'
import { useNavigate } from 'react-router-dom'

export function CommissionerPage() {
  const navigate = useNavigate();

  const highRiskWards = [
    { rank: 1, ward: 'Ward 14 - Madhurawada', failed: 32, incidents: 12, correlation: 'Strong (0.88)', score: '94/100', priority: 'Critical', action: 'Electrical Dispatch' },
    { rank: 2, ward: 'Ward 4 - MVP Colony', failed: 28, incidents: 9, correlation: 'Strong (0.82)', score: '89/100', priority: 'High', action: 'Schedule Maintenance' },
    { rank: 3, ward: 'Ward 11 - Gajuwaka', failed: 21, incidents: 8, correlation: 'Moderate (0.79)', score: '84/100', priority: 'High', action: 'Joint Operation' },
    { rank: 4, ward: 'Ward 2 - Bheemili', failed: 18, incidents: 5, correlation: 'Moderate (0.74)', score: '78/100', priority: 'Medium', action: 'Monitor' },
    { rank: 5, ward: 'Ward 9 - Pendurthi', failed: 15, incidents: 4, correlation: 'Weak (0.48)', score: '72/100', priority: 'Medium', action: 'Monitor' },
  ];

  const alerts = [
    { id: 1, ward: 'Ward 14', type: 'Critical', text: '32 Street Lights Failed in Sector B. Incident spike detected.' },
    { id: 2, ward: 'Ward 7', type: 'Warning', text: 'Repair Delayed by 4 Hours. SLA breached.' },
    { id: 3, ward: 'Ward 18', type: 'Critical', text: 'New Women Safety Concern reported in unlit area.' },
  ];

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-6 overflow-y-auto bg-base font-sans text-foreground">
      
      {/* Banner */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">GVMC Smart Street Lighting & Women's Safety Decision Support System</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-4xl leading-relaxed">
            Identify high-risk wards by correlating defective street lights with women's safety incidents so that GVMC can prioritize repairs, manpower, and budget before incidents increase.
          </p>
        </div>
      </div>

      <div className="space-y-6 animate-in fade-in duration-300">
        
        {/* Section 1: Today's Priority */}
        <div className="bg-surface border-l-4 border-l-destructive border border-border shadow-sm rounded-r p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-destructive" />
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Today's Priority</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Ward</p>
              <p className="text-base font-bold text-foreground">Ward 14 (Madhurawada)</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Reason (Why high risk?)</p>
              <p className="text-sm font-medium text-destructive">32 Failed Lights correlating with 12 Incidents</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Expected Impact</p>
              <p className="text-sm font-medium text-success">High (+18% Safety Recovery)</p>
            </div>
            <div className="flex items-end">
              <button 
                onClick={() => navigate('/app/street-lights')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs py-2.5 rounded shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} /> Assign Electrical Team
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Executive KPIs */}
        <div>
           <CompactKPIs />
        </div>

        {/* Section 3: Large Ward Risk Heatmap */}
        <div className="bg-surface border border-border rounded shadow-sm flex flex-col h-[500px]">
           <div className="p-3 border-b border-border/50 bg-secondary/30 flex items-center justify-between">
             <div className="flex items-center gap-2">
               <MapPin size={16} className="text-primary" />
               <h3 className="text-sm font-bold text-foreground">Ward Risk Heatmap</h3>
             </div>
             <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive block"></span> Critical (Red)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning block"></span> High (Orange)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500 block"></span> Medium (Yellow)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success block"></span> Low (Green)</span>
             </div>
           </div>
           <div className="flex-1 relative z-0">
             <OperationsMap />
           </div>
        </div>

        {/* Section 4: Top 10 High Risk Wards */}
        <div className="bg-surface border border-border rounded shadow-sm">
           <div className="p-3 border-b border-border/50 bg-secondary/30 flex items-center gap-2">
             <TrendingUp size={16} className="text-destructive" />
             <h3 className="text-sm font-bold text-foreground">Top 10 High Risk Wards</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-xs">
               <thead className="bg-secondary/20">
                 <tr>
                   <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
                   <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider">Ward</th>
                   <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider">Risk Score</th>
                   <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider">Failed Lights</th>
                   <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider">Safety Incidents</th>
                   <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
                   <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider text-right">View Map</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                 {highRiskWards.map(row => (
                   <tr key={row.rank} className="hover:bg-base transition-colors group cursor-pointer" onClick={() => navigate('/app/operations')}>
                     <td className="p-3 font-mono font-bold text-muted-foreground group-hover:text-primary">#{row.rank}</td>
                     <td className="p-3 font-medium text-foreground group-hover:text-primary">{row.ward}</td>
                     <td className="p-3 font-mono font-bold text-destructive">{row.score}</td>
                     <td className="p-3 font-mono text-warning">{row.failed}</td>
                     <td className="p-3 font-mono text-destructive">{row.incidents}</td>
                     <td className="p-3">
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${row.priority === 'Critical' ? 'bg-destructive/10 text-destructive border-destructive/20' : row.priority === 'High' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                         {row.priority.toUpperCase()}
                       </span>
                     </td>
                     <td className="p-3 text-right text-primary font-medium group-hover:underline">Locate on Map</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Grid for Correlation, Alerts, Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Section 5: Correlation Analysis */}
          <div className="bg-surface border border-border rounded-xl shadow-sm flex flex-col h-[340px]">
            <div className="p-3 border-b border-border bg-secondary/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-foreground">Correlation Analysis</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Pearson = 0.84</span>
            </div>
            <div className="flex-1 p-4 flex flex-col">
               <div className="text-center mb-3">
                 <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Street Lights vs Women's Safety</p>
                 <p className="text-[10px] text-muted-foreground">Strong Positive Correlation: As defective lights increase, incidents increase.</p>
               </div>
               
               {/* Mock Scatter Plot */}
               <div className="flex-1 relative border-l border-b border-border mx-4 mb-2 flex items-end justify-start">
                  <span className="absolute -left-6 bottom-1/2 -rotate-90 text-[8px] font-bold text-muted-foreground tracking-widest uppercase">Incidents</span>
                  <span className="absolute left-1/2 -bottom-5 -translate-x-1/2 text-[8px] font-bold text-muted-foreground tracking-widest uppercase">Failed Lights</span>
                  
                  {/* Scatter Dots - simulating a positive trend */}
                  <div className="absolute bottom-[10%] left-[10%] w-1.5 h-1.5 rounded-full bg-success"></div>
                  <div className="absolute bottom-[15%] left-[20%] w-1.5 h-1.5 rounded-full bg-success"></div>
                  <div className="absolute bottom-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-success"></div>
                  <div className="absolute bottom-[35%] left-[40%] w-1.5 h-1.5 rounded-full bg-warning"></div>
                  <div className="absolute bottom-[30%] left-[45%] w-1.5 h-1.5 rounded-full bg-warning"></div>
                  <div className="absolute bottom-[45%] left-[50%] w-1.5 h-1.5 rounded-full bg-warning"></div>
                  <div className="absolute bottom-[60%] left-[70%] w-1.5 h-1.5 rounded-full bg-destructive"></div>
                  <div className="absolute bottom-[75%] left-[80%] w-1.5 h-1.5 rounded-full bg-destructive"></div>
                  <div className="absolute bottom-[85%] left-[90%] w-1.5 h-1.5 rounded-full bg-destructive"></div>
                  <div className="absolute bottom-[90%] left-[85%] w-1.5 h-1.5 rounded-full bg-destructive shadow-[0_0_8px_rgba(185,28,28,0.5)]"></div>
                  
                  {/* Trendline */}
                  <div className="absolute bottom-0 left-0 w-[120%] h-0.5 bg-primary/20 origin-bottom-left -rotate-[40deg]"></div>
               </div>
            </div>
          </div>

          {/* Section 6: Smart Alerts */}
          <div className="bg-surface border border-border rounded-xl shadow-sm h-[340px] flex flex-col">
            <div className="p-3 border-b border-border/50 bg-secondary/30 flex items-center gap-2">
              <AlertCircle size={16} className="text-warning" />
              <h3 className="text-sm font-bold text-foreground">Smart Alerts</h3>
            </div>
            <div className="p-3 space-y-3 overflow-y-auto flex-1">
              {alerts.map(a => (
                <div key={a.id} className="flex flex-col gap-1 border-b border-border/50 pb-2 last:border-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${a.type === 'Critical' ? 'text-destructive' : 'text-warning'}`}>{a.type} | {a.ward}</span>
                  <span className="text-xs text-foreground font-medium leading-relaxed">{a.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Recommended Actions */}
          <div className="bg-surface border border-border rounded-xl shadow-sm h-[340px] flex flex-col bg-primary/5">
            <div className="p-3 border-b border-border/50 bg-secondary/30 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-foreground">Recommended Actions</h3>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-center">
               <h4 className="font-bold text-sm text-foreground mb-1">Ward 14 (Critical)</h4>
               <p className="text-xs text-muted-foreground mb-3">54 defective lights, 12 incidents</p>
               <ul className="space-y-2 mb-4">
                 <li className="text-xs font-medium text-foreground flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary block"></span> Repair Beach Road</li>
                 <li className="text-xs font-medium text-foreground flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary block"></span> Repair MVP Colony</li>
               </ul>
               <button 
                 onClick={() => navigate('/app/operations')}
                 className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs py-2 rounded shadow-sm transition-colors mt-auto"
               >
                 Execute Joint Operation
               </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
