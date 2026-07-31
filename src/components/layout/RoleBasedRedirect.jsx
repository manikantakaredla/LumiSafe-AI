import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

export function RoleBasedRedirect() {
  const { currentRole } = useAppStore();
  
  if (currentRole === 'Electrical Supervisor') return <Navigate to="street-lights" replace />;
  if (currentRole === 'City Operations') return <Navigate to="operations" replace />;
  
  return <Navigate to="dashboard" replace />;
}
