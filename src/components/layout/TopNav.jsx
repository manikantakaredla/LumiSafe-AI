import React, { useState, useEffect } from 'react'
import { Search, Bell, User, Clock, ChevronDown } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const ROLES = ['Commissioner', 'Electrical Dept', 'City Operations', 'Police', 'Public', 'Administrator']

export function TopNav() {
  const { toggleCommandPalette, currentRole, setCurrentRole, notifications } = useAppStore()
  const [time, setTime] = useState(new Date())
  const [isRoleDropdownOpen, setRoleDropdownOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="h-12 bg-background border-b flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">GV</span>
          </div>
          <span className="font-semibold text-sm">LumiSafe AI</span>
          <span className="text-xs text-muted-foreground border-l pl-2 ml-2 hidden md:inline-block">AI Operations Platform</span>
        </div>
      </div>

      {/* Center - Global Search / Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={toggleCommandPalette}
          className="w-full flex items-center justify-between bg-surface border hover:border-border-strong text-muted-foreground px-3 py-1.5 rounded text-sm transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search size={16} />
            <span>Search entities or commands...</span>
          </div>
          <kbd className="hidden sm:inline-block text-[10px] bg-secondary px-1.5 py-0.5 rounded border border-border">Ctrl+K</kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {/* Clock */}
        <div className="hidden lg:flex items-center gap-1.5 tabular-nums font-mono text-xs">
          <Clock size={14} />
          {time.toLocaleTimeString()}
        </div>

        {/* Notifications */}
        <button className="relative p-1 hover:text-foreground transition-colors">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-destructive rounded-full" />
          )}
        </button>

        {/* Dev Role Switcher */}
        <div className="relative">
          <button 
            onClick={() => setRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-secondary border border-transparent hover:border-border transition-colors"
          >
            <User size={16} />
            <span className="text-xs font-medium hidden sm:inline-block">{currentRole}</span>
            <ChevronDown size={14} />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-surface-elevated border rounded shadow-lg z-50 py-1">
              <div className="px-3 py-1.5 text-xs text-muted-foreground font-semibold border-b mb-1">DEV: Switch Role</div>
              {ROLES.map(role => (
                <button
                  key={role}
                  onClick={() => {
                    setCurrentRole(role)
                    setRoleDropdownOpen(false)
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
