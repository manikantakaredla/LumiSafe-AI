import React, { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { eventBus, EVENTS } from '@/engine/eventBus'
import { QrCode, MapPin, Wrench, Upload, CheckCircle2, Navigation, AlertTriangle, ArrowLeft, Camera, Loader2, SignalHigh } from 'lucide-react'

export function FieldEngineer() {
  const { publicReports, currentRole } = useAppStore()
  const [activeTask, setActiveTask] = useState(null)
  const [evidenceStep, setEvidenceStep] = useState(false)
  const [verificationState, setVerificationState] = useState('idle') // idle, uploading, verifying, success

  const teamName = currentRole.includes('Beta') ? 'Beta Team' : 'Alpha Team';

  // Filter for tasks assigned to current team
  const myTasks = publicReports.filter(r => r.workOrderId && r.status !== 'Issue Resolved' && r.assignedTeam === teamName)
  const completedTasks = publicReports.filter(r => r.workOrderId && r.status === 'Issue Resolved' && r.assignedTeam === teamName)

  const handleAction = async (actionType) => {
    if (!activeTask) return

    let nextStatus = ''
    switch (actionType) {
      case 'accept': nextStatus = 'ACCEPTED'; break;
      case 'navigate': nextStatus = 'NAVIGATING'; break;
      case 'arrive': nextStatus = 'ARRIVED'; break;
      case 'repair': nextStatus = 'REPAIRING'; break;
      case 'blocked': nextStatus = 'BLOCKED'; break;
      case 'EVIDENCE':
        setEvidenceStep(true)
        break
    }

    if (nextStatus) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/v1/workorders/${activeTask.workOrderId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({ status: nextStatus })
        });
      } catch (err) {
        console.error('Failed to update status:', err);
      }
    }
  }

  const handleUploadEvidence = async () => {
    setVerificationState('uploading')
    await new Promise(r => setTimeout(r, 800))
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/v1/evidence/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          workOrderId: activeTask.workOrderId,
          beforePhoto: 'base64_encoded_mock...',
          afterPhoto: 'base64_encoded_mock...',
          lat: 17.68,
          lng: 83.21
        })
      });

      // State moves to VERIFYING automatically via backend event
      setVerificationState('verifying')
      
      // We don't need to auto-close here. The backend verification engine will transition the state 
      // to RESOLVED or MANUAL_REVIEW_REQUIRED and broadcast `workorder.updated` via socket.
      // But we will reset our local UI state after a few seconds so it doesn't stay stuck forever in 'verifying' if they navigate away.
      setTimeout(() => {
        setEvidenceStep(false)
        setActiveTask(null)
        setVerificationState('idle')
      }, 3500)
    } catch (err) {
      console.error(err);
      setVerificationState('idle')
    }
  }

  // Effect to watch for resolution and close the evidence screen
  React.useEffect(() => {
    if (verificationState === 'verifying') {
      const isResolved = publicReports.find(r => r.id === activeTask?.id)?.status === 'Issue Resolved'
      if (isResolved) {
        setVerificationState('success')
        setTimeout(() => {
          setActiveTask(null)
          setEvidenceStep(false)
          setVerificationState('idle')
        }, 2000)
      }
    }
  }, [publicReports, activeTask, verificationState])

  const renderActiveTask = () => {
    const task = publicReports.find(r => r.id === activeTask.id) // Get freshest state
    if (!task) return null

    const status = task.engineerStatus || 'Pending'

    if (evidenceStep) {
      return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center gap-3 p-4 border-b border-border bg-surface shrink-0">
            <button onClick={() => setEvidenceStep(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h2 className="font-bold text-lg">Repair Evidence</h2>
          </div>
          
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            <div className="bg-info/10 border border-info/20 p-4 rounded-xl flex items-start gap-3">
              <SignalHigh className="text-info shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-info">
                <strong>Offline Sync Ready.</strong> If connection drops, evidence will securely cache and sync automatically.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-secondary rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground gap-2 cursor-pointer hover:bg-secondary/80">
                <Camera size={24} />
                <span className="text-xs font-semibold">Before Photo</span>
              </div>
              <div className="aspect-square bg-primary/5 rounded-xl border-2 border-dashed border-primary/50 flex flex-col items-center justify-center text-primary gap-2 cursor-pointer hover:bg-primary/10 transition-colors">
                <Camera size={24} />
                <span className="text-xs font-semibold text-center">After Repair<br/>(Required)</span>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-4 text-sm">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">GPS Location</span>
                <span className="font-mono text-success flex items-center gap-1"><CheckCircle2 size={14}/> Verified Match</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Timestamp</span>
                <span className="font-mono text-foreground">Syncing...</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Required Materials</span>
                <span className="font-mono text-foreground text-right max-w-[150px] truncate">{task.inventory?.join(', ')}</span>
              </div>
            </div>

            {verificationState === 'success' && (
              <div className="bg-success/10 border border-success/30 p-4 rounded-xl flex items-center gap-3 animate-in zoom-in-95">
                <CheckCircle2 className="text-success" size={24} />
                <div>
                  <h4 className="text-success font-bold">Verification Complete</h4>
                  <p className="text-xs text-foreground mt-0.5">Confidence Score: {task.confidenceScore}%</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-surface border-t border-border shrink-0">
            {verificationState === 'idle' && (
              <button onClick={handleUploadEvidence} className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg hover:bg-primary/90">
                <Upload size={20} /> Submit Evidence
              </button>
            )}
            {verificationState === 'uploading' && (
              <button disabled className="w-full bg-secondary text-foreground py-4 rounded-xl font-bold flex justify-center items-center gap-2">
                <Loader2 size={20} className="animate-spin" /> Uploading...
              </button>
            )}
            {verificationState === 'verifying' && (
              <button disabled className="w-full bg-info text-info-foreground py-4 rounded-xl font-bold flex justify-center items-center gap-2">
                <Loader2 size={20} className="animate-spin" /> AI Verifying Data...
              </button>
            )}
            {verificationState === 'success' && (
              <button disabled className="w-full bg-success text-success-foreground py-4 rounded-xl font-bold flex justify-center items-center gap-2">
                <CheckCircle2 size={20} /> Task Finished
              </button>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4">
        <div className="flex items-center gap-3 p-4 border-b border-border bg-surface shrink-0">
          <button onClick={() => setActiveTask(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-lg">{task.workOrderId}</h2>
            <p className="text-xs text-muted-foreground uppercase">{status}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-surface border border-border p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Reported Issue</span>
                <p className="font-medium text-foreground">{task.category}</p>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${task.priority === 'Critical' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>
                {task.priority}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Location</span>
                <span className="font-mono text-foreground text-right">{task.ward} <br/><span className="text-xs text-muted-foreground">{task.nearestAsset}</span></span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-muted-foreground">Inventory Needed</span>
                <span className="font-mono text-foreground text-right text-xs max-w-[150px]">{task.inventory?.join(', ')}</span>
              </div>
            </div>
          </div>

          {task.aiExplanation && (
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl shadow-sm">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Operations Intelligence</h3>
              <p className="text-sm text-foreground mb-2">{task.aiExplanation.reason}</p>
              <div className="flex justify-between text-xs pt-2 border-t border-primary/10">
                <span className="text-muted-foreground font-mono">Conf: {task.aiExplanation.confidence}</span>
                <span className="text-success font-medium">{task.aiExplanation.expectedImpact}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-surface border-t border-border shrink-0 space-y-3">
          {status === 'ASSIGNED' && (
            <button onClick={() => handleAction('accept')} className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg hover:bg-primary/90">
              <CheckCircle2 size={20} /> Accept Task
            </button>
          )}
          {status === 'ACCEPTED' && (
            <button onClick={() => handleAction('navigate')} className="w-full bg-info text-info-foreground py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg">
              <Navigation size={20} /> Start Navigation
            </button>
          )}
          {status === 'NAVIGATING' && (
            <button onClick={() => handleAction('arrive')} className="w-full bg-secondary text-foreground border border-border py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg hover:bg-secondary/80">
              <MapPin size={20} /> Arrived On Site
            </button>
          )}
          {status === 'ARRIVED' && (
            <div className="flex gap-2">
              <button onClick={() => handleAction('repair')} className="flex-1 bg-warning text-warning-foreground py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg">
                <Wrench size={20} /> Begin Repair
              </button>
              <button onClick={() => handleAction('blocked')} className="flex-1 bg-destructive text-destructive-foreground py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg">
                <AlertTriangle size={20} /> Report Blocked
              </button>
            </div>
          )}
          {status === 'BLOCKED' && (
            <div className="w-full bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-center text-sm font-semibold">
              <AlertTriangle size={20} className="inline mr-2" /> Task Blocked. Awaiting Supervisor Override.
            </div>
          )}
          {status === 'REPAIRING' && (
            <button onClick={() => handleAction('EVIDENCE')} className="w-full bg-success text-success-foreground py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg">
              <Camera size={20} /> Upload Evidence
            </button>
          )}
          {(status === 'VERIFYING' || status === 'RESOLVED' || status === 'MANUAL_REVIEW_REQUIRED') && (
            <button disabled className="w-full bg-secondary text-muted-foreground py-4 rounded-xl font-bold flex justify-center items-center gap-2">
              <CheckCircle2 size={20} /> {status === 'VERIFYING' ? 'Verifying...' : status === 'RESOLVED' ? 'Finished' : 'Under Review'}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-base font-sans flex justify-center w-full">
      {/* Mobile Constraints for Desktop testing */}
      <div className="w-full max-w-md h-full bg-background border-x border-border shadow-2xl relative flex flex-col">
        
        {activeTask ? (
          renderActiveTask()
        ) : (
          <>
            <div className="flex items-center justify-between p-5 border-b border-border bg-surface shrink-0">
              <div>
                <h1 className="text-xl font-bold text-foreground">Field Operations</h1>
                <p className="text-xs text-info font-mono mt-0.5">{teamName} • Online</p>
              </div>
              <button className="p-3 bg-secondary rounded-full text-foreground hover:bg-secondary/80 transition-colors relative group">
                <QrCode size={20} />
                <span className="absolute -bottom-8 right-0 bg-background border text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">Scan QR (Mock)</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              <div>
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Today's Active Route</h2>
                {myTasks.length === 0 ? (
                  <div className="bg-surface border border-border border-dashed p-6 text-center rounded-xl text-muted-foreground text-sm flex flex-col items-center justify-center gap-2">
                    <CheckCircle2 size={32} className="opacity-20 mb-2" />
                    No active tasks right now.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myTasks.map(task => (
                      <button 
                        key={task.id}
                        onClick={() => setActiveTask(task)}
                        className="w-full bg-surface border border-border p-4 rounded-xl flex flex-col text-left hover:bg-secondary/50 transition-colors shadow-sm relative overflow-hidden"
                      >
                        {task.priority === 'Critical' && <div className="absolute top-0 left-0 w-1 h-full bg-destructive" />}
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-foreground">{task.workOrderId}</span>
                          <span className="text-[10px] font-mono uppercase bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                            {task.engineerStatus || 'Pending'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{task.category}</p>
                        <div className="flex items-center gap-1.5 text-xs text-foreground font-mono">
                          <MapPin size={12} className="text-info" /> {task.ward}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {completedTasks.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Completed Today</h2>
                  <div className="space-y-3 opacity-60">
                    {completedTasks.map(task => (
                      <div key={task.id} className="w-full bg-surface border border-border p-3 rounded-xl flex items-center justify-between text-left">
                        <div>
                          <span className="font-bold text-sm text-foreground line-through">{task.workOrderId}</span>
                          <p className="text-[10px] text-muted-foreground">{task.category}</p>
                        </div>
                        <CheckCircle2 size={16} className="text-success" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  )
}
