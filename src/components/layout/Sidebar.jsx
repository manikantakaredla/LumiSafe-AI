import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  ShieldAlert,
  Zap,
  Building2,
  Users,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { name: 'Commissioner', path: '/app/commissioner', icon: ShieldAlert },
  { name: 'Electrical Dept', path: '/app/electrical', icon: Zap },
  { name: 'City Operations', path: '/app/city-operations', icon: Building2 },
  { name: 'Police', path: '/app/police', icon: Shield },
  { name: 'Public', path: '/app/public', icon: Users },
  { name: 'Administrator', path: '/app/admin', icon: Settings },
]

export function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <aside
      className={cn(
        "flex flex-col bg-card border-r transition-all duration-300 ease-in-out h-full relative",
        isSidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-12 flex items-center justify-between px-4 border-b">
        {!isSidebarCollapsed && (
          <span className="text-sm font-semibold text-primary truncate">
            MODULES
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors ml-auto"
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )
            }
            title={isSidebarCollapsed ? item.name : undefined}
          >
            <item.icon size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
