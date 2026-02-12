import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { mockStore } from '../mocks';

function RoleRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.getRole());

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={mockStore.getHomePathByRole(role)} replace />;
}

export default RoleRedirect;

