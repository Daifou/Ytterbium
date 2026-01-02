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
    // Updated: tighter rounding, more compact max-width/height feel, and refined border
    <div ref={containerRef} className="w-full h-full bg-zinc-950/20 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl transition-all hover:shadow-[0_0_20px_-10px_rgba(99,102,241,0.3)] relative flex flex-col group/panel">

      {/* Energetic Link Layer - Abstract Neural Line */}
      <svg className="absolute top-0 left-4 w-4 h-full pointer-events-none z-0 opacity-30">
        <defs>
          <linearGradient id="neural-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Draw vertical connector for completed tasks */}
        <MotionLine
          x1="10" y1="40" x2="10" y2="100%"
          stroke="url(#neural-gradient)"
          strokeWidth="0.5"
          strokeDasharray="2 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: tasks.some(t => t.completed) ? 1 : 0,
            opacity: tasks.some(t => t.completed) ? 0.4 : 0
          }}
          transition={{ duration: 0.5 }}
        />
      </svg>

      {/* Updated: Condensed Header with tracking-tighter */}
      <div className="px-2.5 py-1 border-b border-white/[0.05] flex justify-between items-center bg-black/40 relative z-10 shrink-0">
        <h3 className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Nodes</h3>
        <button onClick={() => setIsAdding(true)} className="text-zinc-500 hover:text-white transition-colors">
          <Plus className="w-2.5 h-2.5" />
        </button>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <AIAttention key={task.id}>
              <MotionDiv
                layout
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                // Updated: py-0 and height limit for ultra-compact density
                className="group flex items-center justify-between px-2 py-[2px] min-h-[24px] hover:bg-white/[0.03] transition-all duration-200 cursor-default border-l border-transparent hover:border-indigo-500/30"
              >
                <div className="flex items-center gap-2">
                  <button onClick={(e) => handleTaskToggle(task.id, e)} className="text-zinc-600 hover:text-indigo-400 transition-colors relative">
                    {/* Energy burst on check */}
                    {task.completed && (
                      <MotionDiv
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-indigo-500/50 rounded-full blur-sm"
                      />
                    )}
                    {task.completed ? (
                      <CheckCircle2 className="w-2.5 h-2.5 text-indigo-400" />
                    ) : (
                      <Circle className="w-2.5 h-2.5 opacity-40" />
                    )}
                  </button>
                  <span className={`text-[10px] tracking-tight transition-colors ${task.completed ? 'text-zinc-600 line-through' : 'text-zinc-300 group-hover:text-white'}`}>
                    {task.title}
                  </span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-zinc-400 transition-opacity">
                  <MoreHorizontal className="w-2.5 h-2.5" />
                </button>

                {/* Neural Connector to next task if both checked */}
                {task.completed && tasks[index + 1]?.completed && (
                  <MotionDiv
                    layoutId={`link-${index}`}
                    // Updated: Thinner line and subtle glow
                    className="absolute left-[25px] top-6 w-[1px] h-full bg-indigo-500/40 shadow-[0_0_4px_rgba(99,102,241,0.4)] z-0"
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }} // Adjusted to 100% for precise stacking
                    transition={{ duration: 0.3, delay: 0.1 }}
                  />
                )}

              </MotionDiv>
            </AIAttention>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && !isAdding && (
          <div className="px-2 py-4 text-center text-[8px] uppercase tracking-tighter text-zinc-700">
            Empty Dataset
          </div>
        )}

        {isAdding && (
          <form onSubmit={handleSubmit} className="px-2 py-1.5 bg-indigo-500/5">
            <input
              type="text"
              autoFocus
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Initialize task..."
              className="w-full bg-transparent text-[10px] text-indigo-200 placeholder-zinc-700 focus:outline-none font-mono"
              onBlur={() => !newTaskTitle && setIsAdding(false)}
            />
          </form>
        )}
      </div>
    </div>
  );
};