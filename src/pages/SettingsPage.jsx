import React from 'react';
import { User, Building2, Bell, LogOut } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';

export function SettingsPage() {
  const { currentRole, setCurrentRole } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentRole(null);
    navigate('/');
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-6 overflow-y-auto bg-base font-sans text-foreground">
      <div className="shrink-0 flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">System Settings</h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Manage your profile, organization details, and notifications.
          </p>
        </div>
      </div>

      <div className="max-w-3xl grid grid-cols-1 gap-6">
        
        {/* Profile */}
        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-2">
            <User size={18} className="text-primary" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">My Profile</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-col">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Official Designation</label>
              <input type="text" readOnly value={currentRole || 'Administrator'} className="bg-base border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none opacity-80 font-semibold" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Government Email</label>
              <input type="text" readOnly value={`${currentRole?.toLowerCase().replace(' ', '.')}@gvmc.gov.in`} className="bg-base border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none opacity-80" />
            </div>
          </div>
        </div>

        {/* Organization */}
        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-2">
            <Building2 size={18} className="text-primary" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Organization Details</h2>
          </div>
          <div className="p-6 space-y-4">
             <div className="flex flex-col">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Department</label>
              <input type="text" readOnly value="Greater Visakhapatnam Municipal Corporation" className="bg-base border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none opacity-80 font-semibold" />
            </div>
             <div className="flex flex-col">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">System Version</label>
              <input type="text" readOnly value="LumiSafe Platform v2.4 (Pilot)" className="bg-base border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none opacity-80" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Notification Preferences</h2>
          </div>
          <div className="p-6 space-y-4">
             <label className="flex items-center gap-3 cursor-pointer">
               <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-border" />
               <span className="text-sm font-semibold">Email Alerts for Critical Wards</span>
             </label>
             <label className="flex items-center gap-3 cursor-pointer">
               <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-border" />
               <span className="text-sm font-semibold">SMS Dispatch Notifications</span>
             </label>
             <label className="flex items-center gap-3 cursor-pointer">
               <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-border" />
               <span className="text-sm font-semibold">Weekly Executive Report</span>
             </label>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl shadow-sm overflow-hidden p-6 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-foreground">End Session</h2>
            <p className="text-xs text-muted-foreground mt-1">Securely log out of the LumiSafe Decision Support System.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-6 py-2 rounded-lg font-bold shadow transition-colors flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

      </div>
    </div>
  );
}
