import React, { useState, useRef, useEffect } from 'react';
import { Plus, Circle, CheckCircle2, MoreHorizontal, Trash2 } from 'lucide-react';
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
  onDelete?: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onAdd, onDelete }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { triggerRipple } = useQuantumRipple();

  // Refs to track task positions for the neural link link
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

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

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
    setOpenMenuId(null);
  };

  return (
    <div id="task-list-node" ref={containerRef} className="w-full h-full bg-[#0f0f12]/60 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_12px_48px_rgba(0,0,0,0.6)] relative flex flex-col group/panel">

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

      <div className="px-3 py-1.5 border-b border-white/[0.03] flex justify-between items-center bg-zinc-900/90 relative z-10 shrink-0">
        <h3 className="text-[11px] font-medium text-gray-400">Contextual Tasks</h3>
        <button onClick={() => setIsAdding(true)} className="text-gray-500 hover:text-white transition-colors">
          <Plus className="w-3.5 h-3.5" />
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
                className="group flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-all duration-300 cursor-default border-l-2 border-transparent hover:border-white/10 relative"
              >
                <div className="flex items-center gap-3">
                  <button onClick={(e) => handleTaskToggle(task.id, e)} className="text-gray-500 hover:text-indigo-400 transition-colors relative">
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
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 opacity-50" />
                    )}
                  </button>
                  <span className={`text-[11px] transition-colors ${task.completed ? 'text-gray-500 line-through' : 'text-gray-200 group-hover:text-white'}`}>
                    {task.title}
                  </span>
                </div>

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === task.id ? null : task.id);
                    }}
                    className={`text-gray-600 hover:text-gray-400 transition-opacity ${openMenuId === task.id ? 'opacity-100 text-gray-200' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>

                  <AnimatePresence>
                    {openMenuId === task.id && (
                      <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        className="absolute right-0 top-6 z-50 w-24 bg-[#18181b] border border-zinc-700 rounded-lg shadow-xl overflow-hidden"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(task.id);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

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
          <div className="px-2 py-4 text-center text-[10px] text-gray-600">
            No active tasks linked.
          </div>
        )}

        {isAdding && (
          <form onSubmit={handleSubmit} className="px-2 py-2">
            <input
              type="text"
              autoFocus
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="New objective..."
              className="w-full bg-transparent text-[11px] text-gray-300 placeholder-gray-600 focus:outline-none font-sans"
              onBlur={() => !newTaskTitle && setIsAdding(false)}
            />
          </form>
        )}
      </div>
    </div>
  );
};