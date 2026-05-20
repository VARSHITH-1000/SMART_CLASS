import React from 'react';
import { Navbar } from './Navbar';
import { useLocation } from 'react-router-dom';

export function AppLayout({ children }) {
  const location = useLocation();
  const isAuthOrLanding = location.pathname === '/' || location.pathname === '/auth';

  // Mock role determination based on path for this demo
  const role = location.pathname.includes('student') ? 'student' : 'teacher';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar role={role} />
      <main className={`flex-1 ${isAuthOrLanding ? '' : 'container mx-auto p-6 pt-8'}`}>
        {children}
      </main>
    </div>
  );
}
