import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card } from './ui';

const data = [
  { time: '10:00', attention: 80, engagement: 75, drowsiness: 0 },
  { time: '10:05', attention: 85, engagement: 80, drowsiness: 5 },
  { time: '10:10', attention: 70, engagement: 65, drowsiness: 15 },
  { time: '10:15', attention: 90, engagement: 85, drowsiness: 2 },
  { time: '10:20', attention: 60, engagement: 55, drowsiness: 25 },
  { time: '10:25', attention: 75, engagement: 70, drowsiness: 10 },
  { time: '10:30', attention: 88, engagement: 82, drowsiness: 0 },
];

export default function Analytics() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-8">Classroom Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-emerald-500/30 border-t-4">
          <h2 className="text-xl text-slate-400 mb-2">Avg Session Attention</h2>
          <p className="text-5xl font-bold text-emerald-400">78.3%</p>
        </Card>
        <Card className="border-cyan-500/30 border-t-4">
          <h2 className="text-xl text-slate-400 mb-2">Dominant Emotion</h2>
          <p className="text-5xl font-bold text-cyan-400 capitalize">Focused</p>
        </Card>
        <Card className="border-red-500/30 border-t-4">
          <h2 className="text-xl text-slate-400 mb-2">Distraction Alerts</h2>
          <p className="text-5xl font-bold text-red-400">12</p>
        </Card>
      </div>

      <Card className="h-[450px]">
        <h2 className="text-2xl font-semibold mb-6">Aggregate Attention Trend</h2>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            <Legend />
            <Area type="monotone" dataKey="attention" stroke="#34d399" fillOpacity={1} fill="url(#colorAtt)" strokeWidth={3} />
            <Line type="monotone" dataKey="engagement" stroke="#60a5fa" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="drowsiness" stroke="#f87171" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
