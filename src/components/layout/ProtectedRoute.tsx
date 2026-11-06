import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    const nextPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/akun?next=${nextPath}`} replace />;
  }

  return <>{children}</>;
};
