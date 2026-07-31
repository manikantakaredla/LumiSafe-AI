import React from 'react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'

export function ModulePage({ title, description }) {
  return (
    <div className="p-6 h-full flex flex-col">
      <Breadcrumbs />
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </header>
      <div className="flex-1 bg-surface border rounded-lg border-dashed border-border flex items-center justify-center animate-in fade-in duration-500">
        <div className="text-center">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
             <span className="text-muted-foreground font-mono text-xs">APP</span>
          </div>
          <h3 className="text-foreground font-medium">{title} Module</h3>
          <p className="text-sm text-muted-foreground mt-1">Application shell is ready. Content will be built here in future sprints.</p>
        </div>
      </div>
    </div>
  )
}
