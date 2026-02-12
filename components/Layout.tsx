import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, BookOpen, BarChart3, MessageSquare, Menu, X, LogOut, User as UserIcon, ChevronDown, Settings, CreditCard, Sparkles, LayoutDashboard } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Click outside listener for profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { id: 'generator', label: 'Generator', icon: BrainCircuit },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'advisor', label: 'AI Advisor', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background text-slate-100 relative selection:bg-violet-500/30">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[128px] animate-blob" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[128px] animate-blob animation-delay-2000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <BrainCircuit className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Planora</span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === item.id 
                      ? 'bg-white/10 text-white shadow-inner border border-white/5' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-violet-400' : 'text-slate-500'}`} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
                {user ? (
                    <div className="relative" ref={profileRef}>
                        <button 
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="flex items-center gap-3 pl-4 border-l border-white/10 focus:outline-none group"
                        >
                            {/* Changed hidden lg:block to hidden md:block to ensure visibility on more screens */}
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-white group-hover:text-violet-400 transition-colors">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.plan || 'Pro Plan'}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-violet-500/50 transition-colors relative overflow-hidden">
                                 {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                 ) : (
                                    <UserIcon className="w-4 h-4 text-slate-400" />
                                 )}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isProfileDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-3 w-72 glass-panel rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50 origin-top-right backdrop-blur-xl bg-slate-900/90"
                                >
                                    {/* Dropdown Header */}
                                    <div className="p-4 border-b border-white/5 bg-white/5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 p-[1px]">
                                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-lg font-bold text-white">{user.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{user.name}</p>
                                                <p className="text-xs text-slate-400 truncate max-w-[160px]">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-2 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-3 h-3 text-violet-400" />
                                                <span className="text-xs font-medium text-violet-300">{user.plan || 'Pro Plan'}</span>
                                            </div>
                                            <button onClick={() => { setIsProfileDropdownOpen(false); onNavigate('billing'); }} className="text-[10px] bg-violet-600 text-white px-2 py-0.5 rounded hover:bg-violet-500 transition-colors">Upgrade</button>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="p-2 space-y-1">
                                        <button 
                                          onClick={() => { setIsProfileDropdownOpen(false); onNavigate('dashboard'); }}
                                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                                                <LayoutDashboard className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="block font-medium">Dashboard</span>
                                                <span className="text-[10px] text-slate-500">Manage your projects</span>
                                            </div>
                                        </button>
                                        <button 
                                          onClick={() => { setIsProfileDropdownOpen(false); onNavigate('settings'); }}
                                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                                                <Settings className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="block font-medium">Settings</span>
                                                <span className="text-[10px] text-slate-500">Preferences & API keys</span>
                                            </div>
                                        </button>
                                        <button 
                                          onClick={() => { setIsProfileDropdownOpen(false); onNavigate('billing'); }}
                                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                                                <CreditCard className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="block font-medium">Billing</span>
                                                <span className="text-[10px] text-slate-500">Invoices & Payment methods</span>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Footer */}
                                    <div className="p-2 border-t border-white/5 bg-slate-950/30">
                                         <button 
                                            onClick={() => { setIsProfileDropdownOpen(false); onLogout(); }} 
                                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                        >
                                            <LogOut className="w-3.5 h-3.5" /> Sign Out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <button onClick={() => onNavigate('auth')} className="text-sm font-medium text-white bg-violet-600 px-4 py-2 rounded-lg hover:bg-violet-500 transition-colors shadow-lg shadow-violet-500/20">
                        Sign In
                    </button>
                )}
            </div>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-slate-800 p-2 rounded-md text-slate-400 hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-panel border-b border-white/5">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
               {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${
                       activeTab === item.id 
                      ? 'bg-violet-600/20 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
                {user && (
                  <div className="pt-4 mt-4 border-t border-white/10">
                     <div className="flex items-center gap-3 px-3 mb-3">
                         <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                             <UserIcon className="w-4 h-4 text-slate-400" />
                         </div>
                         <div>
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                         </div>
                     </div>
                     <button onClick={() => { setIsMobileMenuOpen(false); onNavigate('dashboard'); }} className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:bg-white/5">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                     </button>
                     <button onClick={() => { setIsMobileMenuOpen(false); onNavigate('settings'); }} className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:bg-white/5">
                        <Settings className="w-4 h-4" /> Settings
                     </button>
                     <button onClick={() => { setIsMobileMenuOpen(false); onNavigate('billing'); }} className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:bg-white/5">
                        <CreditCard className="w-4 h-4" /> Billing
                     </button>
                     <button onClick={onLogout} className="flex w-full items-center gap-2 px-3 py-2 mt-2 rounded-md text-base font-medium text-rose-400 hover:bg-rose-500/10">
                        <LogOut className="w-4 h-4" /> Logout
                     </button>
                  </div>
                )}
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
        {children}
      </main>

       <footer className="relative z-10 border-t border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>© 2026 Planora. Intelligent Curriculum Design.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
};