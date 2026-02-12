import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge } from '../components/ui';
import { User, CurriculumData } from '../types';
import { Clock, BookOpen, TrendingUp, Plus, ArrowRight, Activity, Calendar, Award } from 'lucide-react';

interface DashboardProps {
  user: User;
  history: CurriculumData[];
  onNavigate: (tab: string) => void;
  onViewItem: (data: CurriculumData) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, history, onViewItem }) => {
  const [showAllActivity, setShowAllActivity] = useState(false);

  // Calculate dynamic stats based on history
  const stats = useMemo(() => {
    const totalCurriculums = history.length;
    
    // Estimate hours: Average per curriculum (weeklyHours * 4 weeks * number of semesters)
    // Using 4 weeks (approx 1 month) instead of full semester length to keep projected hours in a "normal range"
    const totalHours = totalCurriculums > 0 ? Math.round(history.reduce((acc, curr) => {
        const semHours = curr.semesters.reduce((sAcc, sem) => sAcc + (sem.weeklyHours * 4), 0);
        return acc + semHours;
    }, 0) / totalCurriculums) : 0;

    // Gamification: 5% readiness growth per curriculum created, starting base 12%
    const growth = Math.min(100, totalCurriculums * 5 + 12); 

    return [
      { label: 'Courses Created', value: totalCurriculums.toString(), icon: BookOpen, color: 'text-violet-400', bg: 'bg-violet-500/10' },
      { label: 'Avg. Projected Hours', value: totalHours > 1000 ? `${(totalHours/1000).toFixed(1)}k` : totalHours.toString(), icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
      { label: 'Career Readiness', value: `+${growth}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    ];
  }, [history]);

  // Determine which items to show
  const displayedActivity = showAllActivity ? history : history.slice(0, 3);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTimeAgo = (isoString: string) => {
      const date = new Date(isoString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {user.name}</h1>
          <p className="text-slate-400">Here's what's happening with your curriculum designs.</p>
        </div>
        <Button onClick={() => onNavigate('generator')} icon={Plus} className="shadow-lg shadow-violet-500/20">
          New Course
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors"
          >
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
              <stat.icon size={80} />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-2xl font-bold text-white`}>{stat.value}</span>
            </div>
            <p className="text-slate-400 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-400" /> Recent Activity
            </h2>
            {history.length > 3 && (
                <button 
                    onClick={() => setShowAllActivity(!showAllActivity)}
                    className="text-sm text-violet-400 hover:text-white transition-colors"
                >
                    {showAllActivity ? 'Show Less' : 'View All Activity'}
                </button>
            )}
          </div>

          <div className="space-y-4">
            <AnimatePresence>
                {displayedActivity.length > 0 ? (
                    displayedActivity.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-all cursor-pointer group"
                        onClick={() => onViewItem(item)}
                    >
                        <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-violet-500/50 transition-colors">
                                <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-violet-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">{item.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                    <Badge color="purple" className="text-[10px] px-1.5 py-0">{item.programType}</Badge>
                                    <span>•</span>
                                    <span>{item.role}</span>
                                    <span>•</span>
                                    <span>{item.semesters.length} Semesters</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-slate-500 block">{getTimeAgo(item.generatedAt)}</span>
                            <ArrowRight className="w-4 h-4 text-slate-600 mt-2 ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </div>
                        </div>
                    </motion.div>
                    ))
                ) : (
                    <div className="text-center py-12 glass-card rounded-xl border-dashed border-2 border-slate-800">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-slate-300 font-medium mb-1">No activity yet</h3>
                        <p className="text-slate-500 text-sm mb-4">Generate your first curriculum to see it here.</p>
                        <Button variant="outline" onClick={() => onNavigate('generator')}>Start Generator</Button>
                    </div>
                )}
            </AnimatePresence>
          </div>
        </div>

        {/* Quick Tips / Sidebar */}
        <div className="space-y-6">
            <Card title="Quick Actions">
                <div className="space-y-3">
                    <button onClick={() => onNavigate('generator')} className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-violet-600/10 hover:text-violet-300 transition-all border border-transparent hover:border-violet-500/30 flex items-center justify-between group">
                        <span className="text-sm font-medium text-slate-300 group-hover:text-violet-300">Create Corporate Training</span>
                        <Plus className="w-4 h-4 text-slate-500 group-hover:text-violet-400" />
                    </button>
                    <button onClick={() => onNavigate('generator')} className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-cyan-600/10 hover:text-cyan-300 transition-all border border-transparent hover:border-cyan-500/30 flex items-center justify-between group">
                        <span className="text-sm font-medium text-slate-300 group-hover:text-cyan-300">Design University Syllabus</span>
                        <Plus className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                    </button>
                    <button onClick={() => onNavigate('advisor')} className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-emerald-600/10 hover:text-emerald-300 transition-all border border-transparent hover:border-emerald-500/30 flex items-center justify-between group">
                        <span className="text-sm font-medium text-slate-300 group-hover:text-emerald-300">Consult AI Advisor</span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                    </button>
                </div>
            </Card>

            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <Award className="w-8 h-8 text-white mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Upgrade to Pro</h3>
                <p className="text-violet-100 text-sm mb-4">Unlock advanced export formats, API access, and unlimited AI generations.</p>
                <button onClick={() => onNavigate('billing')} className="w-full py-2 bg-white text-violet-600 rounded-lg text-sm font-bold hover:bg-violet-50 transition-colors">
                    View Plans
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};