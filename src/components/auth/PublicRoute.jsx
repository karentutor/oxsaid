import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '@/context';

const PublicRoute = () => {
  const { auth } = useContext(AuthContext);

  if (auth.user) {
    // Redirect to the home page if the user is authenticated
    return <Navigate to="/home" />;
  }

  // If the user is not authenticated, render the child components
  return <Outlet />;
};

export default PublicRoute;
