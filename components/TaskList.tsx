import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check, MoreHorizontal, Trash2, Circle } from 'lucide-react';
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

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
    if (onDelete) onDelete(id);
    setOpenMenuId(null);
  };

  return (
    // LAW OF BREATHING ROOM: Double padding (p-6)
    // LAW OF PRECISION GEOMETRY: rounded-3xl, 1px border
    <div ref={containerRef} className="w-full h-full bg-[#050505] border border-white/[0.05] rounded-3xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] relative flex flex-col group/panel">

      {/* Connector Line - Subtle Gray */}
      <svg className="absolute top-0 left-6 w-4 h-full pointer-events-none z-0 opacity-20">
        <MotionLine
          x1="8" y1="40" x2="8" y2="100%"
          stroke="white"
          strokeWidth="0.5"
          strokeDasharray="2 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: tasks.length > 0 ? 1 : 0,
            opacity: tasks.length > 0 ? 0.5 : 0
          }}
          transition={{ duration: 1 }}
        />
      </svg>

      {/* Header */}
      <div className="px-6 py-6 flex justify-between items-center relative z-10 shrink-0">
        <h3 className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#444]">Objectives</h3>
        <button onClick={() => setIsAdding(true)} className="text-[#444] hover:text-white transition-colors">
          <Plus className="w-4 h-4 stroke-[1.5px]" />
        </button>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <AIAttention key={task.id}>
              <MotionDiv
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="group flex items-center justify-between px-2 py-3 hover:bg-white/[0.02] transition-colors rounded-lg mb-1"
              >
                <div className="flex items-center gap-4">
                  <button onClick={(e) => handleTaskToggle(task.id, e)} className="group/check relative">
                    <div className={`w-4 h-4 rounded-full border transition-all duration-300 flex items-center justify-center ${task.completed ? 'border-[#00FF85] bg-[#00FF85]/10' : 'border-white/20 group-hover/check:border-white/40'}`}>
                      {task.completed && <Check className="w-2.5 h-2.5 text-[#00FF85]" />}
                    </div>
                  </button>

                  {/* INVISIBLE HIERARCHY: Completed tasks fade to 30% opacity */}
                  <span className={`text-[12px] font-medium tracking-wide transition-all duration-300 ${task.completed ? 'text-white/30 line-through decoration-white/10' : 'text-white/90'}`}>
                    {task.title}
                  </span>
                </div>

                <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === task.id ? null : task.id);
                    }}
                    className={`text-zinc-600 hover:text-white transition-colors ${openMenuId === task.id ? 'opacity-100 text-white' : ''}`}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {openMenuId === task.id && (
                      <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-6 z-50 w-24 bg-[#111] border border-white/10 rounded-md shadow-2xl overflow-hidden py-1"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(task.id);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-wider text-red-500 hover:bg-white/5 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </MotionDiv>
            </AIAttention>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && !isAdding && (
          <div className="pt-8 text-center">
            <div className="inline-block px-3 py-1 rounded-full border border-white/[0.05] bg-white/[0.01]">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#333]">No Active Threads</span>
            </div>
          </div>
        )}

        {isAdding && (
          <form onSubmit={handleSubmit} className="px-2 py-3">
            <input
              type="text"
              autoFocus
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter new directive..."
              className="w-full bg-transparent text-[12px] text-white placeholder-zinc-700 focus:outline-none font-sans tracking-wide"
              onBlur={() => !newTaskTitle && setIsAdding(false)}
            />
          </form>
        )}
      </div>
    </div>
  );
};