import React, { useEffect, useState } from 'react';
import { Card } from './ui';

export default function TeacherLiveView({ classroomId }) {
  const [students, setStudents] = useState({});

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/classroom/${classroomId}/host`);

    ws.onopen = () => console.log('Connected to Classroom WS as Host');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.student_id) {
        setStudents(prev => ({
          ...prev,
          [data.student_id]: data
        }));
      }
    };
    ws.onclose = () => console.log('Disconnected from Classroom WS');

    return () => ws.close();
  }, [classroomId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">Live Monitoring</h2>
          <p className="text-slate-400">Classroom: CS 101</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-4 py-2 text-center">
            <span className="text-sm text-slate-400 block">Class Avg Attention</span>
            <span className="text-xl font-bold text-emerald-400">
              {Object.keys(students).length > 0
                ? (Object.values(students).reduce((acc, s) => acc + s.attention_score, 0) / Object.keys(students).length).toFixed(1) + '%'
                : '--'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.keys(students).length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            Waiting for students to join...
          </div>
        )}

        {Object.entries(students).map(([id, data]) => (
          <div key={id} className={`glass-panel p-4 border-t-4 ${data.attention_score > 60 ? 'border-t-emerald-500' : 'border-t-red-500'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-white">Student {id}</h3>
              <span className={`px-2 py-1 rounded text-xs font-bold ${data.attention_score > 60 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {data.attention_score.toFixed(0)}%
              </span>
            </div>

            {/* Realistically, teacher view might just show metrics to save bandwidth, or a low-res still frame */}
            <div className="aspect-video bg-slate-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
               {data.image ? (
                 <img src={data.image} alt="Student Frame" className="w-full h-full object-cover opacity-50" />
               ) : (
                 <span className="text-2xl">👤</span>
               )}
               {data.drowsiness && (
                 <div className="absolute inset-0 bg-red-500/20 border-2 border-red-500 rounded-lg flex items-center justify-center">
                   <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">DROWSY</span>
                 </div>
               )}
            </div>

            <div className="flex justify-between text-xs text-slate-400">
              <span>Emotion: <span className="text-white capitalize">{data.emotion}</span></span>
              <span>Pose: <span className="text-white capitalize">{data.head_pose}</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
