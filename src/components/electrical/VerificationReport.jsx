import React from 'react'
import { CheckCircle2, XCircle, ShieldAlert, Image as ImageIcon, MapPin, Clock, Package } from 'lucide-react'
import { eventBus, EVENTS } from '@/engine/eventBus'
import { useAppStore } from '@/store/useAppStore'

export function VerificationReport({ workOrder }) {
  const { confidenceScore, verificationDetails, status } = workOrder
  
  if (!verificationDetails) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        No verification data available yet.
      </div>
    )
  }

  const handleOverride = (action) => {
    if (action === 'APPROVE') {
      eventBus.publish(EVENTS.REPORT_RESOLVED, { reportId: workOrder.id })
    } else {
      eventBus.publish(EVENTS.REPAIR_REJECTED, { reportId: workOrder.id })
      // And reset engineer status or re-assign
      useAppStore.getState().updateReportState(workOrder.id, { 
        status: 'Assigned to Electrical Dept', 
        engineerStatus: 'Pending',
        confidenceScore: null,
        verificationDetails: null
      })
    }
  }

  const { checks } = verificationDetails
  
  return (
    <div className="space-y-4 font-sans animate-in fade-in">
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1">AI Evidence Audit</h3>
        <p className="text-xs text-muted-foreground">Digital Quality Assurance Report</p>
      </div>

      {/* Confidence Score Header */}
      <div className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 ${confidenceScore >= 85 ? 'bg-success/10 border-success/30 text-success' : 'bg-destructive/10 border-destructive/30 text-destructive'}`}>
        <span className="text-4xl font-mono font-bold">{confidenceScore}%</span>
        <span className="text-xs uppercase font-bold tracking-wider">Overall Confidence</span>
      </div>

      {/* Before / After Placeholder */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="aspect-square bg-secondary rounded border border-border flex flex-col items-center justify-center text-muted-foreground gap-2 overflow-hidden relative">
          <ImageIcon size={20} className="opacity-50" />
          <span className="text-[10px] font-semibold uppercase">Before Repair</span>
        </div>
        <div className="aspect-square bg-secondary rounded border border-border flex flex-col items-center justify-center text-muted-foreground gap-2 overflow-hidden relative">
          <ImageIcon size={20} className="opacity-50" />
          <span className="text-[10px] font-semibold uppercase">After Repair</span>
          {checks.photoPresence && (
             <div className="absolute top-2 right-2 bg-background rounded-full p-0.5 text-success">
                <CheckCircle2 size={12} />
             </div>
          )}
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-surface border rounded-xl overflow-hidden text-sm mt-4">
        <div className="px-3 py-2 bg-base border-b text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Verification Checks
        </div>
        
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <div className="flex items-center gap-2 text-foreground">
            <MapPin size={16} className="text-muted-foreground" />
            <span>GPS Match</span>
          </div>
          {checks.gpsMatch ? <CheckCircle2 size={16} className="text-success" /> : <XCircle size={16} className="text-destructive" />}
        </div>
        
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <div className="flex items-center gap-2 text-foreground">
            <Clock size={16} className="text-muted-foreground" />
            <span>Timestamp Logical</span>
          </div>
          {checks.timestampValid ? <CheckCircle2 size={16} className="text-success" /> : <XCircle size={16} className="text-destructive" />}
        </div>

        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2 text-foreground">
            <Package size={16} className="text-muted-foreground" />
            <span>Inventory Recorded</span>
          </div>
          {checks.inventoryRecorded ? <CheckCircle2 size={16} className="text-success" /> : <XCircle size={16} className="text-destructive" />}
        </div>
      </div>

      {/* Manual Override Actions */}
      {status === 'Needs Review' && (
        <div className="mt-6 pt-4 border-t border-border space-y-3">
          <div className="flex items-start gap-2 text-warning mb-4">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <p className="text-xs">Confidence below threshold. Manual supervisor review is required before this incident can be resolved.</p>
          </div>
          <button 
            onClick={() => handleOverride('APPROVE')}
            className="w-full py-2 bg-success text-success-foreground font-bold rounded hover:bg-success/90 transition-colors"
          >
            Force Approve Repair
          </button>
          <button 
            onClick={() => handleOverride('REJECT')}
            className="w-full py-2 bg-destructive text-destructive-foreground font-bold rounded hover:bg-destructive/90 transition-colors"
          >
            Reject Evidence & Reassign
          </button>
        </div>
      )}
    </div>
  )
}
