import React, { useEffect } from 'react'
import { ChevronLeft, Check, Loader2, ArrowRight } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export function ReportTracker({ reportId, onBack }) {
  const { publicReports } = useAppStore()
  const report = publicReports.find(r => r.id === reportId)

  if (!report) {
    return (
      <div className="p-6 text-center animate-in fade-in">
        <button onClick={onBack} className="mb-4 text-muted-foreground flex items-center gap-1"><ChevronLeft size={16}/> Back</button>
        <p className="text-muted-foreground">Report {reportId} not found.</p>
      </div>
    )
  }

  const STAGES = [
    'Report Submitted',
    'AI Classified & Prioritized',
    'Assigned to Electrical Dept',
    'Team En Route',
    'Issue Resolved'
  ]

  return (
    <div className="max-w-md mx-auto p-6 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={20} />
          <span className="font-medium text-sm">Back</span>
        </button>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-primary/20">
          Tracking
        </div>
      </div>

      <div className="bg-surface border border-border p-5 rounded-2xl mb-8 shadow-sm">
        <h2 className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Report ID</h2>
        <p className="text-xl font-mono text-foreground font-semibold">{report.id}</p>
        
        <div className="mt-4 pt-4 border-t border-border/50 flex justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase mb-0.5">Reported Issue</p>
            <p className="text-sm font-medium">{report.category || 'Complaint'}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase mb-0.5">Est. Resolution</p>
            <p className="text-sm font-mono text-info font-medium">Within 4 Hrs</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-2">
        <h3 className="font-bold text-lg mb-6">Live Status</h3>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          
          {STAGES.map((stageTitle, index) => {
            const stepData = report.timeline.find(t => t.label === stageTitle)
            const isCompleted = !!stepData
            const isCurrent = report.timeline.length === index
            
            return (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-base shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-colors duration-500 ${isCompleted ? 'bg-primary text-primary-foreground' : isCurrent ? 'bg-secondary border-primary text-primary' : 'bg-secondary text-muted-foreground'}`}>
                  {isCompleted ? <Check size={16} /> : isCurrent ? <Loader2 size={16} className="animate-spin" /> : <div className="w-2 h-2 rounded-full bg-border" />}
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface border border-border p-4 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-bold text-sm ${isCompleted ? 'text-foreground' : isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>{stageTitle}</h4>
                    {isCompleted && <span className="text-[10px] font-mono text-muted-foreground">{stepData.time}</span>}
                  </div>
                  {stepData?.detail && (
                    <p className="text-xs text-muted-foreground mt-1">{stepData.detail}</p>
                  )}
                  {isCurrent && (
                    <p className="text-xs text-primary mt-1 animate-pulse">Waiting for system update...</p>
                  )}
                </div>
              </div>
            )
          })}

        </div>
      </div>

      {report.timeline.length >= 3 && (
        <div className="mt-8 bg-info/10 border border-info/20 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-2 bg-background rounded-full text-info shrink-0">
            <Check size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-info">System Automatically Identified:</h4>
            <p className="text-xs text-foreground mt-1">
              Your report matched 2 similar reports in Ward 4. The electrical team was dispatched directly by the AI Operations Engine.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
