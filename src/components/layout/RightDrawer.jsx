import React from 'react'
import { X } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

export function RightDrawer() {
  const { rightDrawer, closeDrawer } = useAppStore()

  // Placeholder content based on entityType
  const renderContent = () => {
    if (!rightDrawer.entityType) return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        No entity selected.
      </div>
    )

    return (
      <div className="space-y-4">
        <div className="border border-border rounded p-3 bg-surface">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Entity Details</p>
          <div className="mt-2 text-sm">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">ID</span>
              <span className="font-mono text-foreground">{rightDrawer.entityId || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Type</span>
              <span className="text-foreground capitalize">{rightDrawer.entityType}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Status</span>
              <span className="text-success flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success inline-block"></span> Active
              </span>
            </div>
          </div>
        </div>
        <div className="border border-border rounded p-3 bg-surface">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Quick Actions</p>
          <div className="mt-2 space-y-2">
            <button className="w-full text-left px-2 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded transition-colors">
              Update Status
            </button>
            <button className="w-full text-left px-2 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded transition-colors">
              Assign to Team
            </button>
            <button className="w-full text-left px-2 py-1.5 text-sm bg-destructive/10 text-destructive hover:bg-destructive/20 rounded transition-colors">
              Escalate Issue
            </button>
          </div>
        </div>
      </div>
    )
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
