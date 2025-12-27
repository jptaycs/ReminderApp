
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Settings, 
  Plus, 
  Search,
  Bell,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Briefcase,
  User,
  Zap,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Task, Category, Priority, SummaryData } from './types';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import TaskForm from './components/TaskForm';
import { getSmartTaskSuggestions } from './services/geminiService';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('prosync_tasks');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Q1 BIR Tax Filing',
        category: Category.TAXES,
        priority: Priority.HIGH,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
        isCompleted: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Electricity Bill Payment',
        category: Category.BILLS,
        priority: Priority.MEDIUM,
        dueDate: new Date().toISOString(),
        isCompleted: false,
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'calendar' | 'settings'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('prosync_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const fetchAiSuggestions = async () => {
    setIsAiLoading(true);
    try {
      const suggestions = await getSmartTaskSuggestions(tasks);
      setAiSuggestions(suggestions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const stats = useMemo<SummaryData>(() => {
    const now = new Date();
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.isCompleted).length,
      overdue: tasks.filter(t => !t.isCompleted && new Date(t.dueDate) < now).length,
      upcoming: tasks.filter(t => !t.isCompleted && new Date(t.dueDate) >= now).length
    };
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    setIsFormOpen(false);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    setEditingTask(undefined);
    setIsFormOpen(false);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 apple-glass border-r border-slate-200 p-6 space-y-8 h-screen sticky top-0">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <CheckSquare size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">ProSync</h1>
        </div>

        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'tasks' ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <CheckSquare size={20} />
            <span>Tasks</span>
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'calendar' ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <CalendarIcon size={20} />
            <span>Calendar</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="bg-slate-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Storage</span>
            <span className="text-xs font-medium text-slate-600">Local Only</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-[10%]" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen bg-slate-50/50 pb-20 md:pb-0 overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-20 apple-glass border-b border-slate-200/50 px-6 py-4 flex items-center justify-between">
          <div className="md:hidden flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <CheckSquare size={18} />
            </div>
            <span className="font-bold text-lg">ProSync</span>
          </div>
          
          <div className="hidden md:flex items-center relative group max-w-md w-full mr-4">
            <Search className="absolute left-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks, bills, or taxes..."
              className="w-full bg-slate-100/50 border-none rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-sm"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={fetchAiSuggestions}
              className={`p-2 rounded-full hover:bg-indigo-50 text-indigo-600 transition-colors ${isAiLoading ? 'animate-pulse' : ''}`}
              title="Get Smart AI Suggestions"
            >
              <Sparkles size={20} />
            </button>
            <div className="relative">
              <Bell className="text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors" size={22} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                2
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white ring-offset-2 cursor-pointer shadow-md">
              JD
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              tasks={tasks} 
              stats={stats} 
              toggleComplete={toggleComplete} 
              aiSuggestions={aiSuggestions}
              onAddTask={() => {
                setEditingTask(undefined);
                setIsFormOpen(true);
              }}
            />
          )}
          {activeTab === 'tasks' && (
            <TaskList 
              tasks={tasks} 
              toggleComplete={toggleComplete} 
              deleteTask={deleteTask}
              onEdit={(t) => {
                setEditingTask(t);
                setIsFormOpen(true);
              }}
              onAdd={() => {
                setEditingTask(undefined);
                setIsFormOpen(true);
              }}
            />
          )}
          {activeTab === 'calendar' && (
            <CalendarView tasks={tasks} />
          )}
          {activeTab === 'settings' && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
               <Settings size={48} className="mb-4 opacity-20" />
               <p className="text-lg font-medium">Settings coming soon</p>
               <p className="text-sm">Manage FaceID, Sync, and Custom Categories</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button (Mobile Only) */}
      <button 
        onClick={() => {
          setEditingTask(undefined);
          setIsFormOpen(true);
        }}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-95 transition-transform"
      >
        <Plus size={28} />
      </button>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 apple-glass border-t border-slate-200 flex justify-around py-3 px-2 z-40">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'tasks' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <CheckSquare size={20} />
          <span className="text-[10px] font-medium">Tasks</span>
        </button>
        <div className="w-12"></div> {/* Spacer for FAB */}
        <button 
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'calendar' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <CalendarIcon size={20} />
          <span className="text-[10px] font-medium">Calendar</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'settings' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <Settings size={20} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>

      {/* Task Modal */}
      {isFormOpen && (
        <TaskForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={editingTask ? (data) => updateTask(editingTask.id, data) : addTask}
          initialData={editingTask}
        />
      )}
    </div>
  );
};

export default App;
