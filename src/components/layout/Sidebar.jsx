import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Building2,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
  Lightbulb,
  LogOut,
  BrainCircuit,
  MessageSquareWarning
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/app/dashboard', icon: Building2, roles: ['Commissioner', 'Administrator'] },
  { name: 'Street Lights', path: '/app/street-lights', icon: Lightbulb, roles: ['Commissioner', 'Electrical Supervisor', 'Administrator'] },
  { name: 'Joint Operations', path: '/app/operations', icon: Shield, roles: ['Commissioner', 'City Operations', 'Administrator'] },
  { name: 'Resource Optimizer', path: '/app/optimizer', icon: BrainCircuit, roles: ['Commissioner', 'Administrator'] },
  { name: 'Copilot', path: '/app/copilot', icon: MessageSquareWarning, roles: ['Commissioner', 'Administrator'] },
  { name: 'Reports', path: '/app/reports', icon: FileText, roles: ['Commissioner', 'Administrator'] },
  { name: 'Settings', path: '/app/settings', icon: Settings, roles: ['Commissioner', 'Electrical Supervisor', 'City Operations', 'Administrator'] },
]

export function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar, currentRole, setCurrentRole } = useAppStore()
  const navigate = useNavigate();
  
  const visibleNavItems = NAV_ITEMS.filter(item => item.roles.includes(currentRole));

  const handleLogout = () => {
    setCurrentRole(null);
    navigate('/');
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-surface border-r border-border transition-all duration-300 ease-in-out h-full relative",
        isSidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!isSidebarCollapsed && (
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider truncate">
            GVMC Modules
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors ml-auto"
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )
            }
            title={isSidebarCollapsed ? item.name : undefined}
          >
            <item.icon size={18} className="shrink-0" />
            {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <button 
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            isSidebarCollapsed && "justify-center px-0"
          )}
          title={isSidebarCollapsed ? "Logout" : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!isSidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
