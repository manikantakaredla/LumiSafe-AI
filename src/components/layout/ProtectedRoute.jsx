import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

export function ProtectedRoute() {
  const { currentUser, authToken } = useAppStore();
  const location = useLocation();

  // If no user profile or secure JWT token is active, deny access and force login
  if (!currentUser || !authToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
