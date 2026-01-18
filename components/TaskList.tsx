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
    <div id="task-list-node" ref={containerRef} className="w-full h-full bg-neutral-900/80 backdrop-blur-xl border border-neutral-700/50 rounded-xl overflow-hidden relative flex flex-col group/panel transition-all duration-300 hover:border-neutral-600/50">

      {/* Energetic Link Layer - Abstract Neural Line */}
      <svg className="absolute top-0 left-4 w-4 h-full pointer-events-none z-0 opacity-30">
        <defs>
          <linearGradient id="neural-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
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
            opacity: tasks.some(t => t.completed) ? 0.2 : 0
          }}
          transition={{ duration: 0.5 }}
        />
      </svg>

      <div className="px-3 py-2 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 relative z-10 shrink-0">
        <h3 className="text-[10px] font-bold text-neutral-500 tracking-wider">TASKS</h3>
        <button onClick={() => setIsAdding(true)} className="text-neutral-500 hover:text-neutral-100 transition-colors">
          <Plus className="w-4 h-4" />
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
                className="group flex items-center justify-between px-3 py-2.5 hover:bg-neutral-800 transition-all duration-200 cursor-default border-l-2 border-transparent hover:border-primary/50 relative"
              >
                <div className="flex items-center gap-3">
                  <button onClick={(e) => handleTaskToggle(task.id, e)} className="text-neutral-500 hover:text-primary transition-colors relative">
                    {/* Energy burst on check */}
                    {task.completed && (
                      <MotionDiv
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-primary/30 rounded-full blur-sm"
                      />
                    )}
                    {task.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 opacity-30" />
                    )}
                  </button>
                  <span className={`text-[11px] font-medium transition-colors ${task.completed ? 'text-neutral-600' : 'text-neutral-300 group-hover:text-neutral-100'}`}>
                    {task.title}
                  </span>
                </div>

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === task.id ? null : task.id);
                    }}
                    className={`text-neutral-600 hover:text-neutral-400 transition-opacity ${openMenuId === task.id ? 'opacity-100 text-neutral-200' : 'opacity-0 group-hover:opacity-100'}`}
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
                        className="absolute right-0 top-6 z-50 w-24 bg-neutral-900 border border-neutral-700/50 rounded-lg shadow-2xl overflow-hidden"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(task.id);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-primary hover:bg-neutral-800 transition-colors font-bold"
                        >
                          <Trash2 className="w-3 h-3" />
                          DELETE
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Neural Connector to next task if both checked */}
                {task.completed && tasks[index + 1]?.completed && (
                  <MotionDiv
                    layoutId={`link-${index}`}
                    className="absolute left-[25px] top-7 w-[1px] h-full bg-primary/20 z-0"
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
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