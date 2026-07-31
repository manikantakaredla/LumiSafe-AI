import React, { useState, useEffect } from 'react'
import { Search, Bell, User, Clock, ChevronDown } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const ROLES = ['Commissioner', 'Electrical Supervisor', 'City Operations', 'Administrator']

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
        <div className="font-bold text-lg text-primary tracking-tight flex items-center gap-2">
          <img src="/gvmc-logo.png" alt="GVMC Logo" className="w-7 h-7 object-contain bg-white rounded-full p-0.5" />
          <span className="hidden sm:inline">LumiSafe Platform</span>
        </div>
        <div className="hidden md:flex bg-secondary/50 rounded-full px-3 py-1 text-xs font-mono text-muted-foreground border border-border/50 items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success"></span> System Active
        </div>
      </div>

      {/* Center - Global Search / Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-4 flex items-center gap-2">
        <button
          onClick={toggleCommandPalette}
          className="flex-1 flex items-center justify-between bg-surface border hover:border-border-strong text-muted-foreground px-3 py-1.5 rounded text-sm transition-colors"
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
                  onClick={async () => {
                    setCurrentRole(role)
                    setRoleDropdownOpen(false)
                    // Simulate login mapping
                    const roleToEmail = {
                      'Commissioner': 'commissioner@lumisafe.ai',
                      'Electrical Supervisor': 'electrical@lumisafe.ai',
                      'City Operations': 'ops@lumisafe.ai',
                      'Administrator': 'admin@lumisafe.ai'
                    };
                    const email = roleToEmail[role];
                    if (email) {
                      try {
                        const res = await fetch('http://localhost:5000/api/v1/auth/login', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email, password: 'password123' })
                        });
                        const data = await res.json();
                        if (data.success && data.data.token) {
                          localStorage.setItem('token', data.data.token);
                          console.log(`[Auth] Logged in as ${role}`);
                        }
                      } catch (err) {
                        console.error('[Auth] Failed to login', err);
                      }
                    }
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
