import React from 'react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AIAttentionProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const AIAttention: React.FC<AIAttentionProps> = ({ children, className = "", onClick }) => {
  return (
    <MotionDiv
      className={`relative group ${className}`}
      onClick={onClick}
      whileHover="hover"
      initial="initial"
    >
      {/* The Attention Field - Soft Radial Ripple */}
      <MotionDiv
        variants={{
          initial: { opacity: 0, scale: 0.8 },
          hover: { opacity: 0.15, scale: 1.4 }
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute inset-0 bg-radial-gradient from-indigo-400 to-transparent rounded-xl blur-md -z-10 bg-indigo-400"
      />

      {/* Scanning Line Effect */}
      <MotionDiv
        variants={{
          initial: { opacity: 0, x: '-100%' },
          hover: { opacity: 0.5, x: '200%' }
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none -z-10"
      />

      {children}
    </MotionDiv>
  );
};