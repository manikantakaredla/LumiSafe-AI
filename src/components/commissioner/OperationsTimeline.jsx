import React from 'react'

const EVENTS = [
  { id: 1, time: '13:24', message: 'Team Alpha reached Ward 4', status: 'text-success', bg: 'bg-success' },
  { id: 2, time: '13:10', message: 'AI detected cascade failure in Node 12', status: 'text-destructive', bg: 'bg-destructive' },
  { id: 3, time: '12:45', message: 'Citizen complaint #8821 verified', status: 'text-warning', bg: 'bg-warning' },
  { id: 4, time: '11:30', message: 'Commissioner approved budget for Repair WO-11', status: 'text-info', bg: 'bg-info' },
  { id: 5, time: '10:15', message: 'Morning shift operations initialized', status: 'text-success', bg: 'bg-success' },
]

export function OperationsTimeline() {
  return (
    <div className="h-full bg-surface border rounded flex flex-col min-h-[300px]">
      <div className="p-3 border-b text-sm font-semibold text-foreground">
        Live Operations Timeline
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {EVENTS.map((event, i) => (
            <div key={event.id} className="relative pl-6">
              {i !== EVENTS.length - 1 && (
                <div className="absolute left-[5px] top-2 bottom-[-16px] w-[1px] bg-border" />
              )}
              <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full ${event.bg} ring-4 ring-surface`} />
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">{event.time}</span>
                <span className="text-sm text-foreground">{event.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
