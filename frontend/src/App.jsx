import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

import Landing from './pages/Landing';
import Auth from './pages/Auth';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard'; // Keeping the old one for now if not replaced, or point to a new one
import Analytics from './pages/Analytics';
import LiveSession from './pages/LiveSession';
import AIAssistantPage from './pages/AIAssistantPage';

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/teacher/analytics" element={<Analytics />} />
          <Route path="/teacher/ai" element={<AIAssistantPage />} />
          <Route path="/classroom/:id" element={<LiveSession />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
