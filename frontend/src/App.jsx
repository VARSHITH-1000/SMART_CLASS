import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import Analytics from './components/Analytics';
import Classroom from './components/Classroom';
import AIAssistant from './components/AIAssistant';

function App() {
  // In a real app, role and token would come from context/store
  const role = "teacher"; // Mock role for routing test

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <nav className="glass-panel rounded-none border-b border-white/5 sticky top-0 z-50">
          <div className="container mx-auto p-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gradient">
              SmartClass AI
            </h1>
            <div className="space-x-6">
              {role === 'teacher' ? (
                <>
                  <Link to="/teacher/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
                  <Link to="/teacher/analytics" className="text-slate-300 hover:text-white transition-colors">Analytics</Link>
                  <Link to="/teacher/ai" className="text-slate-300 hover:text-white transition-colors">AI Assistant</Link>
                </>
              ) : (
                <>
                  <Link to="/student/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <main className="flex-1 p-6 container mx-auto">
          <Routes>
            <Route path="/" element={<TeacherDashboard />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/teacher/analytics" element={<Analytics />} />
            <Route path="/teacher/ai" element={<AIAssistant />} />
            {/* The live classroom component handles both roles internally */}
            <Route path="/classroom/:id" element={<Classroom />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
