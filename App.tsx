import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

const LandingWrapper = () => {
  const navigate = useNavigate();

  const handleEnter = (data: any) => {
    console.log("[Router] LandingPage onEnter triggered", data);
    // 1. Persist session data for Dashboard to pick up
    // We use localStorage to pass this data across the route transition
    if (data) {
      localStorage.setItem('pending_session', JSON.stringify(data));
    }

    // 2. Navigate to Dashboard
    navigate('/dashboard');
  };

  return <LandingPage onEnter={handleEnter} />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingWrapper />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Wildcard redirect to Home */}
        <Route path="*" element={<LandingWrapper />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;