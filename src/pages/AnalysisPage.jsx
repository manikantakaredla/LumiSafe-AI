import React from 'react'
import { ShieldAlert, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react'

export function AnalysisPage() {
  const correlationData = [
    { rank: 1, ward: 'Ward 14 - Madhurawada', failed: 32, incidents: 12, correlation: '88%', score: '94/100', priority: 'Immediate Repair' },
    { rank: 2, ward: 'Ward 4 - MVP Colony', failed: 28, incidents: 9, correlation: '82%', score: '89/100', priority: 'High Priority' },
    { rank: 3, ward: 'Ward 11 - Gajuwaka', failed: 21, incidents: 8, correlation: '79%', score: '84/100', priority: 'High Priority' },
    { rank: 4, ward: 'Ward 2 - Bheemili', failed: 18, incidents: 5, correlation: '74%', score: '78/100', priority: 'Standard Priority' },
    { rank: 5, ward: 'Ward 9 - Pendurthi', failed: 15, incidents: 4, correlation: '68%', score: '72/100', priority: 'Standard Priority' },
  ];

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-6 overflow-y-auto bg-base">
      <div className="shrink-0 flex items-center justify-between border-b border-border/50 pb-2">
        <div>
          <h1 className="text-xl font-bold text-primary tracking-tight">Lighting & Safety Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">Official GVMC report correlating street lighting infrastructure with public safety incidents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border shadow-sm rounded flex flex-col h-[300px]">
          <div className="p-3 border-b border-border/50 bg-secondary/30 flex items-center gap-2">
            <AlertTriangle size={16} className="text-warning" />
            <h3 className="text-sm font-bold text-foreground">Street Light Failure Density</h3>
          </div>
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs bg-muted/20">
            [Density Heatmap Placeholder]
          </div>
        </div>

        <div className="bg-surface border border-border shadow-sm rounded flex flex-col h-[300px]">
          <div className="p-3 border-b border-border/50 bg-secondary/30 flex items-center gap-2">
            <ShieldAlert size={16} className="text-destructive" />
            <h3 className="text-sm font-bold text-foreground">Women's Safety Incident Density</h3>
          </div>
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs bg-muted/20">
            [Incident Density Heatmap Placeholder]
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded shadow-sm">
        <div className="p-3 border-b border-border/50 bg-secondary/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">Correlation Table & Top 10 High Risk Wards</h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">R² = 0.84 HIGH CORRELATION</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/20 border-b border-border/50">
              <tr>
                <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
                <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider">Ward</th>
                <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider text-center">Failed Lights</th>
                <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider text-center">Safety Incidents</th>
                <th className="p-3 font-bold text-primary uppercase tracking-wider text-center bg-primary/5">Correlation</th>
                <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider text-center">Risk Score</th>
                <th className="p-3 font-semibold text-muted-foreground uppercase tracking-wider text-right">Recommended Repair Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {correlationData.map(row => (
                <tr key={row.rank} className="hover:bg-base transition-colors">
                  <td className="p-3 font-mono font-bold text-muted-foreground">#{row.rank}</td>
                  <td className="p-3 font-medium text-foreground">{row.ward}</td>
                  <td className="p-3 font-mono text-destructive text-center">{row.failed}</td>
                  <td className="p-3 font-mono text-warning text-center">{row.incidents}</td>
                  <td className="p-3 font-mono font-bold text-primary text-center bg-primary/5">{row.correlation}</td>
                  <td className="p-3 font-mono text-foreground text-center">{row.score}</td>
                  <td className="p-3 font-medium text-info text-right">{row.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
