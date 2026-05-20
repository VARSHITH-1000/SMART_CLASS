import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStore } from '../store';

const data = [
  { time: '10:00', attention: 80, engagement: 75 },
  { time: '10:05', attention: 85, engagement: 80 },
  { time: '10:10', attention: 70, engagement: 65 },
  { time: '10:15', attention: 90, engagement: 85 },
  { time: '10:20', attention: 60, engagement: 55 },
  { time: '10:25', attention: 75, engagement: 70 },
  { time: '10:30', attention: 88, engagement: 82 },
];

export default function Dashboard() {
  const { attentionScore, emotion, facesDetected } = useStore();

  return (
    <div className="p-8 space-y-8 bg-slate-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8">Classroom Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-xl text-slate-400 mb-2">Live Attention Score</h2>
          <p className="text-5xl font-bold text-emerald-400">{attentionScore.toFixed(1)}%</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-xl text-slate-400 mb-2">Dominant Emotion</h2>
          <p className="text-5xl font-bold text-blue-400 capitalize">{emotion}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-xl text-slate-400 mb-2">Faces Detected</h2>
          <p className="text-5xl font-bold text-purple-400">{facesDetected}</p>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 h-[400px]">
        <h2 className="text-2xl font-semibold mb-6">Attention & Engagement Trend</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
            <Legend />
            <Line type="monotone" dataKey="attention" stroke="#34d399" strokeWidth={3} />
            <Line type="monotone" dataKey="engagement" stroke="#60a5fa" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
