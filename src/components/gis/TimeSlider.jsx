import React from 'react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

export function TimeSlider() {
  const { timeMode, setTimeMode } = useAppStore()
  
  const modes = [
    { id: 'past', label: 'Past 24h' },
    { id: 'current', label: 'Live' },
    { id: 'predicted', label: 'Predicted (AI)' }
  ]

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-surface/90 backdrop-blur-md border border-border rounded-full shadow-2xl p-1 flex items-center gap-1">
      {modes.map(mode => (
        <button
          key={mode.id}
          onClick={() => setTimeMode(mode.id)}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300",
            timeMode === mode.id 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}
