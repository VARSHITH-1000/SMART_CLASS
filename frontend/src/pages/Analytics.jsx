import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BrainCircuit, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';

const attentionData = [
  { time: '10:00', focus: 85, distraction: 15 },
  { time: '10:15', focus: 88, distraction: 12 },
  { time: '10:30', focus: 75, distraction: 25 },
  { time: '10:45', focus: 65, distraction: 35 },
  { time: '11:00', focus: 80, distraction: 20 },
  { time: '11:15', focus: 92, distraction: 8 },
  { time: '11:30', focus: 89, distraction: 11 },
];

const emotionData = [
  { name: 'Focused', value: 65 },
  { name: 'Confused', value: 15 },
  { name: 'Tired', value: 10 },
  { name: 'Bored', value: 10 },
];
const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#64748b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border-white/20 shadow-2xl">
        <p className="text-slate-300 mb-2 font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm font-bold">
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Deep Analytics</h1>
          <p className="text-slate-400">Comprehensive AI analysis of your recent sessions.</p>
        </div>
        <Badge variant="ai" className="px-3 py-1">Auto-Generated Report</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Column: Charts */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-ai-emerald"/>
                Aggregate Attention Timeline
              </h3>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attentionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="focus" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
                  <Area type="monotone" dataKey="distraction" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorDist)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-6">Emotion Distribution</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emotionData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#cbd5e1'}} width={80} />
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {emotionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900 to-ai-purple/10 border-ai-purple/20">
              <h3 className="text-lg font-semibold mb-4 text-ai-purple flex items-center gap-2">
                <BrainCircuit className="w-5 h-5"/> AI Summary
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm mb-4">
                The overall engagement was strong at <strong className="text-white">82%</strong>.
                However, a significant drop in attention occurred around <strong className="text-white">10:45 AM</strong>,
                correlating with a 15% increase in confusion metrics.
              </p>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-ai-emerald mt-1.5 shrink-0"></div>
                  High focus during visual presentations.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                  Student 12 and 45 show chronic fatigue patterns.
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Right Column: Alerts Sidebar */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-400 uppercase tracking-wider text-sm mb-2">Automated Alerts</h3>
          {[
            { title: "Sustained Drowsiness", desc: "Detected in 3 students during last session.", type: "danger" },
            { title: "High Engagement Peak", desc: "Highest focus recorded during interactive Q&A.", type: "success" },
            { title: "Hardware Warning", desc: "Student 8 webcam frame rate critically low.", type: "warning" },
          ].map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
            >
              <Card className="p-4 border-l-4" style={{
                borderLeftColor: alert.type === 'danger' ? '#ef4444' : alert.type === 'success' ? '#10b981' : '#f59e0b'
              }}>
                <div className="flex gap-3">
                  <AlertTriangle className={`w-5 h-5 shrink-0 ${alert.type === 'danger' ? 'text-red-400' : alert.type === 'success' ? 'text-emerald-400' : 'text-amber-400'}`} />
                  <div>
                    <h4 className="font-medium text-white text-sm mb-1">{alert.title}</h4>
                    <p className="text-xs text-slate-400">{alert.desc}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
