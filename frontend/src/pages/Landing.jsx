'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      if (user.profileCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
      <div className="text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-6">AI Counsellor</h1>
        <p className="text-xl mb-4">
          Your Personal Guide to Study Abroad Success
        </p>
        <p className="text-lg mb-8 text-blue-100">
          Navigate your journey from confusion to clarity with intelligent
          counseling at every step.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/auth/login')}
            className="btn-primary bg-white text-primary hover:bg-blue-50"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/auth/signup')}
            className="btn-secondary bg-blue-700 text-white hover:bg-blue-800"
          >
            Sign Up
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-bold mb-2">Personalized Guidance</h3>
            <p className="text-sm text-blue-100">
              AI-powered analysis of your profile to recommend perfect
              universities
            </p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="font-bold mb-2">Structured Planning</h3>
            <p className="text-sm text-blue-100">
              Stage-by-stage guidance through your study abroad journey
            </p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 rounded-lg">
            <div className="text-3xl mb-2">✅</div>
            <h3 className="font-bold mb-2">Task Management</h3>
            <p className="text-sm text-blue-100">
              Never miss a deadline with AI-generated actionable tasks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
