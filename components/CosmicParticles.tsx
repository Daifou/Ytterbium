import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

export const CosmicParticles: React.FC = () => {
  // Generate stable random positions for particles
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // %
      y: Math.random() * 100, // %
      size: Math.random() > 0.8 ? 2 : 1, // 1px or 2px
      opacity: 0.1 + Math.random() * 0.2, // Low opacity
      duration: 20 + Math.random() * 40, // Very slow movement
      delay: Math.random() * -20,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <MotionDiv
          key={p.id}
          className="absolute bg-white rounded-full mix-blend-screen"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -30, 0], // Slow vertical drift
            x: [0, 15, 0], // Slight horizontal drift
            opacity: [0, p.opacity, 0], // Twinkle in and out
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
      
      {/* Subtle Dust Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};