
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Task, Category } from '../types';

interface CalendarViewProps {
  tasks: Task[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getTasksForDay = (day: number) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === day && 
             taskDate.getMonth() === currentDate.getMonth() && 
             taskDate.getFullYear() === currentDate.getFullYear();
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Calendar</h2>
          <p className="text-slate-500 font-medium">Visual timeline of your obligations.</p>
        </div>
        <div className="flex items-center bg-white p-2 rounded-2xl shadow-sm border border-slate-100 space-x-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-slate-900 px-4">{monthYear}</span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-4 text-center text-xs font-black uppercase text-slate-400 tracking-widest">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {padding.map(i => (
            <div key={`pad-${i}`} className="h-32 md:h-40 border-b border-r border-slate-50 bg-slate-50/30"></div>
          ))}
          {days.map(day => {
            const dayTasks = getTasksForDay(day);
            const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
            
            return (
              <div key={day} className="h-32 md:h-40 border-b border-r border-slate-100 p-2 relative hover:bg-slate-50/50 transition-colors group">
                <span className={`text-sm font-bold flex items-center justify-center w-8 h-8 rounded-full ${isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400'}`}>
                  {day}
                </span>
                
                <div className="mt-2 space-y-1 overflow-y-auto no-scrollbar max-h-[calc(100%-40px)]">
                  {dayTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`text-[9px] md:text-[10px] p-1.5 rounded-lg border font-bold truncate ${
                        task.category === Category.TAXES ? 'bg-rose-50 border-rose-100 text-rose-600' :
                        task.category === Category.BILLS ? 'bg-amber-50 border-amber-100 text-amber-600' :
                        task.category === Category.BUSINESS ? 'bg-blue-50 border-blue-100 text-blue-600' :
                        'bg-indigo-50 border-indigo-100 text-indigo-600'
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>

                <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-white shadow-sm border border-slate-100 rounded-lg text-indigo-600 transition-all scale-75">
                  <Plus size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
