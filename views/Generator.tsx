import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui';
import { UserInput, CurriculumData, ProgramType, UserRole } from '../types';
import { generateCurriculumAI } from '../services/aiGenerator';
import { 
  Wand2, Layers, Clock, 
  Building2, Rocket, Briefcase, BookOpen, 
  UserCog, CheckCircle2,
  ArrowRight, ChevronLeft
} from 'lucide-react';

interface GeneratorProps {
  onGenerate: (data: CurriculumData) => void;
}

const STEP_VARIANTS = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const Generator: React.FC<GeneratorProps> = ({ onGenerate }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<UserInput>({
    topic: '',
    level: 'Intermediate',
    duration: 4,
    programType: 'University', // Default
    role: 'Student', // Default
    syllabusContent: ''
  });

  const PROGRAM_TYPES: { id: ProgramType; icon: any; label: string; desc: string; color: string }[] = [
    { id: 'University', icon: Building2, label: 'University', desc: 'Accredited degree programs & academic rigor', color: 'from-violet-500 to-purple-500' },
    { id: 'Startup', icon: Rocket, label: 'Startup', desc: 'Rapid skill acquisition & MVP building', color: 'from-orange-500 to-red-500' },
    { id: 'Corporate', icon: Briefcase, label: 'Corporate', desc: 'Employee upskilling & ROI focus', color: 'from-blue-500 to-cyan-500' },
    { id: 'Self-Paced', icon: BookOpen, label: 'Self-Paced', desc: 'Flexible roadmaps for independent learners', color: 'from-emerald-500 to-teal-500' },
  ];

  const ROLES_BY_PROGRAM: Record<ProgramType, { id: UserRole; label: string; desc: string }[]> = {
    'University': [
      { id: 'Academic Administrator', label: 'Academic Admin', desc: 'Feasibility & Accreditation' },
      { id: 'Faculty', label: 'Faculty', desc: 'Pedagogy & Syllabus Design' },
      { id: 'Student', label: 'Student', desc: 'Career Readiness & Workload' },
    ],
    'Startup': [
      { id: 'Founder', label: 'Founder', desc: 'Rapid Full-Stack Breadth' },
      { id: 'Mentor', label: 'Mentor', desc: 'Best Practices & Architecture' },
      { id: 'Learner', label: 'Learner', desc: 'Hands-on Project Building' },
    ],
    'Corporate': [
      { id: 'L&D Manager', label: 'L&D Manager', desc: 'ROI & Skill Gap Analysis' },
      { id: 'Team Lead', label: 'Team Lead', desc: 'Team Competency Planning' },
      { id: 'Employee', label: 'Employee', desc: 'Role-Specific Upskilling' },
    ],
    'Self-Paced': [
      { id: 'Self-Learner', label: 'Self-Learner', desc: 'Personal Interest & Growth' },
      { id: 'Working Professional', label: 'Working Pro', desc: 'Career Advancement' },
      { id: 'Career Switcher', label: 'Career Switcher', desc: 'Job-Ready Portfolio' },
    ]
  };

  const getDurationUnit = (type: ProgramType) => {
    switch (type) {
        case 'University': return 'Semesters';
        case 'Startup': return 'Sprints';
        case 'Corporate': return 'Modules';
        case 'Self-Paced': return 'Levels';
        default: return 'Units';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const data = await generateCurriculumAI(formData);
      onGenerate(data);
    } catch (err) {
      console.error(err);
      setError("Failed to contact the neural network. Please check your connection or API limit.");
    } finally {
      setLoading(false);
    }
  };

  const handleProgramSelect = (type: ProgramType) => {
    setFormData(prev => ({ ...prev, programType: type }));
    setStep(2);
  };

  const handleRoleSelect = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role: role }));
    setStep(3);
  };

  const renderStep1 = () => (
    <motion.div 
      variants={STEP_VARIANTS} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Choose Learning Context</h2>
        <p className="text-slate-400">Select the type of environment for this curriculum.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROGRAM_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => handleProgramSelect(type.id)}
            className="group relative p-6 rounded-2xl glass-card border border-white/5 hover:border-white/20 transition-all text-left overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} bg-opacity-20 flex items-center justify-center mb-4 shadow-lg`}>
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{type.label}</h3>
                <p className="text-sm text-slate-400">{type.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div 
      variants={STEP_VARIANTS} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setStep(1)} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-white">Select Your Role</h2>
          <p className="text-slate-400">Who are you designing this for within a {formData.programType} setting?</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ROLES_BY_PROGRAM[formData.programType].map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleSelect(role.id)}
            className="group p-6 rounded-2xl glass-card border border-white/5 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all text-left"
          >
             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-violet-600 group-hover:text-white transition-colors">
               <UserCog className="w-5 h-5 text-slate-400 group-hover:text-white" />
             </div>
             <h3 className="text-lg font-bold text-white mb-1">{role.label}</h3>
             <p className="text-sm text-slate-400">{role.desc}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div 
      variants={STEP_VARIANTS} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setStep(2)} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
           <h2 className="text-3xl font-bold text-white">Curriculum Details</h2>
           <div className="flex gap-2 mt-1">
             <span className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">{formData.programType}</span>
             <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">{formData.role}</span>
           </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-white/10 relative overflow-hidden">
         {/* Top Gradient Line */}
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500" />
         
         <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-violet-400" /> Target Domain / Topic
                </label>
                <input
                    type="text"
                    required
                    placeholder="e.g. Generative AI, Fintech, Bio-informatics..."
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all shadow-inner"
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-400" /> Difficulty Level
                    </label>
                    <div className="flex bg-slate-950/50 p-1.5 rounded-xl border border-slate-700">
                        {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                            <button
                                key={l}
                                type="button"
                                onClick={() => setFormData({...formData, level: l})}
                                className={`flex-1 text-sm py-2 rounded-lg transition-all font-medium ${
                                    formData.level === l 
                                    ? 'bg-slate-700 text-white shadow-lg' 
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-rose-400" /> Duration ({getDurationUnit(formData.programType)})
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="1"
                            max="8"
                            className="w-full accent-violet-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                        />
                        <span className="min-w-[60px] px-2 h-10 flex items-center justify-center bg-slate-800 rounded-lg text-white font-mono text-sm border border-slate-700">
                            {formData.duration} {getDurationUnit(formData.programType).slice(0, 3)}
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Warning / Hint */}
            <div className="mt-4 bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 flex items-start gap-4">
              <div className="text-sm text-slate-400">
                <span className="text-amber-400 font-medium block mb-1">AI Optimization Active</span>
                Planora's engine will tailor the curriculum specifically for a <span className="text-white font-medium">{formData.role}</span> in a <span className="text-white font-medium">{formData.programType}</span> environment.
              </div>
            </div>

            {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <Button onClick={handleSubmit} isLoading={loading} className="w-full py-4 text-lg font-semibold rounded-xl shadow-2xl shadow-violet-500/20">
                {loading ? 'Analyzing Market & Generating...' : 'Generate Curriculum'}
            </Button>
         </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto min-h-[600px]">
      <div className="flex justify-center mb-8">
         <div className="flex items-center gap-2">
            {[1, 2, 3].map(i => (
                <div key={i} className={`flex items-center ${i < 3 ? 'after:content-[""] after:w-12 after:h-[2px] after:mx-2' : ''} ${i < step ? 'after:bg-violet-500' : 'after:bg-slate-800'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                        step === i ? 'border-violet-500 bg-violet-500/20 text-violet-400' : 
                        step > i ? 'border-violet-500 bg-violet-500 text-white' :
                        'border-slate-700 bg-slate-800 text-slate-500'
                    }`}>
                        {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                    </div>
                </div>
            ))}
         </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </AnimatePresence>
    </div>
  );
};