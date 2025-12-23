import React, { useState, useRef, useEffect } from 'react';
import { Plus, Circle, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../types';
import { useQuantumRipple } from '../hooks/useQuantumRipple';
import { AIAttention } from './AIAttention';

const MotionDiv = motion.div as any;
const MotionLine = motion.line as any;

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onAdd: (title: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onAdd }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { triggerRipple } = useQuantumRipple();

  // Refs to track task positions for the neural link line
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAdd(newTaskTitle);
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  const handleTaskToggle = (id: string, e: React.MouseEvent) => {
    triggerRipple({ intensity: 'large', x: e.clientX, y: e.clientY, force: true });
    onToggle(id);
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden shadow-2xl transition-all hover:shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] relative flex flex-col group/panel">

      {/* Energetic Link Layer - Abstract Neural Line */}
      <svg className="absolute top-0 left-6 w-4 h-full pointer-events-none z-0 opacity-50">
        <defs>
          <linearGradient id="neural-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Draw vertical connector for completed tasks */}
        <MotionLine
          x1="10" y1="40" x2="10" y2="100%"
          stroke="url(#neural-gradient)"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: tasks.some(t => t.completed) ? 1 : 0,
            opacity: tasks.some(t => t.completed) ? 0.6 : 0
          }}
          transition={{ duration: 0.5 }}
        />
      </svg>

      <div className="px-3 py-1.5 border-b border-white/[0.03] flex justify-between items-center bg-zinc-900/90 relative z-10 shrink-0">
        <h3 className="text-[11px] font-medium text-gray-400">Contextual Tasks</h3>
        <button onClick={() => setIsAdding(true)} className="text-gray-500 hover:text-primary transition-colors">
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <AIAttention key={task.id}>
              <MotionDiv
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="group flex items-center justify-between px-2 py-1.5 hover:bg-white/5 transition-all duration-300 cursor-default border-l-2 border-transparent hover:border-white/10"
              >
                <div className="flex items-center gap-3">
                  <button onClick={(e) => handleTaskToggle(task.id, e)} className="text-gray-500 hover:text-primary transition-colors relative">
                    {/* Energy burst on check */}
                    {task.completed && (
                      <MotionDiv
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-indigo-500 rounded-full blur-md"
                      />
                    )}
                    {task.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Circle className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className={`text-[11px] transition-colors ${task.completed ? 'text-gray-600 line-through' : 'text-gray-200 group-hover:text-white'}`}>
                    {task.title}
                  </span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-gray-400 transition-opacity">
                  <MoreHorizontal className="w-3 h-3" />
                </button>

                {/* Neural Connector to next task if both checked */}
                {task.completed && tasks[index + 1]?.completed && (
                  <MotionDiv
                    layoutId={`link-${index}`}
                    className="absolute left-[29px] top-8 w-[2px] h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] z-0"
                    initial={{ height: 0 }}
                    animate={{ height: '140%' }} // Extend to next item
                    transition={{ duration: 0.3, delay: 0.1 }}
                  />
                )}

              </MotionDiv>
            </AIAttention>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && !isAdding && (
          <div className="px-2 py-3 text-center text-[9px] text-gray-600">
            No active tasks linked.
          </div>
        )}

        {isAdding && (
          <form onSubmit={handleSubmit} className="px-2 py-1.5">
            <input
              type="text"
              autoFocus
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="New objective..."
              className="w-full bg-transparent text-[11px] text-gray-200 placeholder-gray-600 focus:outline-none font-sans"
              onBlur={() => !newTaskTitle && setIsAdding(false)}
            />
          </form>
        )}
      </div>
    </div>
  );
};