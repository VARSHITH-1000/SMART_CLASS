import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { BrainCircuit, ArrowRight, Lock, User, GraduationCap } from 'lucide-react';
import axios from 'axios';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isRegister = searchParams.get('mode') === 'register';

  const [formData, setFormData] = useState({ username: '', password: '', role: 'teacher' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await axios.post('http://localhost:8000/users/register', formData);
        // Auto login or redirect to login
        navigate('/auth?mode=login');
      } else {
        const params = new URLSearchParams();
        params.append('username', formData.username);
        params.append('password', formData.password);

        const res = await axios.post('http://localhost:8000/users/token', params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        localStorage.setItem('token', res.data.access_token);

        // Mock routing based on selected role in form, in reality decode JWT
        if (formData.username.includes('student')) {
            navigate('/student/dashboard');
        } else {
            navigate('/teacher/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-300">
      {/* Decorative BG */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-ai-blue/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-ai-purple/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-[1000px] h-[600px] glass-panel p-0 flex rounded-2xl overflow-hidden relative z-10 mx-4 border-white/10 shadow-2xl">

        {/* Left Side: Graphic / Branding */}
        <div className="hidden md:flex flex-1 flex-col justify-center p-12 bg-gradient-to-br from-slate-900/80 to-slate-950/80 relative overflow-hidden border-r border-white/5">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-ai-blue/20 flex items-center justify-center mb-8 border border-ai-blue/30 backdrop-blur-sm">
              <BrainCircuit className="w-8 h-8 text-ai-blue" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Intelligence <br/> <span className="text-ai-cyan">Redefined.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Join the world's most advanced AI-powered classroom ecosystem. Experience real-time engagement analytics.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-12 flex flex-col justify-center bg-slate-950/50 backdrop-blur-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={isRegister ? 'register' : 'login'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-sm w-full mx-auto"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {isRegister ? 'Create an Account' : 'Welcome Back'}
                </h3>
                <p className="text-slate-400 text-sm">
                  {isRegister ? 'Start monitoring your classrooms today.' : 'Sign in to access your dashboard.'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                    <Input
                      type="text"
                      required
                      placeholder="teacher_john"
                      className="pl-10 bg-slate-900/80"
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                    <Input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="pl-10 bg-slate-900/80"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                {isRegister && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 ml-1">Role</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                      <select
                        className="flex h-10 w-full pl-10 rounded-md border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-ai-cyan transition-all appearance-none"
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                      >
                        <option value="teacher">Teacher (Host)</option>
                        <option value="student">Student</option>
                      </select>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full mt-4 flex items-center justify-center gap-2 group h-11"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Sign In')}
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm text-slate-400">
                {isRegister ? "Already have an account? " : "Don't have an account? "}
                <Link
                  to={`/auth?mode=${isRegister ? 'login' : 'register'}`}
                  className="text-ai-cyan hover:text-ai-blue transition-colors font-medium"
                >
                  {isRegister ? 'Sign In' : 'Create one'}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
