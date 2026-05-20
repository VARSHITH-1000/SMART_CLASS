import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Classroom from './components/Classroom';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
        <nav className="bg-slate-950 p-4 border-b border-slate-800 sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              SmartClass AI
            </h1>
            <div className="space-x-6">
              <Link to="/" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/classroom" className="text-slate-300 hover:text-white transition-colors">Live Classroom</Link>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/classroom" element={<Classroom />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
