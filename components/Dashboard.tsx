
import React from 'react';
import { 
  TrendingUp, 
  CreditCard, 
  ShieldCheck, 
  User, 
  ChevronRight, 
  Clock, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Task, Category, SummaryData } from '../types';

interface DashboardProps {
  tasks: Task[];
  stats: SummaryData;
  toggleComplete: (id: string) => void;
  aiSuggestions: any[];
  onAddTask: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, stats, toggleComplete, aiSuggestions, onAddTask }) => {
  const upcomingTasks = tasks
    .filter(t => !t.isCompleted)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case Category.BILLS: return 'bg-amber-100 text-amber-600';
      case Category.BUSINESS: return 'bg-blue-100 text-blue-600';
      case Category.TAXES: return 'bg-rose-100 text-rose-600';
      case Category.PERSONAL: return 'bg-indigo-100 text-indigo-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case Category.BILLS: return <CreditCard size={18} />;
      case Category.BUSINESS: return <TrendingUp size={18} />;
      case Category.TAXES: return <ShieldCheck size={18} />;
      default: return <User size={18} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Greeting */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Good Morning, John</h2>
        <p className="text-slate-500 mt-1 font-medium">You have {stats.upcoming} upcoming tasks today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Business', count: tasks.filter(t => t.category === Category.BUSINESS && !t.isCompleted).length, color: 'text-blue-600', icon: <TrendingUp /> },
          { label: 'Taxes', count: tasks.filter(t => t.category === Category.TAXES && !t.isCompleted).length, color: 'text-rose-600', icon: <ShieldCheck /> },
          { label: 'Bills', count: tasks.filter(t => t.category === Category.BILLS && !t.isCompleted).length, color: 'text-amber-600', icon: <CreditCard /> },
          { label: 'Personal', count: tasks.filter(t => t.category === Category.PERSONAL && !t.isCompleted).length, color: 'text-indigo-600', icon: <User /> },
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${getCategoryColor(card.label as Category)}`}>
              {card.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">{card.count}</span>
              <span className="text-sm font-medium text-slate-500">{card.label} Tasks</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Section */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Clock className="text-indigo-600" size={20} />
                Upcoming Deadlines
              </h3>
              <button className="text-sm font-semibold text-indigo-600 flex items-center hover:underline">
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 group">
                    <button 
                      onClick={() => toggleComplete(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all ${task.isCompleted ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 hover:border-indigo-500'}`}
                    >
                      {task.isCompleted && (
                        <svg className="w-full h-full text-white p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold text-slate-900">{task.title}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getCategoryColor(task.category)}`}>
                          {task.category}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="text-slate-400" size={18} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <p>All caught up!</p>
                </div>
              )}
            </div>
          </section>

          {/* Overdue Alert */}
          {stats.overdue > 0 && (
            <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 flex-shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-rose-900">Urgent: {stats.overdue} Overdue Task{stats.overdue > 1 ? 's' : ''}</h4>
                <p className="text-rose-700 text-sm">Please review your pending tax payments or bills to avoid penalties.</p>
              </div>
              <button className="bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-colors ml-auto">
                Fix Now
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Features */}
        <div className="space-y-6">
          {/* AI Suggestions Card */}
          <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl overflow-hidden relative">
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="text-indigo-200" size={20} />
                <h3 className="font-bold tracking-tight">Smart Suggestions</h3>
              </div>
              <div className="space-y-3">
                {aiSuggestions.length > 0 ? (
                  aiSuggestions.map((s, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-bold text-sm leading-tight pr-2">{s.title}</h4>
                        <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-md uppercase font-bold">{s.category}</span>
                      </div>
                      <p className="text-[11px] text-white/70">{s.reason}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-white/50 text-sm">
                    <p>Click the sparkles above for AI recommendations based on your habits.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Quick Stats Card */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold mb-4">Focus Score</h3>
            <div className="flex flex-col items-center py-4">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="transparent" stroke="#F1F5F9" strokeWidth="8" />
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="56" 
                    fill="transparent" 
                    stroke="url(#gradient)" 
                    strokeWidth="8" 
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - (stats.completed / (stats.total || 1)))}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#9333EA" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900">{Math.round((stats.completed / (stats.total || 1)) * 100)}%</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Done</span>
                </div>
              </div>
              <p className="text-xs text-center text-slate-500 font-medium">You've completed {stats.completed} tasks this week. Keep going!</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
