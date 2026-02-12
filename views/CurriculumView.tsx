import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CurriculumData, Course, Risk, Project } from '../types';
import { ChevronDown, ChevronUp, Code, Download, Briefcase, AlertOctagon, BookOpen, GitBranch, ShieldAlert, CheckCircle2, List, Lightbulb } from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';
// @ts-ignore
import html2canvas from 'html2canvas';
// @ts-ignore
import { jsPDF } from 'jspdf';

interface CurriculumViewProps {
  data: CurriculumData;
  onUpdate?: (data: CurriculumData) => void;
}

const CourseItem: React.FC<{ course: Course; onUpdate?: (course: Course) => void }> = ({ course, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`relative pl-6 py-3 group transition-all duration-300 ${expanded ? 'bg-white/5 rounded-lg pr-4' : ''}`}>
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-800 group-hover:bg-violet-500 transition-colors"></div>
      
      <div 
        className="cursor-pointer" 
        onClick={(e) => {
            // Prevent expansion if clicking inputs
            if ((e.target as HTMLElement).tagName === 'INPUT') return;
            setExpanded(!expanded);
        }}
      >
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
            <h4 className="text-slate-200 font-medium group-hover:text-violet-400 transition-colors">{course.title}</h4>
            {expanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
          </div>
          <span className="text-xs text-slate-500 font-mono">{course.code}</span>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2 mb-2">{course.description}</p>
        <div className="flex gap-2 flex-wrap items-center">
          {course.projects && course.projects.length > 0 && (
            <Badge color="purple"><div className="flex items-center gap-1"><Code size={10} /> {course.projects.length} Projects</div></Badge>
          )}
          <Badge color="blue">{course.credits} Credits</Badge>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
              
              {/* Learning Objectives */}
              {course.learningObjectives && course.learningObjectives.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Learning Objectives
                  </h5>
                  <ul className="space-y-1">
                    {course.learningObjectives.map((obj, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-slate-500 mt-2"></span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Detailed Topics */}
              {course.topics && course.topics.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <List size={12} /> Syllabus Topics
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {course.topics.map((topic, i) => (
                      <div key={i} className="text-sm text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded border border-white/5">
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RiskItem: React.FC<{ risk: Risk }> = ({ risk }) => (
    <div className={`p-5 rounded-xl border ${
        risk.severity === 'High' ? 'bg-rose-500/10 border-rose-500/30' : 
        risk.severity === 'Medium' ? 'bg-amber-500/10 border-amber-500/30' : 
        'bg-blue-500/10 border-blue-500/30'
    } mb-4`}>
        <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
                 risk.severity === 'High' ? 'bg-rose-500/20 text-rose-400' : 
                 risk.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
            }`}>
                <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className={`text-sm font-bold mb-1 ${
                        risk.severity === 'High' ? 'text-rose-400' : 
                        risk.severity === 'Medium' ? 'text-amber-400' : 'text-blue-400'
                    }`}>{risk.type} Alert</h4>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        risk.severity === 'High' ? 'bg-rose-500/20 text-rose-300' : 
                        risk.severity === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>{risk.severity} Priority</span>
                </div>
                <p className="text-sm text-slate-200 mb-3">{risk.message}</p>
                
                {risk.suggestion && (
                    <div className="flex items-start gap-2 bg-slate-900/50 p-3 rounded-lg border border-white/5">
                        <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-300"><span className="text-yellow-400 font-medium">Suggestion:</span> {risk.suggestion}</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const ProjectCard: React.FC<{ project: Project; onUpdate?: (project: Project) => void }> = ({ project, onUpdate }) => (
    <div className="glass-card p-5 rounded-xl border border-white/5 hover:border-violet-500/30 transition-all">
        <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-white">{project.title}</h4>
            <Badge color={project.difficulty === 'Advanced' ? 'red' : 'green'}>{project.difficulty}</Badge>
        </div>
        <p className="text-sm text-slate-400 mb-4">{project.description}</p>
        <div className="flex items-center justify-between mt-2">
            <div className="flex flex-wrap gap-2">
                {project.techStack.map(t => (
                    <span key={t} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">{t}</span>
                ))}
            </div>
        </div>
    </div>
);

export const CurriculumView: React.FC<CurriculumViewProps> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'projects' | 'risks' | 'gaps'>('structure');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    // Target the hidden "full content" container instead of the visible tab view
    const element = document.getElementById('pdf-export-container');
    if (!element) return;
    
    setIsDownloading(true);
    try {
      // Small delay to ensure render of any lazy components (though fixed positioning usually renders immediately)
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 2, 
        backgroundColor: '#020617', 
        useCORS: true, 
        logging: false,
        // Ensure we capture everything even if it's off-screen
        windowWidth: 1200, 
        height: element.scrollHeight,
        windowHeight: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Dynamic Filename
      const safeTitle = data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `${data.programType}_${data.role}_${safeTitle}.pdf`;
      
      pdf.save(filename);
    } catch (err) {
      console.error("PDF Export failed", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUpdateCourse = (updatedCourse: Course, semesterId: number) => {
    if (!onUpdate) return;
    const newSemesters = data.semesters.map(s => {
      if (s.id === semesterId) {
        return {
          ...s,
          courses: s.courses.map(c => c.id === updatedCourse.id ? updatedCourse : c)
        };
      }
      return s;
    });
    onUpdate({ ...data, semesters: newSemesters });
  };

  const handleUpdateProject = (updatedProject: Project) => {
    if (!onUpdate) return;
    const newProjects = data.projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    onUpdate({ ...data, projects: newProjects });
  };

  return (
    <div className="space-y-6 relative">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <div className="flex gap-2 mb-2">
             <Badge color="purple">{data.programType}</Badge>
             <Badge color="blue">{data.role}</Badge>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{data.title}</h2>
          <p className="text-slate-400 max-w-2xl">{data.description}</p>
        </div>
        <div className="flex gap-3" id="no-print">
          <Button 
            variant="primary" 
            icon={Download} 
            onClick={handleDownloadPDF}
            isLoading={isDownloading}
          >
            {isDownloading ? 'Exporting...' : 'PDF'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10 mb-6 overflow-x-auto" id="no-print">
        {[
            { id: 'structure', label: 'Curriculum Structure', icon: BookOpen },
            { id: 'projects', label: 'Capstone Projects', icon: Code },
            { id: 'gaps', label: 'Gap Analysis', icon: GitBranch },
            { id: 'risks', label: 'Risk Detection', icon: AlertOctagon },
        ].map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'border-violet-500 text-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
            >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'risks' && data.risks.length > 0 && (
                    <span className="ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px]">{data.risks.length}</span>
                )}
            </button>
        ))}
      </div>

      {/* Main Interactive View */}
      <div className="p-2 -m-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
                {activeTab === 'structure' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    {data.semesters.map((sem, idx) => (
                    <div key={sem.id} className="glass-card rounded-xl overflow-hidden">
                        <div className="p-4 bg-slate-800/50 flex justify-between items-center border-b border-white/5">
                            <div>
                                <h3 className="font-semibold text-white">{sem.title}: {sem.theme}</h3>
                                <p className="text-xs text-slate-400">{sem.totalCredits} Credits • {sem.weeklyHours}h / week</p>
                            </div>
                        </div>
                        <div className="p-4 space-y-2">
                            {sem.courses.map(c => (
                                <CourseItem 
                                    key={c.id} 
                                    course={c} 
                                    onUpdate={onUpdate ? (updated) => handleUpdateCourse(updated, sem.id) : undefined} 
                                />
                            ))}
                        </div>
                    </div>
                    ))}
                </motion.div>
                )}

                {activeTab === 'projects' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 gap-4">
                        {data.projects.map(p => (
                            <ProjectCard 
                                key={p.id} 
                                project={p} 
                                onUpdate={onUpdate ? handleUpdateProject : undefined} 
                            />
                        ))}
                        {data.projects.length === 0 && <div className="text-center text-slate-500 p-10">No specific projects generated. Try adjusting the prompt.</div>}
                    </motion.div>
                )}

                {activeTab === 'risks' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {data.risks.length > 0 ? (
                            data.risks.map(r => <RiskItem key={r.id} risk={r} />)
                        ) : (
                            <div className="glass-card p-8 text-center text-emerald-400">
                                <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                No critical risks detected in this curriculum.
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'gaps' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                        {data.comparisons.map((comp, i) => (
                            <Card key={i} title={`Comparison: ${comp.institution}`}>
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Match Rate</span>
                                        <span className="text-white font-bold">{comp.matchRate}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full" style={{ width: `${comp.matchRate}%` }}></div>
                                    </div>
                                </div>
                                <h4 className="text-sm font-semibold text-rose-400 mb-2">Missing Topics detected:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {comp.missingTopics.map(t => (
                                        <Badge key={t} color="red">{t}</Badge>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
            <Card title="Industry Alignment" className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                <Briefcase size={100} />
                </div>
                <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-emerald-400">{data.metrics.relevanceScore}%</span>
                <span className="text-sm text-slate-400 mb-1">Match Rate</span>
                </div>
                <div className="space-y-3 mt-4">
                {data.skillGaps.map((gap, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">{gap.skill}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                        gap.status === 'Missing' ? 'bg-rose-500/10 text-rose-400' :
                        gap.status === 'Overloaded' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-emerald-500/10 text-emerald-400'
                    }`}>{gap.status}</span>
                    </div>
                ))}
                </div>
            </Card>

            <Card title="Career Projection">
                <div className="space-y-4">
                {data.careerOutcomes.map((job, i) => (
                    <div key={i} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <div className="flex justify-between mb-1">
                        <span className="font-medium text-white">{job.role}</span>
                        <span className="text-green-400 text-xs font-mono">{job.salaryRange}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2">
                        <div className="bg-gradient-to-r from-violet-500 to-cyan-400 h-1.5 rounded-full" style={{ width: `${job.match}%` }} />
                    </div>
                    </div>
                ))}
                </div>
            </Card>
            </div>
        </div>
      </div>

      {/* --- HIDDEN PRINT TEMPLATE --- */}
      {/* This container includes ALL content expanded for the PDF generator. It is positioned off-screen. */}
      <div 
        id="pdf-export-container" 
        className="absolute top-0 left-[-9999px] w-[1000px] bg-[#020617] text-slate-200 p-12 z-[-50]"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
          {/* Header */}
          <div className="mb-8 border-b border-white/10 pb-6 flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{data.title}</h1>
                <p className="text-slate-400 text-lg mb-4">{data.description}</p>
                <div className="flex gap-4">
                    <span className="px-3 py-1 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-md text-sm font-semibold">{data.programType}</span>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md text-sm font-semibold">{data.role}</span>
                </div>
              </div>
              <div className="text-right">
                  <div className="text-sm text-slate-500">Generated by</div>
                  <div className="text-xl font-bold text-white tracking-tight">Planora AI</div>
                  <div className="text-xs text-slate-600 mt-1">{new Date().toLocaleDateString()}</div>
              </div>
          </div>

          {/* Key Metrics Summary */}
          <div className="grid grid-cols-4 gap-4 mb-10">
               <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center">
                   <div className="text-3xl font-bold text-emerald-400 mb-1">{data.metrics.relevanceScore}%</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider">Relevance</div>
               </div>
               <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-center">
                   <div className="text-3xl font-bold text-cyan-400 mb-1">{data.metrics.readinessIndex}%</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider">Readiness</div>
               </div>
               <div className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl text-center">
                   <div className="text-3xl font-bold text-violet-400 mb-1">{data.metrics.loadBalanceScore}%</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider">Load Balance</div>
               </div>
               <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-center">
                   <div className="text-3xl font-bold text-amber-400 mb-1">{data.metrics.skillCoverage}%</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider">Skill Coverage</div>
               </div>
          </div>

          {/* Full Syllabus */}
          <div className="space-y-8 mb-10">
              <h2 className="text-2xl font-bold text-white border-l-4 border-violet-500 pl-4">Full Curriculum Roadmap</h2>
              {data.semesters.map((sem, i) => (
                  <div key={sem.id} className="bg-slate-900/40 border border-white/10 rounded-xl overflow-hidden break-inside-avoid">
                      <div className="bg-slate-900/80 p-4 border-b border-white/5 flex justify-between items-center">
                          <div>
                              <h3 className="text-lg font-bold text-white">{sem.title}: <span className="text-violet-300 font-normal">{sem.theme}</span></h3>
                          </div>
                          <div className="text-xs text-slate-400 font-mono bg-slate-950 px-2 py-1 rounded">
                              {sem.totalCredits} Credits • {sem.weeklyHours}h/week
                          </div>
                      </div>
                      <div className="p-5 space-y-4">
                          {sem.courses.map(course => (
                              <div key={course.id} className="bg-slate-950/30 rounded-lg border border-white/5 p-4">
                                  <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-semibold text-white text-base">{course.title}</h4>
                                      <span className="text-xs font-mono text-slate-500">{course.code}</span>
                                  </div>
                                  <p className="text-sm text-slate-400 mb-4">{course.description}</p>
                                  
                                  <div className="grid grid-cols-2 gap-6 pt-2 border-t border-white/5">
                                      <div>
                                          <h5 className="text-[10px] uppercase font-bold text-emerald-500 mb-2 flex items-center gap-1">
                                              <CheckCircle2 size={10} /> Learning Objectives
                                          </h5>
                                          <ul className="list-disc list-inside space-y-1">
                                              {course.learningObjectives.map((lo, idx) => (
                                                  <li key={idx} className="text-xs text-slate-300 leading-relaxed">{lo}</li>
                                              ))}
                                          </ul>
                                      </div>
                                      <div>
                                          <h5 className="text-[10px] uppercase font-bold text-cyan-500 mb-2 flex items-center gap-1">
                                              <List size={10} /> Topics
                                          </h5>
                                          <div className="flex flex-wrap gap-1.5">
                                              {course.topics.map((t, idx) => (
                                                  <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-900 text-slate-400 rounded border border-slate-800">{t}</span>
                                              ))}
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10 break-inside-avoid">
              {/* Projects */}
              <div>
                  <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-cyan-500 pl-4">Capstone Projects</h2>
                  <div className="space-y-4">
                      {data.projects.map(p => (
                          <div key={p.id} className="p-4 border border-white/10 rounded-xl bg-slate-900/30">
                               <div className="flex justify-between items-start mb-2">
                                   <h4 className="font-bold text-white text-sm">{p.title}</h4>
                                   <span className={`text-[10px] px-1.5 py-0.5 rounded ${p.difficulty === 'Advanced' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>{p.difficulty}</span>
                               </div>
                               <p className="text-xs text-slate-400 mb-3">{p.description}</p>
                               <div className="flex flex-wrap gap-1">
                                  {p.techStack.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 bg-slate-950 rounded text-slate-500">{t}</span>)}
                               </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Risks */}
              <div>
                  <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-rose-500 pl-4">Detected Risks & Mitigations</h2>
                  <div className="space-y-4">
                      {data.risks.map(r => (
                          <div key={r.id} className="p-4 border border-white/10 rounded-xl bg-slate-900/30">
                              <div className="flex items-center gap-2 mb-2">
                                  <ShieldAlert size={14} className={r.severity === 'High' ? 'text-rose-400' : 'text-amber-400'} />
                                  <h4 className="font-bold text-slate-200 text-sm">{r.type}</h4>
                              </div>
                              <p className="text-xs text-slate-400 mb-2">{r.message}</p>
                              {r.suggestion && (
                                  <div className="text-xs bg-slate-950 p-2 rounded text-slate-400 border border-white/5">
                                      <span className="text-emerald-500 font-medium">Fix: </span>{r.suggestion}
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </div>
          </div>
          
          {/* Career Outcomes */}
          <div className="break-inside-avoid">
             <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-emerald-500 pl-4">Career Projections</h2>
             <div className="grid grid-cols-3 gap-4">
                {data.careerOutcomes.map((c, i) => (
                    <div key={i} className="bg-slate-900/50 border border-white/10 p-4 rounded-xl">
                        <div className="font-bold text-white text-sm mb-1">{c.role}</div>
                        <div className="text-xs text-emerald-400 font-mono mb-2">{c.salaryRange}</div>
                        <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full" style={{ width: `${c.match}%` }}></div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
      </div>
    </div>
  );
};