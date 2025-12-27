
import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Flag, Tag, Repeat } from 'lucide-react';
import { Task, Category, Priority, BillType, TaxType } from '../types';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  initialData?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    category: Category.PERSONAL,
    subType: '',
    priority: Priority.MEDIUM,
    dueDate: new Date().toISOString().slice(0, 16),
    recurring: 'Monthly' as any,
    isCompleted: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        notes: initialData.notes || '',
        category: initialData.category,
        subType: initialData.subType || '',
        priority: initialData.priority,
        dueDate: new Date(initialData.dueDate).toISOString().slice(0, 16),
        recurring: initialData.recurring || 'Monthly',
        isCompleted: initialData.isCompleted
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString()
    });
  };

  const getSubtypes = () => {
    if (formData.category === Category.BILLS) return Object.values(BillType);
    if (formData.category === Category.TAXES) return Object.values(TaxType);
    return [];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <h2 className="text-2xl font-black text-slate-900">{initialData ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[75vh]">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">What needs to be done?</label>
            <input 
              required
              type="text" 
              placeholder="e.g., BIR Quarterly Filing"
              className="w-full text-xl font-bold py-3 px-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1">
                <Tag size={12} /> Category
              </label>
              <select 
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as Category, subType: ''})}
              >
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1">
                <Flag size={12} /> Priority
              </label>
              <select 
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as Priority})}
              >
                {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {getSubtypes().length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Specific Type</label>
              <select 
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.subType}
                onChange={(e) => setFormData({...formData, subType: e.target.value})}
              >
                <option value="">Select Subtype...</option>
                {getSubtypes().map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1">
                <CalendarIcon size={12} /> Due Date
              </label>
              <input 
                type="datetime-local"
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
             <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1">
                <Repeat size={12} /> Recurring
              </label>
              <select 
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={formData.recurring}
                onChange={(e) => setFormData({...formData, recurring: e.target.value as any})}
              >
                <option value="">Never</option>
                {['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Notes</label>
            <textarea 
              rows={3}
              placeholder="Add details, links, or specific instructions..."
              className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] mt-4"
          >
            {initialData ? 'Update Obligation' : 'Save Obligation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
