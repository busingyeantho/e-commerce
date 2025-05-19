import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast'; // Import toast

const ProtectedRoute = ({ children, roles }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You might want to show a loading spinner here instead of null
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  if (!currentUser) {
    // User not logged in, redirect to login page
    // Pass the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if the current user has one of the required roles
  if (roles && roles.length > 0 && (!currentUser.role || !roles.includes(currentUser.role))) {
    // User does not have the required role, redirect to an unauthorized page or homepage
    toast.error("You are not authorized to view this page.");
    return <Navigate to="/" replace />;
  }

  // Special case for admin/orders - allow both admin and owner roles
  const isAdminOrdersPage = location.pathname === '/admin/orders';
  if (isAdminOrdersPage && currentUser.role !== 'admin' && currentUser.role !== 'owner') {
    toast.error("You are not authorized to view this page.");
    return <Navigate to="/" replace />;
  }

  return children; // User is authenticated (and has the role if specified), render the child component
};

export default ProtectedRoute;
