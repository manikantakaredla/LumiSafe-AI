import React from 'react'
import { useAppStore } from '@/store/useAppStore'
import { CheckCircle2, Clock, AlertTriangle, Route, Wrench, ShieldAlert } from 'lucide-react'

export function ElectricalSupervisor() {
  const { publicReports, openDrawer } = useAppStore()
  
  const workOrders = publicReports.filter(r => !!r.workOrderId)
  const pendingWO = workOrders.filter(w => !w.engineerStatus || w.engineerStatus === 'UNASSIGNED' || w.engineerStatus === 'ASSIGNED' || w.engineerStatus === 'ACCEPTED')
  const activeWO = workOrders.filter(w => ['NAVIGATING', 'ARRIVED', 'REPAIRING', 'EVIDENCE_PENDING', 'VERIFYING'].includes(w.engineerStatus))
  const blockedWO = workOrders.filter(w => w.engineerStatus === 'BLOCKED' || w.engineerStatus === 'MANUAL_REVIEW_REQUIRED')
  const completedWO = workOrders.filter(w => w.engineerStatus === 'RESOLVED' || w.engineerStatus === 'CLOSED')
  const criticalWO = workOrders.filter(w => w.priority === 'Critical' && !['RESOLVED', 'CLOSED'].includes(w.engineerStatus))

  const handleOptimize = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/v1/workorders/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      const data = await res.json();
      if (data.success) {
        console.log('[Supervisor] Route Optimization complete:', data.data);
      } else {
        alert(data.message || "Failed to optimize routes");
      }
    } catch (err) {
      console.error('[Supervisor] Optimization error:', err);
    }
  }

  const TeamCard = ({ name, status, activeTask, eta }) => (
    <div className="bg-surface border border-border p-3 rounded flex flex-col gap-2">
      <div className="flex justify-between items-center border-b border-border/50 pb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-success' : 'bg-warning'}`} />
          <span className="font-bold text-sm text-foreground">{name}</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">{status}</span>
      </div>
      <div className="text-xs">
        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">Active Task</span>
          <span className="font-medium text-info">{activeTask || 'None'}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-muted-foreground">ETA</span>
          <span className="font-mono text-foreground">{eta || '--'}</span>
        </div>
      </div>
    </div>
  )

  const WOCard = ({ wo }) => (
    <div 
      className="bg-surface border border-border p-3 rounded hover:bg-secondary/50 cursor-pointer transition-colors"
      onClick={() => openDrawer(`WO: ${wo.workOrderId}`, 'Work Order', wo.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-foreground text-sm">{wo.workOrderId}</h4>
          <span className="text-[10px] text-muted-foreground uppercase">{wo.category}</span>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${wo.priority === 'Critical' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
          {wo.priority}
        </div>
      </div>
      <div className="flex justify-between text-xs mt-2 pt-2 border-t border-border/50">
        <span className="text-info font-medium">{wo.assignedTeam || 'Unassigned'}</span>
        <span className="text-foreground font-mono">{wo.engineerStatus || 'Pending'}</span>
      </div>
    </div>
  )

  return (
    <div className="h-full p-4 lg:p-6 animate-in fade-in flex flex-col overflow-hidden font-sans">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Electrical Operations Workspace</h1>
          <p className="text-sm text-muted-foreground">Supervisor Command View</p>
        </div>
        <button 
          onClick={handleOptimize}
          className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Route size={16} /> AI Optimize Routes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
        <div className="bg-surface-elevated border border-border p-4 rounded shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs uppercase font-semibold">Pending WO</span>
            <Clock size={16} />
          </div>
          <p className="text-2xl font-mono text-foreground font-medium">{pendingWO.length}</p>
        </div>
        <div className="bg-surface-elevated border border-border p-4 rounded shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs uppercase font-semibold">Active Crews</span>
            <Wrench size={16} />
          </div>
          <p className="text-2xl font-mono text-info font-medium">{activeWO.length > 0 ? 1 : 0}</p>
        </div>
        <div className="bg-surface-elevated border border-border p-4 rounded shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs uppercase font-semibold">Completed Today</span>
            <CheckCircle2 size={16} />
          </div>
          <p className="text-2xl font-mono text-success font-medium">{completedWO.length}</p>
        </div>
        <div className="bg-destructive/5 border border-destructive/20 p-4 rounded shadow-sm">
          <div className="flex items-center justify-between text-destructive mb-2">
            <span className="text-xs uppercase font-semibold">Blocked Crews</span>
            <AlertTriangle size={16} />
          </div>
          <p className="text-2xl font-mono text-destructive font-bold">{blockedWO.length}</p>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded shadow-sm">
          <div className="flex items-center justify-between text-destructive mb-2">
            <span className="text-xs uppercase font-semibold">Critical Escalations</span>
            <ShieldAlert size={16} />
          </div>
          <p className="text-2xl font-mono text-destructive font-bold">{criticalWO.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Teams Overview */}
        <div className="bg-surface border border-border rounded shadow-sm flex flex-col min-h-0">
          <div className="p-3 border-b border-border bg-base shrink-0">
            <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">Live Team Status</h3>
          </div>
          <div className="p-3 overflow-y-auto space-y-3 flex-1">
            <TeamCard 
              name="Alpha Team" 
              status={activeWO.length > 0 ? "Active" : "Standby"} 
              activeTask={activeWO.length > 0 ? activeWO[0].workOrderId : null}
              eta={activeWO.length > 0 ? "14 Mins" : "--"}
            />
            <TeamCard name="Beta Team" status="Standby" activeTask={null} eta="--" />
            <TeamCard name="Gamma Team" status="Offline" activeTask={null} eta="--" />
          </div>
        </div>

        {/* Action Queue */}
        <div className="bg-surface border border-border rounded shadow-sm flex flex-col min-h-0 lg:col-span-2">
          <div className="p-3 border-b border-border bg-base shrink-0 flex items-center justify-between">
            <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">Today's Work Queue</h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-secondary text-[10px] rounded text-muted-foreground uppercase font-bold tracking-wider cursor-pointer hover:bg-secondary/80">Pending</span>
              <span className="px-2 py-1 bg-secondary text-[10px] rounded text-muted-foreground uppercase font-bold tracking-wider cursor-pointer hover:bg-secondary/80">Active</span>
            </div>
          </div>
          <div className="p-3 overflow-y-auto flex-1 bg-base/50">
            {workOrders.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm flex-col gap-2">
                <AlertTriangle size={24} className="opacity-50" />
                No work orders generated today.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workOrders.map(wo => <WOCard key={wo.id} wo={wo} />)}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
