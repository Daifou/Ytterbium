import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { authService } from './services/authService';

import { useSubscription } from './hooks/useSubscription';

const LandingWrapper = () => {
  const navigate = useNavigate();
  const { refreshSubscription } = useSubscription();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAutoEnter = async () => {
      console.log("[App] LandingWrapper: Checking if user should auto-enter dashboard...");

      // Force fresh subscription check to see if user is premium
      const subData = await refreshSubscription();

      if (subData?.is_premium) {
        console.log("[App] ✓ Premium user detected. Auto-redirecting to dashboard.");
        navigate('/dashboard');
        return;
      }

      // Not premium or not logged in - show landing page
      console.log("[App] Non-premium or logged-out user. Showing landing page.");
      setIsChecking(false);
    };

    checkAutoEnter();
  }, []);

  const handleEnter = (data: any) => {
    console.log("[Router] LandingPage onEnter triggered", data);
    if (data) {
      localStorage.setItem('pending_session', JSON.stringify(data));
    }
    navigate('/dashboard');
  };

  if (isChecking) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-[10px] text-zinc-600 font-mono tracking-[0.3em] uppercase animate-pulse">
          Verifying Access...
        </div>
      </div>
    );
  }

  return <LandingPage onEnter={handleEnter} />;
};

const App: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const rehydrate = async () => {
      try {
        const session = await authService.getSession();
        if (session) {
          // Rehydration logic: verify with backend if token exists
          const response = await fetch('/api/user/me', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });
          if (response.ok) {
            console.log("[App] Session rehydrated successfully");
          } else if (response.status === 401) {
            // Token might be invalid/expired, sign out
            await authService.signOut();
          }
        }
      } catch (err) {
        console.error("[App] Rehydration failed", err);
      } finally {
        setIsRefreshing(false);
      }
    };
    rehydrate();
  }, []);

  if (isRefreshing) {
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-[10px] text-zinc-600 font-mono tracking-[0.3em] uppercase animate-pulse">
          Synchronizing Neural State...
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingWrapper />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;