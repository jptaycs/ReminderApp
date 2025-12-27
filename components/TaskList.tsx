
import React, { useState } from 'react';
import { 
  Filter, 
  MoreHorizontal, 
  Trash2, 
  Edit2, 
  CheckCircle, 
  Circle,
  Clock,
  ChevronDown,
  Plus
} from 'lucide-react';
import { Task, Category, Priority } from '../types';

interface TaskListProps {
  tasks: Task[];
  toggleComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  onEdit: (task: Task) => void;
  onAdd: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, toggleComplete, deleteTask, onEdit, onAdd }) => {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('dueDate');

  const filteredTasks = tasks
    .filter(t => filter === 'All' || t.category === filter)
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime();
    });

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.HIGH: return 'text-rose-500 bg-rose-50';
      case Priority.MEDIUM: return 'text-amber-500 bg-amber-50';
      case Priority.LOW: return 'text-emerald-500 bg-emerald-50';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Tasks</h2>
          <p className="text-slate-500 font-medium">Manage your personal and business obligations.</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus size={20} />
          Create Task
        </button>
      </div>

      {/* Filters & Tabs */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-2">
        {['All', ...Object.values(Category)].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === cat ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List Table/Cards */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="group bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex items-center gap-4">
              <button 
                onClick={() => toggleComplete(task.id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${task.isCompleted ? 'bg-emerald-500 text-white' : 'border-2 border-slate-200 hover:border-indigo-500'}`}
              >
                {task.isCompleted ? <CheckCircle size={18} /> : <Circle size={18} className="text-transparent" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-bold text-lg truncate ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {task.title}
                  </h3>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${task.category === Category.BUSINESS ? 'bg-blue-500' : task.category === Category.BILLS ? 'bg-amber-500' : task.category === Category.TAXES ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                    {task.category}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock size={14} className="text-slate-400" />
                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onEdit(task)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-20 border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No tasks found</h3>
            <p className="text-slate-500 max-w-xs mt-2 font-medium">Clear your filters or add a new task to get started on your business journey.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
