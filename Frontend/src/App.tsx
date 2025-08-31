import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from 'react';

import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    // <h1 className="text-3xl text-blue-500 font-bold underline">Note Tacking App By Poorna Chandra!</h1>
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

