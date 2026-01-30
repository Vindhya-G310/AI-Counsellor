'use client';

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  ProtectedRoute,
  OnboardingRoute,
} from './components/ProtectedRoute';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Universities } from './pages/Universities';
import { Counsellor } from './pages/Counsellor';
import { Applications } from './pages/Applications';
import { Navbar } from './components/Navbar';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <OnboardingRoute>
              <Dashboard />
            </OnboardingRoute>
          }
        />
        <Route
          path="/universities"
          element={
            <OnboardingRoute>
              <Universities />
            </OnboardingRoute>
          }
        />
        <Route
          path="/counsellor"
          element={
            <OnboardingRoute>
              <Counsellor />
            </OnboardingRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <OnboardingRoute>
              <Applications />
            </OnboardingRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
