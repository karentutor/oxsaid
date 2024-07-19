import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '@/context';

const AuthenticatedRoute = () => {
  const { auth } = useContext(AuthContext);

  if (!auth.user) {
    // Redirect to the login page if the user is not authenticated
    return <Navigate to="/signin" />;
  }

  // If the user is authenticated, render the child components
  return <Outlet />;
};

export default AuthenticatedRoute;
