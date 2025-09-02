import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { token, loading } = useContext(AuthContext);
  
  // Show loading or wait until we've checked for stored tokens
  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }
  
  // Only redirect if we're not loading and there's no token
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

