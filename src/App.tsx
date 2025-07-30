import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './components/Auth/AuthPage';
import { DonorDashboard } from './components/Donor/DonorDashboard';
import { NGODashboard } from './components/NGO/NGODashboard';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ZeroWaste DineMap...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          user.role === 'donor' ? (
            <Navigate to="/donor" replace />
          ) : user.role === 'ngo' ? (
            <Navigate to="/ngo" replace />
          ) : (
            <Navigate to="/auth" replace />
          )
        } 
      />
      <Route 
        path="/donor" 
        element={
          user.role === 'donor' ? (
            <DonorDashboard />
          ) : (
            <Navigate to={user.role === 'ngo' ? '/ngo' : '/'} replace />
          )
        } 
      />
      <Route 
        path="/ngo" 
        element={
          user.role === 'ngo' ? (
            <NGODashboard />
          ) : (
            <Navigate to={user.role === 'donor' ? '/donor' : '/'} replace />
          )
        } 
      />
      <Route 
        path="/auth" 
        element={
          !user ? <AuthPage /> : <Navigate to="/" replace />
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;