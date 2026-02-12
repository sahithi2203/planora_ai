import React from 'react';
import { motion } from 'framer-motion';
import { CurriculumData } from '../types';
import { Card, ProgressBar } from '../components/ui';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import { Target, TrendingUp, Scale, Zap } from 'lucide-react';

interface AnalyticsViewProps {
  data: CurriculumData;
}

const MetricCard: React.FC<{ label: string; value: number; icon: any; color: string }> = ({ label, value, icon: Icon, color }) => (
    <div className="glass-card p-4 rounded-xl border border-white/5 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-').replace('400', '500')}/10`}>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <span className={`text-2xl font-bold ${color}`}>{value}%</span>
        </div>
        <div>
            <p className="text-sm font-medium text-slate-300 mb-2">{label}</p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${value}%` }} 
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${color.replace('text-', 'bg-').replace('400', '500')}`} 
                />
            </div>
        </div>
    </div>
);

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ data }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Curriculum Analytics</h2>
        <p className="text-slate-400">Performance indicators for {data.programType} Mode</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
            label="Relevance Score" 
            value={data.metrics.relevanceScore} 
            icon={Target} 
            color="text-emerald-400" 
        />
        <MetricCard 
            label="Readiness Index" 
            value={data.metrics.readinessIndex} 
            icon={TrendingUp} 
            color="text-cyan-400" 
        />
        <MetricCard 
            label="Load Balance" 
            value={data.metrics.loadBalanceScore} 
            icon={Scale} 
            color="text-violet-400" 
        />
        <MetricCard 
            label="Skill Coverage" 
            value={data.metrics.skillCoverage} 
            icon={Zap} 
            color="text-amber-400" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bloom's Taxonomy Radar */}
        <Card title="Bloom's Taxonomy Coverage" className="min-h-[400px]">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.bloomMapping}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="Curriculum"
                  dataKey="A"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
                 <Radar
                  name="Industry Standard"
                  dataKey="B"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="#06b6d4"
                  fillOpacity={0.1}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2 text-xs text-slate-400">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-violet-500/50"></div> This Curriculum</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-500/20"></div> Market Standard</div>
          </div>
        </Card>

        {/* Difficulty Progression */}
        <Card title="Difficulty Progression" className="min-h-[400px]">
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.difficultyCurve}>
                <defs>
                  <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} 
                />
                <Area type="monotone" dataKey="level" stroke="#f43f5e" fillOpacity={1} fill="url(#colorLevel)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">Steepness indicates complexity ramp-up per semester</p>
        </Card>
      </div>
      
      {/* Gap Analysis Visual */}
      <Card title="Comparative Gap Analysis (vs MIT/Stanford)" className="mt-6">
        <div className="space-y-6">
          {[
            { label: "Math & Fundamentals", current: 65, target: 80 },
            { label: "Practical Implementation", current: 90, target: 75 },
            { label: "Ethics & Safety", current: 40, target: 60 }
          ].map((stat, i) => (
             <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">{stat.label}</span>
                  <span className="text-slate-500">Target: {stat.target}%</span>
                </div>
                <div className="h-4 bg-slate-900 rounded-full overflow-hidden relative">
                   {/* Target Marker */}
                   <div className="absolute top-0 bottom-0 w-0.5 bg-white z-10 opacity-50" style={{ left: `${stat.target}%` }} />
                   
                   {/* Bar */}
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${stat.current}%` }}
                     transition={{ duration: 1, delay: 0.5 }}
                     className={`h-full rounded-full ${
                        stat.current < stat.target - 10 ? 'bg-rose-500' :
                        stat.current > stat.target + 10 ? 'bg-emerald-500' : 'bg-blue-500'
                     }`}
                   />
                </div>
             </div>
          ))}
        </div>
      </Card>
    </div>
  );
};