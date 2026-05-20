import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Plus, Users, Activity, Clock, PlayCircle } from 'lucide-react';

const mockClasses = [
  { id: 1, name: "Advanced Machine Learning", code: "ML404X", students: 42, active: false, lastAvg: 85 },
  { id: 2, name: "Data Structures 101", code: "DS101Y", students: 120, active: true, lastAvg: 72 },
  { id: 3, name: "Human-Computer Interaction", code: "HCI202", students: 28, active: false, lastAvg: 91 },
];

export default function TeacherDashboard() {
  const [classes] = useState(mockClasses);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-panel p-8 border-l-4 border-l-ai-blue">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-bold mb-2"
          >
            Mission Control
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400"
          >
            Overview of your active sessions and classroom analytics.
          </motion.p>
        </div>
        <Button variant="neon" className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> New Classroom
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: "190", icon: Users, color: "text-ai-blue" },
          { label: "Avg Attention", value: "82.6%", icon: Activity, color: "text-ai-emerald" },
          { label: "Active Sessions", value: "1", icon: PlayCircle, color: "text-ai-cyan" },
          { label: "Hours Taught", value: "48h", icon: Clock, color: "text-ai-purple" },
        ].map((stat, i) => (
          <Card key={i} className="p-5 flex items-center gap-4 border-t border-t-white/5">
            <div className={`p-3 rounded-lg bg-slate-800 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
              <h4 className="text-2xl font-bold text-white mt-1">{stat.value}</h4>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-6 flex items-center gap-2">
        Your Classrooms
        <Badge variant="ai">{classes.length}</Badge>
      </h2>

      {/* Classroom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {classes.map((cls, i) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hoverEffect className="flex flex-col h-full border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <span className="font-mono text-xs text-slate-300 font-bold tracking-wider">{cls.code}</span>
                </div>
                {cls.active ? (
                  <Badge variant="success" className="animate-pulse flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-ai-emerald rounded-full"></span> LIVE
                  </Badge>
                ) : (
                  <Badge variant="default">Idle</Badge>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{cls.name}</h3>

              <div className="flex gap-4 text-sm text-slate-400 mb-6">
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4"/> {cls.students} Enrolled</span>
                <span className="flex items-center gap-1.5"><Activity className="w-4 h-4"/> {cls.lastAvg}% Avg Focus</span>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5 flex gap-3">
                <Link to={`/classroom/${cls.id}`} className="flex-1">
                  <Button variant={cls.active ? "emerald" : "default"} className="w-full gap-2">
                    {cls.active ? "Join Session" : "Start Class"}
                  </Button>
                </Link>
                <Link to={`/teacher/analytics`}>
                  <Button variant="ghost" className="px-3 border border-white/10">Stats</Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
