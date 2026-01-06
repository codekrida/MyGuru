
import React from 'react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'tutor', label: 'Guru AI Chat', icon: '🤖' },
    { id: 'quiz', label: 'Quick Quiz', icon: '📝' },
    { id: 'analytics', label: 'My Progress', icon: '📊' },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2 font-display">
          <span className="text-3xl">🕉️</span> GuruAI
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Standard 8-10 Tutor</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentView === item.id
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
        >
          <span className="text-xl">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
