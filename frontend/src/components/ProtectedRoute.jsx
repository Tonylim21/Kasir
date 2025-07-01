import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAllowed = allowedRoles.includes(user.role);

  return isAllowed ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default ProtectedRoute;