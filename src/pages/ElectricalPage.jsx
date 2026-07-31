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
            <div className="p-3 border-b border-border bg-secondary/30 flex items-center gap-2">
              <AlertTriangle size={16} className="text-warning" />
              <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Priority Repair Queue</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/10 border-b border-border">
                  <tr>
                    <th className="p-2 font-semibold text-muted-foreground">Priority</th>
                    <th className="p-2 font-semibold text-muted-foreground">Ward</th>
                    <th className="p-2 font-semibold text-muted-foreground">Failed</th>
                    <th className="p-2 font-semibold text-muted-foreground">Risk</th>
                    <th className="p-2 font-semibold text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {repairQueue.map((r, i) => (
                    <React.Fragment key={i}>
                      <tr className={`hover:bg-base transition-colors ${i === 0 && deployed ? 'opacity-50' : ''}`}>
                        <td className="p-2 font-mono font-bold text-destructive">{r.priority}</td>
                        <td className="p-2 font-medium">{r.ward}</td>
                        <td className="p-2 font-mono text-muted-foreground">{r.failed}</td>
                        <td className="p-2">
                           <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${r.risk === 'Critical' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                            {r.risk.toUpperCase()}
                          </span>
                        </td>
                        <td 
                          className="p-2 text-primary font-medium cursor-pointer hover:underline"
                          onClick={() => {
                            if (i === 0 && !deployed && r.action === 'Assign Team Now') {
                              setAssigningIndex(assigningIndex === i ? null : i);
                            }
                          }}
                        >
                          {i === 0 && deployed ? 'Dispatched' : r.action}
                        </td>
                      </tr>
                      {assigningIndex === i && (
                        <tr className="bg-secondary/10">
                          <td colSpan="5" className="p-3 border-t border-border">
                             <div className="flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Select Available Field Team</span>
                                <div className="flex gap-3 overflow-x-auto pb-1">
                                  <button 
                                    onClick={() => { handleDeploy(); setAssigningIndex(null); }} 
                                    className="bg-surface border border-border px-4 py-2 rounded-lg shadow-sm hover:border-primary hover:bg-primary/5 transition-all text-left min-w-[140px]"
                                  >
                                    <span className="block text-sm font-bold text-foreground">Team Alpha</span>
                                    <span className="block text-[10px] font-semibold text-success mt-1">Available • ETA 18m</span>
                                  </button>
                                  <button 
                                    disabled
                                    className="bg-surface border border-border px-4 py-2 rounded-lg shadow-sm opacity-50 cursor-not-allowed text-left min-w-[140px]"
                                  >
                                    <span className="block text-sm font-bold text-foreground">Team Beta</span>
                                    <span className="block text-[10px] font-semibold text-warning mt-1">Working • ETA 2h</span>
                                  </button>
                                  <button 
                                    disabled
                                    className="bg-surface border border-border px-4 py-2 rounded-lg shadow-sm opacity-50 cursor-not-allowed text-left min-w-[140px]"
                                  >
                                    <span className="block text-sm font-bold text-foreground">Team Gamma</span>
                                    <span className="block text-[10px] font-semibold text-primary mt-1">Assigned • ETA 52m</span>
                                  </button>
                                </div>
                             </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
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
