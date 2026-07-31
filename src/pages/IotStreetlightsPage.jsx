import React, { useState } from 'react'
import { Activity, MapPin, Zap, AlertTriangle, Filter, Search, Loader2 } from 'lucide-react'
import { GVMC_ZONES } from '@/lib/constants'

export function IotStreetlightsPage() {
  const [filter, setFilter] = useState('All');
  
  const telemetryData = [
    { id: 'SL-1023', loc: 'Beach Road', ward: 'Ward 18', status: 'OFF', reason: 'Lamp Failure', power: '0 W', volts: '0V', reported: '10:32 PM' },
    { id: 'SL-1024', loc: 'MVP Colony Sector 4', ward: 'Ward 4', status: 'OFF', reason: 'Low Voltage', power: '15 W', volts: '110V', reported: '10:45 PM' },
    { id: 'SL-1025', loc: 'Siripuram Junction', ward: 'Ward 11', status: 'OFF', reason: 'Controller Offline', power: '-- W', volts: '--V', reported: '09:15 PM' },
    { id: 'SL-1026', loc: 'Tenneti Park', ward: 'Ward 18', status: 'ON', reason: 'Healthy', power: '120 W', volts: '230V', reported: 'Live' },
    { id: 'SL-1027', loc: 'Kailasagiri Road', ward: 'Ward 4', status: 'ON', reason: 'Healthy', power: '120 W', volts: '228V', reported: 'Live' },
    { id: 'SL-1028', loc: 'Seethammadhara', ward: 'Ward 14', status: 'OFF', reason: 'Lamp Failure', power: '0 W', volts: '0V', reported: '11:05 PM' },
  ];

  const filteredData = filter === 'All' 
    ? telemetryData 
    : telemetryData.filter(d => d.status === filter || d.reason.includes(filter));

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-6 overflow-y-auto bg-base text-foreground font-sans">
      <div className="shrink-0 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight flex items-center gap-2">
            <Activity /> Smart IoT Streetlights Telemetry
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Real-time power consumption, voltage, and hardware failure analytics.</p>
        </div>
      </div>

      {/* High-level IoT Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
         <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Active IoT Nodes</p>
           <p className="text-2xl font-black text-foreground">12,450</p>
         </div>
         <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
           <p className="text-[10px] font-bold text-success uppercase tracking-wider mb-1">Healthy (ON)</p>
           <p className="text-2xl font-black text-success">12,396</p>
         </div>
         <div className="bg-surface border border-destructive/30 rounded-xl p-4 shadow-sm bg-destructive/5">
           <p className="text-[10px] font-bold text-destructive uppercase tracking-wider mb-1">Hardware Failures (OFF)</p>
           <p className="text-2xl font-black text-destructive">54</p>
         </div>
         <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
           <p className="text-[10px] font-bold text-warning uppercase tracking-wider mb-1">Total Power Draw</p>
           <p className="text-2xl font-black text-warning">1.48 MW</p>
         </div>
      </div>

      {/* Telemetry Data Table */}
      <div className="flex-1 bg-surface border border-border shadow-sm rounded-xl flex flex-col overflow-hidden">
         <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search Pole ID..." className="bg-base border border-border rounded-lg pl-8 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-64" />
              </div>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-base border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none"
              >
                 <option value="All">All Statuses</option>
                 <option value="OFF">Failures (OFF)</option>
                 <option value="Lamp Failure">Lamp Failures</option>
                 <option value="Low Voltage">Low Voltage</option>
              </select>
           </div>
         </div>
         
         <div className="flex-1 overflow-x-auto">
           <table className="w-full text-left text-sm">
             <thead className="bg-secondary/10 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
               <tr>
                 <th className="p-4 font-bold">Pole ID</th>
                 <th className="p-4 font-bold">Location</th>
                 <th className="p-4 font-bold">Status</th>
                 <th className="p-4 font-bold">Diagnostics Reason</th>
                 <th className="p-4 font-bold">Power</th>
                 <th className="p-4 font-bold">Voltage</th>
                 <th className="p-4 font-bold text-right">Reported Time</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
               {filteredData.map((data, i) => (
                 <tr key={i} className="hover:bg-base transition-colors">
                   <td className="p-4 font-mono font-bold text-primary flex items-center gap-2">
                     <Zap size={14} /> {data.id}
                   </td>
                   <td className="p-4">
                     <span className="font-semibold text-foreground block">{data.loc}</span>
                     <span className="text-xs text-muted-foreground">{data.ward}</span>
                   </td>
                   <td className="p-4">
                     <span className={`px-2 py-1 rounded text-[10px] font-bold ${data.status === 'ON' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                       {data.status}
                     </span>
                   </td>
                   <td className="p-4 font-medium text-foreground">{data.reason}</td>
                   <td className="p-4 font-mono text-xs">{data.power}</td>
                   <td className="p-4 font-mono text-xs">{data.volts}</td>
                   <td className="p-4 text-right text-xs text-muted-foreground">{data.reported}</td>
                 </tr>
               ))}
               {filteredData.length === 0 && (
                 <tr>
                   <td colSpan="7" className="p-8 text-center text-muted-foreground">No telemetry data matches your filters.</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  )
}
