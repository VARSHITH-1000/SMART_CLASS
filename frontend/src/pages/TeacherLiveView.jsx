import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Activity, AlertTriangle, Users } from 'lucide-react';

export function TeacherLiveView({ classroomId }) {
  const [students, setStudents] = useState({});

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/classroom/${classroomId}/host`);

    ws.onopen = () => console.log('Connected WS (Host)');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.student_id) {
        setStudents(prev => ({ ...prev, [data.student_id]: data }));
      }
    };
    return () => ws.close();
  }, [classroomId]);

  const studentList = Object.values(students);
  const avgAttention = studentList.length > 0
    ? (studentList.reduce((acc, s) => acc + s.attention_score, 0) / studentList.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Top Control Bar */}
      <div className="glass-panel p-6 flex flex-wrap gap-6 justify-between items-center border-l-4 border-l-ai-cyan">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-ai-cyan" /> Live Grid
          </h2>
          <p className="text-slate-400 text-sm mt-1">Classroom ID: {classroomId}</p>
        </div>

        <div className="flex gap-6">
          <div className="text-center px-4 border-r border-white/10">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Students</p>
            <p className="text-2xl font-bold flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-ai-blue"/> {studentList.length}
            </p>
          </div>
          <div className="text-center px-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Class Avg Focus</p>
            <p className={`text-2xl font-bold ${avgAttention > 70 ? 'text-ai-emerald' : 'text-amber-400'}`}>
              {avgAttention}%
            </p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AnimatePresence>
          {studentList.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500">
              <Users className="w-12 h-12 mb-4 opacity-20" />
              <p>Waiting for students to connect their cameras...</p>
            </motion.div>
          )}

          {studentList.map((data) => {
            const isFocused = data.attention_score > 60;
            const isDanger = data.attention_score < 30 || data.drowsiness;

            return (
              <motion.div
                key={data.student_id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`p-0 overflow-hidden border-2 transition-colors duration-300 ${
                    isDanger ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' :
                    isFocused ? 'border-ai-emerald/30' : 'border-amber-500/30'
                  }`}
                >
                  {/* Mock Video Frame Placeholder / Actual Frame */}
                  <div className="aspect-[4/3] bg-slate-900 relative flex items-center justify-center overflow-hidden">
                     {data.image ? (
                       <img src={data.image} alt="Feed" className="w-full h-full object-cover opacity-80 mix-blend-luminosity" />
                     ) : (
                       <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">👤</div>
                     )}

                     {/* Overlays */}
                     <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                       <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-medium border border-white/10 shadow-lg">
                         Student {data.student_id}
                       </span>
                       <Badge variant={isDanger ? 'danger' : isFocused ? 'success' : 'warning'} className="font-mono shadow-lg">
                         {data.attention_score.toFixed(0)}%
                       </Badge>
                     </div>

                     {data.drowsiness && (
                       <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center backdrop-blur-[2px]">
                         <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-xl animate-pulse">
                           <AlertTriangle className="w-3 h-3"/> DROWSY
                         </span>
                       </div>
                     )}
                  </div>

                  <div className="p-3 bg-slate-950/80 border-t border-white/5 flex justify-between items-center text-xs">
                    <div className="flex flex-col">
                      <span className="text-slate-500 font-medium">Emotion</span>
                      <span className={`capitalize font-semibold ${data.emotion === 'focused' ? 'text-ai-emerald' : 'text-slate-300'}`}>{data.emotion}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-slate-500 font-medium">Pose</span>
                      <span className="capitalize text-slate-300 font-semibold">{data.head_pose}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
