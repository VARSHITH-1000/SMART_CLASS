import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { useStore } from '../store';

export default function StudentLiveView({ classroomId, studentId }) {
  const webcamRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const updateMetrics = useStore((state) => state.updateMetrics);
  const { attentionScore, emotion, drowsiness, head_pose } = useStore();

  useEffect(() => {
    // In production, studentId comes from Auth Context
    const ws = new WebSocket(`ws://localhost:8000/ws/classroom/${classroomId}/student/${studentId}`);

    ws.onopen = () => console.log('Connected to Classroom WS as Student');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!data.error) {
        updateMetrics({
          attentionScore: data.attention_score,
          emotion: data.emotion,
          drowsiness: data.drowsiness,
          head_pose: data.head_pose
        });
      }
    };
    ws.onclose = () => console.log('Disconnected from Classroom WS');

    setSocket(ws);
    return () => ws.close();
  }, [classroomId, studentId, updateMetrics]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (cameraActive && webcamRef.current && socket && socket.readyState === WebSocket.OPEN) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          socket.send(JSON.stringify({ image: imageSrc }));
        }
      }
    }, 1000); // 1 FPS for analytics

    return () => clearInterval(interval);
  }, [socket, cameraActive]);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[80vh]">
      <div className="flex-1 glass-panel p-4 flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Camera Feed</h2>
          <button
            onClick={() => setCameraActive(!cameraActive)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${cameraActive ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg'}`}
          >
            {cameraActive ? 'Stop Camera' : 'Start Camera'}
          </button>
        </div>

        <div className="flex-1 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center relative border border-white/5">
          {cameraActive ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-slate-500 flex flex-col items-center">
              <div className="text-4xl mb-4">📷</div>
              <p>Camera is disabled. Enable to track attention.</p>
            </div>
          )}

          {/* AI Feedback Overlay */}
          {cameraActive && (
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${attentionScore > 60 ? 'bg-emerald-400' : 'bg-red-500 animate-pulse'}`}></span>
                <span className="text-white text-sm font-mono tracking-wider">AI ACTIVE</span>
              </div>
              {drowsiness && (
                <div className="bg-red-500/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-red-400 text-white text-xs font-bold animate-pulse">
                  DROWSINESS DETECTED
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:w-80 flex flex-col gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Attention Score</h3>
          <div className="flex items-end gap-2">
            <span className={`text-5xl font-bold ${attentionScore > 60 ? 'text-emerald-400' : 'text-red-400'}`}>
              {attentionScore.toFixed(0)}%
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Emotion</span>
                <span className="capitalize text-white">{emotion}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Head Pose</span>
                <span className="capitalize text-white">{head_pose}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
