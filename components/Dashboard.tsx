
import React from 'react';
import { UserProfile, Subject } from '../types';

interface DashboardProps {
  user: UserProfile;
  onSelectSubject: (subject: Subject) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onSelectSubject }) => {
  const subjects: { name: Subject; color: string; icon: string; chapters: number }[] = [
    { name: 'Mathematics', color: 'bg-blue-500', icon: '📐', chapters: 15 },
    { name: 'Science', color: 'bg-green-500', icon: '🧪', chapters: 18 },
    { name: 'Social Science', color: 'bg-orange-500', icon: '🌍', chapters: 22 },
    { name: 'English', color: 'bg-purple-500', icon: '📖', chapters: 12 },
    { name: 'Hindi', color: 'bg-red-500', icon: '✍️', chapters: 10 },
  ];

  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Namaste, {user.name}! 🙏</h2>
        <p className="text-slate-500">You're studying for {user.standard} ({user.board}). Ready to learn something new today?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub) => (
          <div
            key={sub.name}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => onSelectSubject(sub.name)}
          >
            <div className={`w-12 h-12 ${sub.color} rounded-xl flex items-center justify-center text-2xl mb-4 text-white group-hover:scale-110 transition-transform`}>
              {sub.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{sub.name}</h3>
            <p className="text-slate-500 text-sm mb-4">{sub.chapters} Chapters total</p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className={`${sub.color} h-full w-[15%]`} />
            </div>
            <p className="text-xs text-slate-400 mt-2">15% syllabus completed</p>
          </div>
        ))}
      </div>

      <section className="mt-12 bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h3 className="text-2xl font-bold mb-4">Exam Prep: 10th Board countdown!</h3>
          <p className="opacity-90 mb-6">Focus on Previous Year Questions (PYQs) for Algebra and Chemical Reactions today. Your AI Guru is ready to help.</p>
          <button className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold hover:bg-indigo-50 transition-colors">
            Start Revision
          </button>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
             <span className="text-[120px]">📚</span>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
