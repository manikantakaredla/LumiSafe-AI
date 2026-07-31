import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { RightDrawer } from './RightDrawer'
import { CommandPalette } from '../CommandPalette'

export function AppLayout() {
  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col relative overflow-hidden bg-base">
          {/* Main content area */}
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <RightDrawer />
      <CommandPalette />
    </div>
  )
}
