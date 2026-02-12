import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui';
import { ArrowRight, Sparkles, Target, Zap, ShieldCheck } from 'lucide-react';

export const Landing: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-4">
          <Sparkles className="w-3 h-3" />
          <span>Powered by IBM Granite 3.3 2B & Ollama</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400">
          Design Future-Ready <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Curriculum with Intelligence</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The intelligent platform that builds data-driven, industry-aligned learning pathways in seconds. 
          Trusted by Universities, EdTechs, and Corporate Training Leaders.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button onClick={onStart} className="h-12 px-8 text-lg w-full sm:w-auto shadow-2xl shadow-violet-500/20">
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl"
      >
        {[
          { icon: Target, title: "Industry Aligned", desc: "Real-time gap analysis against top market demands." },
          { icon: Zap, title: "Adaptive Difficulty", desc: "Smart progression from beginner to expert mastery." },
          { icon: ShieldCheck, title: "Risk Detection", desc: "Automatically flag academic overload and pacing issues." }
        ].map((f, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl text-left hover:bg-white/5 transition-colors group border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-violet-600/20 transition-colors">
              <f.icon className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};