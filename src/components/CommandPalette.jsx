import React, { useEffect, useState, useRef } from 'react'
import { Search, MapPin, AlertCircle, HardHat, FileText, ChevronRight } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const MOCK_RESULTS = [
  { id: 1, type: 'Complaint', title: 'Street light out in Ward 4', icon: AlertCircle },
  { id: 2, type: 'Ward', title: 'Ward 4 - Madhurawada', icon: MapPin },
  { id: 3, type: 'Engineer', title: 'Rao, J. (Electrical)', icon: HardHat },
  { id: 4, type: 'Work Order', title: 'WO-8891: Fix Node 12', icon: FileText },
]

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen, openDrawer } = useAppStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!isCommandPaletteOpen)
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCommandPaletteOpen, setCommandPaletteOpen])

  // Focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
    }
  }, [isCommandPaletteOpen])

  if (!isCommandPaletteOpen) return null

  const filteredResults = MOCK_RESULTS.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.type.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (item) => {
    openDrawer(item.title, item.type, item.id)
    setCommandPaletteOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={() => setCommandPaletteOpen(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-surface-elevated rounded-lg shadow-2xl border overflow-hidden mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-3 border-b">
          <Search className="text-muted-foreground mr-3" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-lg"
            placeholder="Search commands, complaints, wards, engineers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded ml-3">ESC</div>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Entities
              </div>
              {filteredResults.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-md hover:bg-primary/10 hover:text-primary transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-secondary rounded text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <item.icon size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground group-hover:text-primary">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.type}</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-2 border-t bg-surface text-xs text-muted-foreground flex justify-between">
          <span><kbd className="font-sans px-1 rounded bg-secondary">↑</kbd> <kbd className="font-sans px-1 rounded bg-secondary">↓</kbd> to navigate</span>
          <span><kbd className="font-sans px-1 rounded bg-secondary">↵</kbd> to select</span>
        </div>
      </div>
    </div>
  )
}
