import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { useStore } from '../store';

export default function Classroom() {
  const webcamRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const updateMetrics = useStore((state) => state.updateMetrics);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/classroom');

    ws.onopen = () => console.log('Connected to Classroom WS');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!data.error) {
        updateMetrics({
          attentionScore: data.attention_score,
          emotion: data.emotion,
          facesDetected: data.faces_detected
        });
      }
    };
    ws.onclose = () => console.log('Disconnected from Classroom WS');

    setSocket(ws);
    return () => ws.close();
  }, [updateMetrics]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (webcamRef.current && socket && socket.readyState === WebSocket.OPEN) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          socket.send(JSON.stringify({ image: imageSrc }));
        }
      }
    }, 1000); // Send frame every second

    return () => clearInterval(interval);
  }, [socket]);

  return (
    <div className="min-h-screen bg-slate-950 p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-white mb-6">Live Classroom Monitoring</h1>

      <div className="relative rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width={800}
          height={600}
          className="object-cover"
        />
        {/* Overlay for HUD (Hackathon style) */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <div className="flex flex-col gap-2">
            <span className="text-emerald-400 font-mono font-bold">REC ●</span>
            <span className="text-white text-sm">Analyzing Attention...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
