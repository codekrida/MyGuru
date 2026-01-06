
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const PerformanceTracker: React.FC = () => {
  const weeklyData = [
    { day: 'Mon', score: 65 },
    { day: 'Tue', score: 72 },
    { day: 'Wed', score: 85 },
    { day: 'Thu', score: 78 },
    { day: 'Fri', score: 90 },
    { day: 'Sat', score: 95 },
    { day: 'Sun', score: 88 },
  ];

  const subjectMastery = [
    { subject: 'Maths', A: 120, fullMark: 150 },
    { subject: 'Science', A: 98, fullMark: 150 },
    { subject: 'Social', A: 86, fullMark: 150 },
    { subject: 'English', A: 99, fullMark: 150 },
    { subject: 'Hindi', A: 85, fullMark: 150 },
  ];

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Your Learning Progress</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-6">Quiz Scores (This Week)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-6">Subject Mastery</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={subjectMastery}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} axisLine={false} tick={false} />
                <Radar name="Student" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
           <p className="text-indigo-600 text-sm font-bold uppercase mb-2">Study Streak</p>
           <h4 className="text-3xl font-bold text-indigo-900">12 Days</h4>
           <p className="text-indigo-700/60 text-xs mt-1">Keep it up! 3 more to level up.</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
           <p className="text-emerald-600 text-sm font-bold uppercase mb-2">Total Questions</p>
           <h4 className="text-3xl font-bold text-emerald-900">248</h4>
           <p className="text-emerald-700/60 text-xs mt-1">Answered this month</p>
        </div>
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
           <p className="text-amber-600 text-sm font-bold uppercase mb-2">Avg. Accuracy</p>
           <h4 className="text-3xl font-bold text-amber-900">82%</h4>
           <p className="text-amber-700/60 text-xs mt-1">Top 5% in your board</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTracker;
