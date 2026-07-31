import React from 'react'
import { Plus, Minus, Search, Target, Maximize, FileOutput } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export function OperationsToolbar() {
  const { togglePresentationMode } = useAppStore()

  const tools = [
    { icon: Search, label: 'Search Location' },
    { icon: Target, label: 'Locate Self' },
    { icon: Plus, label: 'Zoom In' },
    { icon: Minus, label: 'Zoom Out' },
    { icon: Maximize, label: 'Presentation Mode', onClick: togglePresentationMode },
    { icon: FileOutput, label: 'Export View' },
  ]

  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
      {tools.map((tool, i) => (
        <button
          key={i}
          onClick={tool.onClick}
          className="w-8 h-8 flex items-center justify-center bg-surface/90 backdrop-blur-md border border-border rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shadow-sm group relative"
        >
          <tool.icon size={16} />
          
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-surface border rounded text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
            {tool.label}
          </div>
        </button>
      ))}
    </div>
  )
}
