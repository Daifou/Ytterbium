import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

const MESSAGES = [
  'Stability increasing...',
  'Cognitive load leveling...',
  'Neural flow optimal.',
  'Interference low.',
  'Biometric sync established.',
  'Entropy reducing...',
  'Waveform steady.',
  'Pattern recognition active.',
  'Mental state: coherent.',
  'System optimal.',
  'Focus depth: nominal.'
];

export const AIWhisper: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: number;

    const triggerMessage = () => {
      const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      setMessage(msg);

      // Hide message after 5 seconds
      window.setTimeout(() => setMessage(null), 5000);

      // Schedule next message: 5 to 10 minutes (300,000ms - 600,000ms)
      const nextDelay = 300000 + Math.random() * 300000;
      timeoutId = window.setTimeout(triggerMessage, nextDelay);
    };

    // Initial trigger shortly after mount
    timeoutId = window.setTimeout(triggerMessage, 15000);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-40 pointer-events-none mix-blend-plus-lighter">
      <AnimatePresence>
        {message && (
          <MotionDiv
            initial={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 10, filter: 'blur(8px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-end gap-1"
          >
            {/* Decorative Line */}
            <div className="h-px w-12 bg-gradient-to-l from-indigo-400/40 to-transparent" />
            
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] tracking-[0.3em] text-indigo-200/50 uppercase select-none">
                SYS :: {message}
              </span>
              <div className="w-1 h-1 bg-indigo-500/50 rounded-full animate-pulse" />
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};