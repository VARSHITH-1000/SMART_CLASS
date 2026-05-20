import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrainCircuit, LayoutDashboard, LineChart, MessageSquare, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Navbar({ role }) {
  const location = useLocation();
  const isLandingOrAuth = location.pathname === '/' || location.pathname === '/auth';

  if (isLandingOrAuth) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-ai-cyan" />
            <span className="text-xl font-bold text-gradient">SmartClass AI</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/auth?mode=login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors py-2">
              Sign In
            </Link>
            <Link to="/auth?mode=register" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-slate-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  const navItems = role === 'teacher' ? [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/teacher/analytics', icon: LineChart },
    { name: 'AI Assistant', path: '/teacher/ai', icon: MessageSquare },
  ] : [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel rounded-none border-t-0 border-x-0 border-b border-white/5 px-6 py-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <Link to={role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-ai-cyan" />
          <span className="text-lg font-bold text-white tracking-tight">SmartClass</span>
        </Link>

        <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-white/5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden md:inline">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-ai-blue/20 flex items-center justify-center border border-ai-blue/30 text-ai-blue font-bold text-xs uppercase">
              {role[0]}
            </div>
            <Link to="/" className="text-slate-400 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
