import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Landing } from './views/Landing';
import { Generator } from './views/Generator';
import { CurriculumView } from './views/CurriculumView';
import { AnalyticsView } from './views/AnalyticsView';
import { Advisor } from './views/Advisor';
import { Auth } from './views/Auth';
import { Dashboard } from './views/Dashboard';
import { Settings } from './views/Settings';
import { Billing } from './views/Billing';
import { CurriculumData, User, ProgramType, UserRole } from './types';
import { generateCurriculumAI } from './services/aiGenerator';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [curriculumData, setCurriculumData] = useState<CurriculumData | null>(null);
  const [history, setHistory] = useState<CurriculumData[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard'); // Redirect to dashboard after login
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
    setCurriculumData(null);
    setHistory([]);
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const handleGenerate = (data: CurriculumData) => {
    setCurriculumData(data);
    setHistory(prev => {
        // Prevent duplicates if re-generating same ID (unlikely but safe)
        if (prev.some(item => item.id === data.id)) return prev;
        return [data, ...prev];
    });
    setCurrentView('curriculum');
  };

  const handleUpdateCurriculum = (updatedData: CurriculumData) => {
    setCurriculumData(updatedData);
    setHistory(prev => prev.map(item => item.id === updatedData.id ? updatedData : item));
  };

  const handleViewHistoryItem = (data: CurriculumData) => {
    setCurriculumData(data);
    setCurrentView('curriculum');
  };

  // Auth Guard Logic
  const renderContent = () => {
    if (currentView === 'landing') {
      return <Landing onStart={() => setCurrentView(user ? 'generator' : 'auth')} />;
    }
    
    if (currentView === 'auth') {
      if (user) {
        setCurrentView('dashboard');
        return null;
      }
      return <Auth onLogin={handleLogin} />;
    }

    // Protected Routes
    if (!user) {
      setCurrentView('auth');
      return null;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentView} history={history} onViewItem={handleViewHistoryItem} />;
      case 'settings':
        return <Settings user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />;
      case 'billing':
        return <Billing user={user} onUpdateUser={handleUpdateUser} />;
      case 'generator':
        return <Generator onGenerate={handleGenerate} />;
      case 'curriculum':
        return curriculumData ? <CurriculumView data={curriculumData} onUpdate={handleUpdateCurriculum} /> : <Generator onGenerate={handleGenerate} />;
      case 'analytics':
        return curriculumData ? <AnalyticsView data={curriculumData} /> : <div className="text-center mt-20 text-slate-400">No data available. Please generate a curriculum first.</div>;
      case 'advisor':
        return <Advisor curriculumData={curriculumData} />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentView} history={history} onViewItem={handleViewHistoryItem} />;
    }
  };

  // If on Auth page, don't show the main dashboard layout
  if (currentView === 'auth') {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout activeTab={currentView} onNavigate={setCurrentView} user={user} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
}

export default App;