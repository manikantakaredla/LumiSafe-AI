import React, { useState } from 'react'
import { FileText, Download, FileSpreadsheet, Calendar, TrendingUp, Users, Shield, Filter, Loader2, CheckCircle2, X, ChevronRight, ArrowLeft } from 'lucide-react'
import { GVMC_ZONES } from '@/lib/constants'

export function ReportsPage() {
  const [downloading, setDownloading] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleDownload = (id, type) => {
    setDownloading(`${id}-${type}`);
    setTimeout(() => {
      setDownloading(null);
      alert(`Success! Simulated download of ${type.toUpperCase()} report completed.`);
    }, 1500);
  };

  const handleApplyFilters = () => {
    setIsApplying(true);
    setTimeout(() => setIsApplying(false), 800);
  };

  const reports = [
    { id: 'daily', title: 'Daily Operations Report', desc: 'Summary of all complaints, active repairs, and closed issues for the last 24 hours.', icon: Calendar, count: 142, label: 'Records' },
    { id: 'weekly', title: 'Weekly Consolidation', desc: 'Trends in street lighting failures, safety metrics, and SLA compliance over 7 days.', icon: TrendingUp, count: 856, label: 'Records' },
    { id: 'ward', title: 'Ward Performance Matrix', desc: 'Detailed breakdown of high-risk wards, budget usage, and infrastructure health.', icon: Shield, count: 98, label: 'Wards' },
    { id: 'officer', title: 'Officer Efficiency Report', desc: 'Repair times, task completion rates, and dispatch tracking for electrical teams.', icon: Users, count: 14, label: 'Teams' },
  ];

  const mockDataRows = [
    { id: 'RPT-101', date: '2026-07-31', ward: 'Ward 18', status: 'Completed', metric: '98%' },
    { id: 'RPT-102', date: '2026-07-31', ward: 'Ward 4', status: 'Pending', metric: '45%' },
    { id: 'RPT-103', date: '2026-07-30', ward: 'Ward 11', status: 'Completed', metric: '100%' },
    { id: 'RPT-104', date: '2026-07-30', ward: 'Ward 22', status: 'In Progress', metric: '60%' },
    { id: 'RPT-105', date: '2026-07-29', ward: 'Ward 14', status: 'Completed', metric: '100%' },
  ];

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-6 overflow-y-auto bg-base text-foreground font-sans relative">
      <div className="shrink-0 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Official Reports</h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Generate and export official GVMC MIS reports.</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-surface border border-border shadow-sm rounded-xl p-6 flex flex-wrap gap-4 items-end shrink-0">
        <div className="w-48">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Ward</label>
          <select className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
            <option>All Wards</option>
            {GVMC_ZONES.map(zone => (
              <optgroup key={zone.name} label={zone.name}>
                {zone.wards.map(ward => (
                  <option key={ward} value={ward}>{ward}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="w-48">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Date Range</label>
          <select className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Custom Range...</option>
          </select>
        </div>
        <div className="w-48">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Category</label>
          <select className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
            <option>All Categories</option>
            <option>Street Lights</option>
            <option>Women's Safety</option>
          </select>
        </div>
        <button 
          onClick={handleApplyFilters}
          disabled={isApplying}
          className="bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 h-[38px] w-32 justify-center"
        >
          {isApplying ? <Loader2 size={16} className="animate-spin" /> : <><Filter size={16} /> Apply</>}
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        {reports.map(report => (
          <div 
            key={report.id} 
            onClick={() => setSelectedReport(report)}
            className="bg-surface border border-border shadow-sm rounded-xl p-6 flex gap-4 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group relative overflow-hidden"
          >
            {isApplying && (
               <div className="absolute inset-0 bg-base/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
                 <Loader2 className="animate-spin text-primary" size={24} />
               </div>
            )}
            <div className="bg-secondary/50 p-3 rounded-xl h-fit border border-border group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
              <report.icon size={24} className="text-primary" />
            </div>
            <div className="flex-1 flex flex-col">
              <h3 className="font-bold text-foreground text-base mb-1 group-hover:text-primary transition-colors">{report.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1 pr-12">{report.desc}</p>
              
              <div className="flex gap-4 mt-auto items-center">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-foreground leading-none">{isApplying ? '-' : report.count}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{report.label}</span>
                </div>
                <div className="ml-auto text-primary font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Data <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Data Modal / Overlay */}
      {selectedReport && (
        <div className="absolute inset-0 bg-base/80 backdrop-blur-sm z-50 p-4 flex items-center justify-center">
          <div className="bg-surface border border-border rounded-2xl shadow-xl w-full max-w-4xl max-h-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex justify-between items-start bg-secondary/20">
              <div className="flex gap-4 items-center">
                <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
                  <selectedReport.icon size={28} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedReport.title} Data Preview</h2>
                  <p className="text-sm text-muted-foreground mt-1">Showing top 5 records of {selectedReport.count} total.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedReport(null);
                  setSelectedRecord(null);
                }} 
                className="text-muted-foreground hover:bg-secondary p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Data Table or Record Detail */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedRecord ? (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <button 
                    onClick={() => setSelectedRecord(null)}
                    className="text-primary font-semibold text-sm flex items-center gap-1 mb-6 hover:underline"
                  >
                    <ArrowLeft size={16} /> Back to Data Table
                  </button>
                  
                  <div className="bg-base border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start border-b border-border pb-4 mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                          Record ID: <span className="font-mono text-primary">{selectedRecord.id}</span>
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">Generated on {selectedRecord.date}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded text-sm font-bold ${selectedRecord.status === 'Completed' ? 'bg-success/10 text-success' : selectedRecord.status === 'Pending' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>
                        {selectedRecord.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Location Information</p>
                        <p className="font-medium text-foreground">{selectedRecord.ward}</p>
                        <p className="text-sm text-muted-foreground mt-1">Primary Grid Sector 4, Beach Road</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Performance Metric</p>
                        <p className="font-black text-2xl text-foreground">{selectedRecord.metric}</p>
                        <p className="text-sm text-muted-foreground mt-1">SLA Compliance Rate</p>
                      </div>
                    </div>

                    <div>
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Detailed Notes</p>
                       <div className="bg-surface border border-border p-4 rounded-lg text-sm text-foreground">
                         <p className="mb-2"><strong>Inspector:</strong> K. Ramesh (Team Alpha)</p>
                         <p className="mb-2"><strong>Issue:</strong> Major infrastructure failure detected due to severe weather. Correlation engine flagged this sector as high risk for women's safety incidents.</p>
                         <p><strong>Action Taken:</strong> 14 LED luminaires replaced, 2 smart poles re-wired. Verification complete. Risk score normalized.</p>
                       </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-secondary/30 border-b border-border">
                      <tr>
                        <th className="p-3 font-semibold text-muted-foreground rounded-tl-lg">Record ID</th>
                        <th className="p-3 font-semibold text-muted-foreground">Date</th>
                        <th className="p-3 font-semibold text-muted-foreground">Location</th>
                        <th className="p-3 font-semibold text-muted-foreground">Status</th>
                        <th className="p-3 font-semibold text-muted-foreground rounded-tr-lg">Metric</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockDataRows.map((row, i) => (
                        <tr 
                          key={i} 
                          onClick={() => setSelectedRecord(row)}
                          className="hover:bg-primary/5 transition-colors cursor-pointer group"
                        >
                          <td className="p-3 font-mono text-primary font-bold group-hover:underline">{row.id}</td>
                          <td className="p-3">{row.date}</td>
                          <td className="p-3 font-medium">{row.ward}</td>
                          <td className="p-3">
                             <span className={`px-2 py-1 rounded text-xs font-bold ${row.status === 'Completed' ? 'bg-success/10 text-success' : row.status === 'Pending' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>
                               {row.status}
                             </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-foreground">{row.metric}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer / Download Actions */}
            <div className="p-6 border-t border-border bg-secondary/10 flex justify-end gap-4">
              <button 
                onClick={() => handleDownload(selectedReport.id, 'pdf')}
                disabled={downloading !== null}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm w-40"
              >
                {downloading === `${selectedReport.id}-pdf` ? <Loader2 size={18} className="animate-spin" /> : <><Download size={18} /> Export PDF</>}
              </button>
              <button 
                onClick={() => handleDownload(selectedReport.id, 'excel')}
                disabled={downloading !== null}
                className="bg-surface text-foreground hover:bg-secondary border border-border px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm w-40"
              >
                {downloading === `${selectedReport.id}-excel` ? <Loader2 size={18} className="animate-spin" /> : <><FileSpreadsheet size={18} /> Export Excel</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
