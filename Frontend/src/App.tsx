import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { token } = useContext(AuthContext);
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

