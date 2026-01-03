import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface MacNotificationProps {
  isVisible: boolean;
  title: string;
  message: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const MacNotification: React.FC<MacNotificationProps> = ({
  isVisible,
  title,
  message,
  icon,
  onClose,
  action
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[10000] min-w-[320px] max-w-sm"
        >
          <div className="relative group rounded-2xl overflow-hidden bg-[#1c1c1e]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            {/* Glossy top edge */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
            
            <div className="p-4 flex gap-3 items-start">
              {/* App Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#3a3a3c] to-[#2c2c2e] border border-white/10 shadow-inner flex items-center justify-center">
                  {icon || <div className="w-5 h-5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-[13px] font-semibold text-white/95 leading-tight tracking-wide font-sf-pro">
                    {title}
                  </h4>
                  <span className="text-[10px] text-white/40">Now</span>
                </div>
                <p className="text-[13px] text-white/70 leading-snug font-medium">
                  {message}
                </p>
              </div>

              {/* Close Button (Hover only or always visible?) - Apple style usually relies on swipe or timeout, but adding specific close for web */}
              {onClose && !action && (
                <button 
                  onClick={onClose}
                  className="absolute top-2 right-2 p-1 rounded-full text-white/20 hover:text-white/60 hover:bg-white/10 transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Action Button Area (if present) */}
            {action && (
              <div className="px-4 pb-3 flex justify-end">
                <button
                  onClick={action.onClick}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[12px] font-medium text-white transition-colors border border-white/5"
                >
                    {action.label}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
