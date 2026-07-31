import React from 'react'
import { AlertTriangle, CheckCircle2, Zap } from 'lucide-react'

export function OperationsBrief() {
  return (
    <div className="bg-surface border-t-2 border-t-primary border border-border shadow-sm rounded-b-md">
      <div className="p-4 flex items-start justify-between border-b border-border/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-warning" />
            <h2 className="text-base font-semibold text-foreground tracking-tight">IMMEDIATE ACTION REQUIRED</h2>
          </div>
          <p className="text-sm text-muted-foreground">Highest operational priority identified by AI Engine</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold border border-primary/20">
          <Zap size={14} />
          98% AI CONFIDENCE
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
        <div>
          <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider mb-1">Priority Ward</p>
          <p className="font-medium text-foreground">Ward 4 - Madhurawada</p>
        </div>
        <div className="col-span-2">
          <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider mb-1">Recommended Action</p>
          <p className="font-medium text-warning">Dispatch Electrical Team Alpha to fix 14 cascaded street light failures.</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider mb-1">Safety Impact</p>
          <p className="font-medium text-success">+18% Sector Safety Index</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider mb-1">Required Budget</p>
          <p className="font-mono text-foreground font-medium">₹ 45,000</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider mb-1">Expected Completion</p>
          <p className="font-mono text-foreground font-medium">Within 4 Hours</p>
        </div>
      </div>

      <div className="px-4 py-3 bg-secondary/20 border-t border-border/50">
        <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider mb-2">Why this recommendation?</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-surface border border-border text-xs text-foreground rounded">Highest complaint density</span>
          <span className="px-2 py-1 bg-surface border border-border text-xs text-foreground rounded">Highest women safety impact</span>
          <span className="px-2 py-1 bg-surface border border-border text-xs text-foreground rounded">14 failed street lights</span>
          <span className="px-2 py-1 bg-surface border border-border text-xs text-foreground rounded">Nearest repair team (1.2km)</span>
        </div>
      </div>

      <div className="p-3 bg-base border-t flex items-center justify-end gap-3 rounded-b-md">
        <button className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors">
          Reject AI Recommendation
        </button>
        <button className="px-6 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded font-medium text-sm transition-colors flex items-center gap-2">
          <CheckCircle2 size={16} />
          Approve & Dispatch Team
        </button>
      </div>
    </div>
  )
}
