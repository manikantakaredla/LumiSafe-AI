import React, { useState } from 'react'
import { Filter, AlertTriangle, CheckCircle2, Zap, Users, MapPin, Search, AlertCircle, Clock, Loader2 } from 'lucide-react'
import { OperationsMap } from '@/components/operations/OperationsMap'

export function ElectricalPage() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [assigningIndex, setAssigningIndex] = useState(null);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployed(true);
      // Simulate toast
      alert("Success! Team Alpha dispatched to Beach Road. Notification sent to Commissioner and Police Control Room.");
    }, 1500);
  };

  const repairQueue = [
    { priority: 'P1', ward: 'Ward 18', failed: 54, risk: 'Critical', action: 'Assign Team Now' },
    { priority: 'P2', ward: 'Ward 4', failed: 32, risk: 'High', action: 'Schedule Today' },
    { priority: 'P3', ward: 'Ward 11', failed: 12, risk: 'Medium', action: 'Monitor' },
  ];

  const fieldTeams = [
    { id: 'Team Alpha', status: deployed ? 'En Route' : 'Available', loc: deployed ? 'Beach Road (Ward 18)' : 'Headquarters', eta: deployed ? '18 mins' : '0 mins' },
    { id: 'Team Beta', status: 'Working', loc: 'Ward 4', eta: '32 mins' },
    { id: 'Team Gamma', status: 'Assigned', loc: 'Ward 11', eta: '52 mins' },
  ];

  const complaints = [
    { id: 'CMP-8821', ward: 'Ward 18', type: 'Pole Damaged', status: 'Pending', time: '10 mins ago' },
    { id: 'CMP-8820', ward: 'Ward 4', type: 'Flickering', status: 'Assigned', time: '45 mins ago' },
    { id: 'CMP-8819', ward: 'Ward 11', type: 'Light Not Working', status: 'Completed', time: '2 hours ago' },
  ];

  return (
    <div className="h-full w-full bg-base text-foreground flex flex-col overflow-y-auto font-sans">
      <div className="shrink-0 p-4 border-b border-border bg-surface flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <Zap className="text-primary" size={24} />
          <div>
            <h1 className="text-xl font-bold text-primary tracking-tight">Electrical Operations Dashboard</h1>
            <p className="text-sm text-muted-foreground">"Which lights should be repaired today?"</p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="bg-secondary/50 px-4 py-2 rounded-xl flex flex-col border border-border shadow-sm">
              <span className="text-[10px] uppercase text-muted-foreground font-bold">Total Lights</span>
              <span className="font-mono font-bold text-lg leading-none mt-1">152,000</span>
           </div>
           <div className="bg-success/10 px-4 py-2 rounded-xl flex flex-col border border-success/20 shadow-sm">
              <span className="text-[10px] uppercase text-success font-bold">Working</span>
              <span className="font-mono font-bold text-success text-lg leading-none mt-1">148,400</span>
           </div>
           <div className="bg-destructive/10 px-4 py-2 rounded-xl flex flex-col border border-destructive/20 shadow-sm">
              <span className="text-[10px] uppercase text-destructive font-bold">Defective</span>
              <span className="font-mono font-bold text-destructive text-lg leading-none mt-1">3,600</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
        
        {/* Left Column */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto">
          
          <div className="bg-surface border border-border shadow-sm rounded-xl flex flex-col overflow-hidden shrink-0">
            <div className="p-3 border-b border-border bg-primary/10 flex items-center gap-2">
              <AlertTriangle size={16} className="text-primary animate-pulse" />
              <h2 className="font-bold text-sm uppercase tracking-wider text-primary">AI Decision Engine</h2>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-foreground tracking-tight">Ward 18 Priority Directive</h3>
                  <span className="inline-block mt-1 px-2 py-1 bg-destructive/10 text-destructive text-[10px] font-bold uppercase rounded border border-destructive/20">Critical Risk Level</span>
                </div>
                <div className="text-right">
                   <p className="text-3xl font-black text-destructive leading-none">54</p>
                   <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Failed Lights</p>
                </div>
              </div>

              <div className="bg-base border border-border rounded-lg p-4 mt-2 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">AI Risk Correlation Factors</p>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                     <span className="text-destructive mt-0.5">•</span>
                     <span><strong>2 Major Bus Stops</strong> fall within the primary darkness zone.</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className="text-destructive mt-0.5">•</span>
                     <span><strong>3 Women's Colleges</strong> have reported safety concerns in adjacent streets.</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className="text-warning mt-0.5">•</span>
                     <span>Historical data predicts a <strong>68% spike</strong> in petty crime if unresolved within 48h.</span>
                  </li>
                </ul>
              </div>

              {!deployed ? (
                <div className="mt-2 flex flex-col gap-3 animate-in slide-in-from-bottom-2 duration-300">
                  <p className="text-sm font-semibold text-foreground bg-primary/5 p-3 rounded border border-primary/20">
                    <strong className="text-primary">AI Recommendation:</strong> Immediate deployment of Team Alpha is mathematically optimal to reduce projected incidents by 42%.
                  </p>
                  
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={handleDeploy}
                      disabled={isDeploying}
                      className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      {isDeploying ? <Loader2 size={16} className="animate-spin" /> : 'Execute Autonomous Deployment'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 bg-success/10 border border-success/30 p-4 rounded-lg flex items-center gap-3 animate-in fade-in duration-300">
                  <CheckCircle2 size={24} className="text-success shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-success">AI Directive Executed</h4>
                    <p className="text-xs text-success/80 mt-0.5">Team Alpha dispatched. Risk mitigation in progress.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface border border-border shadow-sm rounded-xl flex flex-col overflow-hidden shrink-0">
            <div className="p-3 border-b border-border bg-secondary/30 flex items-center gap-2">
              <Users size={16} className="text-primary" />
              <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Field Team Tracking</h2>
            </div>
            <div className="p-3 space-y-3">
              {fieldTeams.map((team, i) => (
                <div key={i} className={`bg-base border border-border p-2 rounded-lg flex justify-between items-center shadow-sm transition-all ${team.id === 'Team Alpha' && deployed ? 'border-primary ring-1 ring-primary/30' : ''}`}>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{team.id}</h4>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1"><MapPin size={10}/> {team.loc}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold uppercase ${team.status === 'Available' ? 'text-success' : team.status === 'Working' ? 'text-warning' : 'text-primary'}`}>{team.status}</span>
                    <p className="text-[10px] font-mono text-muted-foreground mt-1">ETA: {team.eta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Center/Right Column */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4 overflow-y-auto">
          
          <div className="h-[400px] relative bg-surface border border-border shadow-sm rounded-xl flex flex-col overflow-hidden shrink-0">
             <div className="p-3 border-b border-border bg-secondary/30 flex items-center justify-between z-10">
               <div className="flex items-center gap-2">
                 <MapPin size={16} className="text-primary" />
                 <h3 className="text-sm font-bold text-foreground">Road Priority Map</h3>
               </div>
               <span className="text-[10px] bg-base px-2 py-1 border border-border rounded font-bold text-muted-foreground">Showing Roads, Patrols & Teams</span>
             </div>
             <div className="flex-1 relative z-0">
               <OperationsMap />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
             <div className="bg-surface border border-border shadow-sm rounded-xl flex flex-col overflow-hidden h-[250px]">
               <div className="p-3 border-b border-border bg-secondary/30 flex items-center gap-2">
                 <AlertCircle size={16} className="text-destructive" />
                 <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Complaint Management</h2>
               </div>
               <div className="flex-1 overflow-auto p-2 space-y-2">
                  {complaints.map((c, i) => (
                     <div key={c.id} className="bg-base border border-border p-2 rounded-lg flex justify-between items-start shadow-sm transition-all">
                        <div>
                           <p className="text-[10px] font-bold text-muted-foreground">{c.id} • {c.ward}</p>
                           <p className="text-xs font-bold text-foreground mt-0.5">{c.type}</p>
                        </div>
                        <div className="text-right">
                           <span className={`text-[10px] font-bold uppercase ${c.status === 'Completed' ? 'text-success' : (i === 0 && deployed) || c.status === 'Assigned' ? 'text-primary' : 'text-warning'}`}>
                             {(i === 0 && deployed) ? 'Assigned' : c.status}
                           </span>
                           <p className="text-[10px] text-muted-foreground flex items-center justify-end gap-1 mt-1"><Clock size={10}/> {c.time}</p>
                        </div>
                     </div>
                  ))}
               </div>
             </div>

             <div className="bg-surface border border-border shadow-sm rounded-xl flex flex-col overflow-hidden h-[250px]">
               <div className="p-3 border-b border-border bg-secondary/30 flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-success" />
                 <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Smart Repair Recommendations</h2>
               </div>
               <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
                 {deployed ? (
                   <div className="bg-success/10 border border-success/30 p-4 rounded-lg shadow-sm text-center flex flex-col items-center justify-center h-full">
                     <CheckCircle2 size={32} className="text-success mb-2" />
                     <h4 className="font-bold text-sm text-success">Team Alpha Dispatched</h4>
                     <p className="text-xs text-success/80 mt-1">Joint Operations and Police Control Room notified.</p>
                   </div>
                 ) : (
                   <div className="bg-base border border-border p-3 rounded-lg shadow-sm">
                     <h4 className="font-bold text-sm text-foreground">Deploy Team Alpha to Beach Road</h4>
                     <p className="text-xs text-muted-foreground mt-1">Expected to resolve 54 critical defects and reduce ward risk score by 42%.</p>
                     <button 
                       onClick={handleDeploy}
                       disabled={isDeploying}
                       className="mt-3 bg-primary text-primary-foreground px-4 py-2 text-xs font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 w-full"
                     >
                       {isDeploying ? <Loader2 size={14} className="animate-spin" /> : 'Execute Deployment'}
                     </button>
                   </div>
                 )}
               </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  )
}
