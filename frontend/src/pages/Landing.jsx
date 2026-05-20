import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Sparkles, BrainCircuit, Activity, ShieldCheck } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ai-cyan/20 rounded-full blur-[120px] mix-blend-screen animate-blob pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-ai-purple/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000 pointer-events-none" />

      <div className="container mx-auto px-6 pt-32 pb-24 relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6 flex justify-center">
            <Badge variant="neon" className="px-4 py-1 text-sm bg-ai-cyan/10 text-ai-cyan border-ai-cyan/30 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              SmartClass AI 2.0 is Here
            </Badge>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            The Future of <br className="hidden md:block"/>
            <span className="text-gradient">Classroom Intelligence</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Enterprise-grade attention monitoring and AI analytics for modern educators.
            Transform your teaching with real-time insights powered by advanced computer vision.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth?mode=register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-ai-blue hover:bg-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                Get Started Free
              </Button>
            </Link>
            <Link to="/auth?mode=login">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border border-white/10 hover:bg-white/5">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Card hoverEffect className="group">
            <div className="w-12 h-12 rounded-xl bg-ai-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6 text-ai-blue" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Vision Engine</h3>
            <p className="text-slate-400 leading-relaxed">
              Real-time facial tracking, eye aspect ratio monitoring, and pose estimation using MediaPipe.
            </p>
          </Card>

          <Card hoverEffect className="group border-t border-t-ai-cyan/30">
            <div className="w-12 h-12 rounded-xl bg-ai-cyan/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-ai-cyan" />
            </div>
            <h3 className="text-xl font-bold mb-3">Live Analytics</h3>
            <p className="text-slate-400 leading-relaxed">
              Instantly track class engagement and drowsiness with sub-second latency via WebSockets.
            </p>
          </Card>

          <Card hoverEffect className="group">
            <div className="w-12 h-12 rounded-xl bg-ai-emerald/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-ai-emerald" />
            </div>
            <h3 className="text-xl font-bold mb-3">Privacy First</h3>
            <p className="text-slate-400 leading-relaxed">
              No images are saved. All inferences happen entirely in memory on encrypted edge nodes.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
