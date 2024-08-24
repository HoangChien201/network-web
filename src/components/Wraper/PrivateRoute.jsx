// components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const isLoggedIn = !!localStorage.getItem('token'); // Hoặc sử dụng state toàn cục hoặc context

  return isLoggedIn ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
