import React from 'react'
import { X } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import { VerificationReport } from '@/components/electrical/VerificationReport'

export function RightDrawer() {
  const { rightDrawer, closeDrawer } = useAppStore()

  const renderWard = () => (
    <div className="space-y-4 text-sm">
      <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
        <span className="text-muted-foreground uppercase text-[11px] font-semibold">Safety Score</span>
        <span className="font-mono text-xl text-success font-medium">88.2</span>
      </div>
      <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
        <span className="text-muted-foreground uppercase text-[11px] font-semibold">Pending Complaints</span>
        <span className="font-mono text-destructive">14</span>
      </div>
      <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
        <span className="text-muted-foreground uppercase text-[11px] font-semibold">Broken Lights</span>
        <span className="font-mono text-warning">8</span>
      </div>
      <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
        <span className="text-muted-foreground uppercase text-[11px] font-semibold">Required Budget</span>
        <span className="font-mono text-foreground">₹ 1,45,000</span>
      </div>
      <div className="bg-primary/10 border border-primary/20 p-3 rounded">
        <p className="text-[11px] text-primary uppercase font-bold mb-1">AI Recommendation</p>
        <p className="text-xs text-foreground">Deploy 2 additional Police Patrols to Sector 3 to mitigate rising incidents. Schedule immediate electrical maintenance.</p>
        <div className="mt-2 pt-2 border-t border-primary/10 flex justify-between text-[11px]">
          <span className="text-muted-foreground font-mono">CONF: 94%</span>
          <span className="text-success font-medium uppercase tracking-wider">+4.5% Safety</span>
        </div>
      </div>
    </div>
  )

  const renderStreetLight = () => (
    <div className="space-y-4 text-sm">
      <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
        <span className="text-muted-foreground uppercase text-[11px] font-semibold">Status</span>
        <span className="font-mono text-destructive flex items-center gap-1.5"><span className="w-2 h-2 bg-destructive rounded-sm"/> FAILED</span>
      </div>
      <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
        <span className="text-muted-foreground uppercase text-[11px] font-semibold">Assigned Team</span>
        <span className="font-mono text-info font-medium">Alpha Electrical</span>
      </div>
      <div className="bg-surface border rounded p-3 text-xs">
        <p className="text-muted-foreground mb-1 uppercase text-[10px] font-semibold tracking-wider">Complaint History</p>
        <p className="text-foreground">Reported dead on 12/Oct by Citizen App. Verified by AI vision node.</p>
      </div>
      <div className="flex gap-2">
         <button className="flex-1 bg-primary text-primary-foreground py-1.5 rounded text-xs font-semibold hover:bg-primary/90 transition-colors">Dispatch Team</button>
      </div>
    </div>
  )

  const renderIncident = () => (
    <div className="space-y-4 text-sm">
      <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
        <span className="text-muted-foreground uppercase text-[11px] font-semibold">Priority</span>
        <span className="font-mono text-destructive font-bold uppercase">Critical</span>
      </div>
      <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
        <span className="text-muted-foreground uppercase text-[11px] font-semibold">Time Logged</span>
        <span className="font-mono text-foreground">12:44 PM</span>
      </div>
      <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
        <span className="text-muted-foreground uppercase text-[11px] font-semibold">Assigned Officer</span>
        <span className="font-mono text-info font-medium">Hawk Unit 1</span>
      </div>
      <div className="bg-surface border rounded p-3 text-xs">
        <p className="text-muted-foreground mb-1 uppercase text-[10px] font-semibold tracking-wider">Evidence</p>
        <div className="w-full h-24 bg-secondary flex items-center justify-center rounded text-muted-foreground/50 border border-border/50">
           [Image Placeholder]
        </div>
      </div>
    </div>
  )

  const renderTeam = () => (
    <div className="space-y-4 text-sm">
      <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
        <span className="text-muted-foreground uppercase text-[11px] font-semibold">Current Activity</span>
        <span className="font-mono text-success">En Route to WO-14</span>
      </div>
      <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
        <span className="text-muted-foreground uppercase text-[11px] font-semibold">Today's Progress</span>
        <span className="font-mono text-foreground">4 / 6 Tasks Completed</span>
      </div>
      <div className="bg-surface border rounded p-3 text-xs">
        <p className="text-muted-foreground mb-2 uppercase text-[10px] font-semibold tracking-wider">Assigned Route</p>
        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-success"/> <span className="font-mono text-muted-foreground">WO-11 (Done)</span></div>
        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-warning"/> <span className="font-mono text-foreground">WO-14 (In Progress)</span></div>
        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full border border-border"/> <span className="font-mono text-muted-foreground">WO-16 (Pending)</span></div>
      </div>
    </div>
  )

  const renderWorkOrder = () => {
    const { publicReports } = useAppStore.getState()
    const workOrder = publicReports.find(r => r.id === rightDrawer.entityId)
    
    if (!workOrder) return <div className="text-muted-foreground p-4">Work Order not found.</div>

    return (
      <div className="space-y-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
            <span className="text-muted-foreground uppercase text-[11px] font-semibold">Priority</span>
            <span className={`font-mono font-bold uppercase ${workOrder.priority === 'Critical' ? 'text-destructive' : 'text-warning'}`}>{workOrder.priority}</span>
          </div>
          <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
            <span className="text-muted-foreground uppercase text-[11px] font-semibold">Status</span>
            <span className="font-mono text-foreground font-medium">{workOrder.status}</span>
          </div>
          <div className="flex justify-between items-baseline border-b border-border/50 pb-2">
            <span className="text-muted-foreground uppercase text-[11px] font-semibold">Engineer Status</span>
            <span className="font-mono text-info">{workOrder.engineerStatus || 'Pending'}</span>
          </div>
        </div>

        {/* If there's verification data, show the report */}
        {workOrder.verificationDetails && (
          <VerificationReport workOrder={workOrder} />
        )}
      </div>
    )
  }

  // Placeholder content based on entityType
  const renderContent = () => {
    if (!rightDrawer.entityType) return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        No entity selected.
      </div>
    )

    switch(rightDrawer.entityType) {
      case 'Ward': return renderWard()
      case 'Street Light': return renderStreetLight()
      case 'Incident': 
      case 'Complaint': return renderIncident()
      case 'Repair Team':
      case 'Police Patrol': return renderTeam()
      case 'Work Order': return renderWorkOrder()
      default: return (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          No operational data available for this entity type.
        </div>
      )
    }
  }

  return (
    <>
      {/* Backdrop (optional, we can make it non-blocking if we want a true push drawer, but overlay is safer for now) */}
      {rightDrawer.isOpen && (
        <div 
          className="fixed inset-0 bg-background/50 z-30 lg:hidden"
          onClick={closeDrawer}
        />
      )}
      
      {/* Drawer Panel */}
      <div 
        className={cn(
          "fixed top-12 right-0 bottom-0 w-80 sm:w-96 bg-surface-elevated border-l z-40 transition-transform duration-300 ease-out shadow-2xl flex flex-col",
          rightDrawer.isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-foreground truncate pr-4">
            {rightDrawer.title || 'Details'}
          </h2>
          <button 
            onClick={closeDrawer}
            className="p-1 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground shrink-0"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </>
  )
}
