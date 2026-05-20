import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Camera, CameraOff, Brain, AlertCircle } from 'lucide-react';
import { useStore } from '../store';

export function StudentLiveView({ classroomId, studentId }) {
  const webcamRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const updateMetrics = useStore((state) => state.updateMetrics);
  const { attentionScore, emotion, drowsiness, head_pose } = useStore();

  useEffect(() => {
    // Connect WebSocket
    const ws = new WebSocket(`ws://localhost:8000/ws/classroom/${classroomId}/student/${studentId}`);

    ws.onopen = () => console.log('Connected WS (Student)');
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
    }, 1000); // Send frame every 1s
    return () => clearInterval(interval);
  }, [socket, cameraActive]);

  const scoreColor = attentionScore > 75 ? 'text-ai-emerald' : attentionScore > 40 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[80vh]">

      {/* Main Camera View */}
      <Card className="flex-1 p-4 flex flex-col relative overflow-hidden bg-slate-900 border-white/5">
        <div className="flex justify-between items-center mb-4 relative z-20">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Camera className="w-5 h-5 text-ai-cyan" /> Camera Feed
          </h2>
          <Button
            variant={cameraActive ? 'destructive' : 'emerald'}
            onClick={() => setCameraActive(!cameraActive)}
            className="gap-2"
          >
            {cameraActive ? <CameraOff className="w-4 h-4"/> : <Camera className="w-4 h-4"/>}
            {cameraActive ? 'Stop Camera' : 'Start Camera'}
          </Button>
        </div>

        <div className="flex-1 bg-black rounded-xl overflow-hidden relative border border-white/10 flex items-center justify-center">
          {cameraActive ? (
            <>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{ facingMode: "user" }}
              />
              {/* Overlay HUD */}
              <div className="absolute top-4 left-4 flex flex-col gap-3">
                <div className="glass px-3 py-1.5 rounded-lg flex items-center gap-2 border-l-4 border-l-ai-cyan">
                  <div className="w-2 h-2 rounded-full bg-ai-cyan animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-widest text-ai-cyan">AI ACTIVE</span>
                </div>
                {drowsiness && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-500/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-red-400 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    <AlertCircle className="w-4 h-4"/> DROWSINESS DETECTED
                  </motion.div>
                )}
              </div>

              {/* Decorative Scanning Line */}
              <motion.div
                className="absolute left-0 right-0 h-1 bg-ai-cyan/30 shadow-[0_0_10px_rgba(6,182,212,0.8)] z-10"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
              />
            </>
          ) : (
            <div className="text-slate-600 flex flex-col items-center">
              <CameraOff className="w-16 h-16 mb-4 opacity-50" />
              <p className="font-medium tracking-wide">CAMERA DISABLED</p>
            </div>
          )}
        </div>
      </Card>

      {/* Side Stats Panel */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-ai-purple" />
            <h3 className="font-semibold text-lg text-slate-200">Real-time Metrics</h3>
          </div>

          <div className="mb-8">
            <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">Attention Score</p>
            <div className="flex items-baseline gap-1">
              <span className={`text-6xl font-black tracking-tighter ${scoreColor}`}>
                {attentionScore.toFixed(0)}
              </span>
              <span className={`text-xl font-bold ${scoreColor}`}>%</span>
            </div>

            {/* Score Progress Bar */}
            <div className="h-2 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${attentionScore > 75 ? 'bg-ai-emerald' : attentionScore > 40 ? 'bg-amber-400' : 'bg-red-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${attentionScore}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass p-3 rounded-lg flex justify-between items-center border border-white/5">
              <span className="text-sm text-slate-400 font-medium">Emotion</span>
              <Badge variant={emotion === 'focused' ? 'success' : 'warning'} className="uppercase">
                {emotion}
              </Badge>
            </div>
            <div className="glass p-3 rounded-lg flex justify-between items-center border border-white/5">
              <span className="text-sm text-slate-400 font-medium">Head Pose</span>
              <Badge className="uppercase bg-slate-800 text-slate-300">
                {head_pose}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
