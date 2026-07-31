import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Shield } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentRole } = useAppStore();
  const [selectedRole, setSelectedRole] = useState('Commissioner');

  const ROLES = [
    'Commissioner',
    'Electrical Department',
    'City Operations Center',
    'Public Portal' // Wait, Public Portal shouldn't be a login role, it's public. But the user said: "Login Roles: Commissioner, Electrical Department, City Operations Center, Public Portal". I'll include it.
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedRole === 'Public Portal') {
      navigate('/public');
      return;
    }
    
    // Map official roles to existing app roles so components don't break immediately
    const roleMapping = {
      'Commissioner': { role: 'Commissioner', route: '/app/dashboard' },
      'Electrical Department': { role: 'Electrical Supervisor', route: '/app/street-lights' },
      'City Operations Center': { role: 'City Operations', route: '/app/operations' }
    };
    
    const mapped = roleMapping[selectedRole];
    setCurrentRole(mapped.role);
    navigate(mapped.route);
  };

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-border shadow-md rounded-md overflow-hidden">
        
        <div className="bg-primary p-6 flex flex-col items-center text-center border-b border-border">
          <Shield className="text-primary-foreground mb-3" size={48} />
          <h1 className="font-bold text-xl text-primary-foreground tracking-tight">GVMC Official Login</h1>
          <p className="text-primary-foreground/80 text-xs mt-1">Smart Street Lighting & Safety Decision Support System</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Select Designation</label>
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-base border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Government ID</label>
            <input 
              type="text" 
              defaultValue="GVMC-ADMIN-01"
              className="w-full bg-base border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Secure Password</label>
            <input 
              type="password" 
              defaultValue="password123"
              className="w-full bg-base border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
            />
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm py-2.5 rounded shadow-sm transition-colors mt-2">
            Secure Login
          </button>
        </form>

        <div className="bg-secondary/30 p-4 text-center border-t border-border">
          <p className="text-[10px] text-muted-foreground font-semibold">UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED.</p>
        </div>
      </div>
    </div>
  );
}
