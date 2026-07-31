import React, { useState } from 'react'
import { Filter, Search, Eye, AlertCircle } from 'lucide-react'

export function ComplaintsRegister() {
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const mockComplaints = [
    { id: 'GRV-2026-1049', ward: 'Ward 14', status: 'Pending', priority: 'High', date: 'Oct 12, 2026', officer: 'Unassigned', desc: 'Street lights not working near bus stop for 3 days.' },
    { id: 'GRV-2026-1048', ward: 'Ward 4', status: 'In Progress', priority: 'Medium', date: 'Oct 12, 2026', officer: 'K. Raju', desc: 'Flickering lights in MVP sector 2.' },
    { id: 'GRV-2026-1047', ward: 'Ward 11', status: 'Resolved', priority: 'High', date: 'Oct 11, 2026', officer: 'M. Shiva', desc: 'Complete blackout in main road.' },
  ];

  return (
    <div className="h-full flex overflow-hidden bg-base font-sans text-foreground">
      <div className={`flex-1 flex flex-col p-4 md:p-6 overflow-y-auto ${selectedComplaint ? 'pr-4' : ''}`}>
        <div className="shrink-0 mb-6 border-b border-border/50 pb-2">
          <h1 className="text-xl font-bold text-primary tracking-tight">Public Grievance Register</h1>
          <p className="text-sm text-muted-foreground mt-1">Centralized registry of citizen complaints regarding street lighting infrastructure.</p>
        </div>

        {/* Filters */}
        <div className="bg-surface border border-border shadow-sm rounded-md p-4 mb-4 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Search Grievance ID</label>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
              <input type="text" className="w-full bg-base border border-border rounded pl-8 pr-3 py-1.5 text-sm" placeholder="e.g. GRV-2026-..." />
            </div>
          </div>
          <div className="w-40">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Ward</label>
            <select className="w-full bg-base border border-border rounded px-3 py-1.5 text-sm">
              <option>All Wards</option>
              <option>Ward 14</option>
              <option>Ward 4</option>
            </select>
          </div>
          <div className="w-40">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Status</label>
            <select className="w-full bg-base border border-border rounded px-3 py-1.5 text-sm">
              <option>All</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>
          <button className="bg-secondary text-foreground border border-border rounded px-4 py-1.5 text-sm font-semibold flex items-center gap-2 hover:bg-secondary/80 shadow-sm">
            <Filter size={14} /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="bg-surface border border-border shadow-sm rounded-md overflow-hidden flex-1">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/20 border-b border-border/50">
              <tr>
                <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider">Grievance ID</th>
                <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider">Ward</th>
                <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
                <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider">Date Logged</th>
                <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider">Assigned Officer</th>
                <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockComplaints.map(c => (
                <tr key={c.id} className="hover:bg-base cursor-pointer transition-colors" onClick={() => setSelectedComplaint(c)}>
                  <td className="p-3 font-mono font-bold text-primary">{c.id}</td>
                  <td className="p-3 font-medium text-foreground">{c.ward}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${c.status === 'Pending' ? 'bg-destructive/10 text-destructive border-destructive/20' : c.status === 'Resolved' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                      {c.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground font-semibold">{c.priority}</td>
                  <td className="p-3 text-muted-foreground">{c.date}</td>
                  <td className="p-3 text-muted-foreground">{c.officer}</td>
                  <td className="p-3 text-right">
                    <button className="text-primary hover:bg-primary/10 p-1.5 rounded transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel */}
      {selectedComplaint && (
        <div className="w-80 border-l border-border bg-surface p-4 flex flex-col overflow-y-auto shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-2">
            <h2 className="font-bold text-lg text-foreground">Grievance Details</h2>
            <button onClick={() => setSelectedComplaint(null)} className="text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors">Close</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ID</label>
              <p className="font-mono font-bold text-primary">{selectedComplaint.id}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Location</label>
              <p className="text-sm font-medium">{selectedComplaint.ward}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</label>
              <p className="text-sm font-medium">{selectedComplaint.status}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Description</label>
              <p className="text-sm bg-base p-3 rounded border border-border/50 mt-1 text-muted-foreground">{selectedComplaint.desc}</p>
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Take Action</label>
              <button className="w-full bg-primary text-primary-foreground font-semibold text-sm py-2 shadow-sm rounded hover:bg-primary/90 mb-2 transition-colors">Assign Team</button>
              <button className="w-full bg-secondary text-foreground font-semibold text-sm py-2 border border-border rounded shadow-sm hover:bg-secondary/80 transition-colors">Escalate to Supervisor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
