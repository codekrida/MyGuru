
import React, { useState } from 'react';
import { UserProfile, Subject } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIChat from './components/AIChat';
import Quiz from './components/Quiz';
import PerformanceTracker from './components/PerformanceTracker';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile>({ name: '', standard: '10th', board: 'CBSE' });
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeSubject, setActiveSubject] = useState<Subject>('Mathematics');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.name.trim()) setIsLoggedIn(true);
  };

  const handleSelectSubject = (subject: Subject) => {
    setActiveSubject(subject);
    setCurrentView('tutor');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">🕉️</span>
            <h1 className="text-3xl font-bold text-slate-800 font-display">GuruAI</h1>
            <p className="text-slate-500 mt-2">Welcome, Student! Let's start learning.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Student Name</label>
              <input
                type="text"
                required
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="Enter your name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Standard</label>
                <select
                  className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200"
                  value={user.standard}
                  onChange={(e) => setUser({ ...user, standard: e.target.value as any })}
                >
                  <option>8th</option>
                  <option>9th</option>
                  <option>10th</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Board</label>
                <select
                  className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200"
                  value={user.board}
                  onChange={(e) => setUser({ ...user, board: e.target.value as any })}
                >
                  <option>CBSE</option>
                  <option>ICSE</option>
                  <option>State Board</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transform active:scale-95 transition-all shadow-lg"
            >
              Start My Journey
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-8">
            Empowering Indian students with AI-driven learning.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onLogout={() => setIsLoggedIn(false)} 
      />
      
      <main className="flex-1 ml-64 min-h-screen">
        {currentView === 'dashboard' && (
          <Dashboard user={user} onSelectSubject={handleSelectSubject} />
        )}
        {currentView === 'tutor' && (
          <AIChat user={user} initialSubject={activeSubject} />
        )}
        {currentView === 'quiz' && (
          <Quiz user={user} />
        )}
        {currentView === 'analytics' && (
          <PerformanceTracker />
        )}
      </main>
    </div>
  );
};

export default App;
