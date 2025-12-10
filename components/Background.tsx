import React, { useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence, useMotionTemplate } from 'framer-motion';

const MotionDiv = motion.div as any;

// Types for the neural pulses
interface NeuralPulse {
  id: number;
  x: number;
  y: number;
  direction: 'horizontal' | 'vertical';
  distance: number;
  duration: number;
  delay: number;
}

export const Background: React.FC = () => {
  // Parallax Values (Normalized -1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Raw Pixel Values for Dimensional Cursor
  const mouseXPixels = useMotionValue(0);
  const mouseYPixels = useMotionValue(0);

  // Smooth out mouse movements for parallax
  const springConfig = { damping: 50, stiffness: 400 };
  const x = useSpring(useTransform(mouseX, [-1, 1], [-15, 15]), springConfig);
  const y = useSpring(useTransform(mouseY, [-1, 1], [-15, 15]), springConfig);

  const [pulses, setPulses] = useState<NeuralPulse[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalize mouse coordinates to -1 to 1 for parallax
      mouseX.set((e.clientX / innerWidth) * 2 - 1);
      mouseY.set((e.clientY / innerHeight) * 2 - 1);

      // Update raw pixels for local distortion
      mouseXPixels.set(e.clientX);
      mouseYPixels.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, mouseXPixels, mouseYPixels]);

  // Create dynamic mask for the dimensional warp
  // Slightly reduced radius for tighter "force field" feel
  const warpMask = useMotionTemplate`radial-gradient(circle 100px at ${mouseXPixels}px ${mouseYPixels}px, black, transparent)`;

  // Neural Pulse Logic
  useEffect(() => {
    let timeoutId: number;
    let pulseCount = 0;

    const spawnPulse = () => {
      // Grid size is roughly 60px based on CSS below. Snap to grid-ish coordinates.
      const gridSize = 60;
      const isVertical = Math.random() > 0.5;

      const pulse: NeuralPulse = {
        id: Date.now() + pulseCount++,
        // Snap to grid lines roughly
        x: Math.round((Math.random() * window.innerWidth) / gridSize) * gridSize,
        y: Math.round((Math.random() * window.innerHeight) / gridSize) * gridSize,
        direction: isVertical ? 'vertical' : 'horizontal',
        distance: 200 + Math.random() * 300, // Length of travel
        duration: 3 + Math.random() * 4, // Slow travel speed
        delay: 0
      };

      setPulses(prev => [...prev, pulse]);

      // Cleanup pulse after animation
      setTimeout(() => {
        setPulses(prev => prev.filter(p => p.id !== pulse.id));
      }, (pulse.duration * 1000) + 100);

      // Schedule next pulse (20s to 40s)
      const nextInterval = (20000 + Math.random() * 20000);
      timeoutId = window.setTimeout(spawnPulse, nextInterval);
    };

    // Initial delay before first pulse
    timeoutId = window.setTimeout(spawnPulse, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#09090b]">

      {/* Container for Grid + Parallax */}
      <MotionDiv
        style={{ x, y }}
        className="absolute inset-[-50px] opacity-[0.15] transition-opacity duration-1000" // Brightened from 0.07 to 0.15
        animate={{
          x: [0, 5, 0], // Slow drift
          y: [0, -5, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Base Grid Layer */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e4e4e7 1px, transparent 1px),
              linear-gradient(to bottom, #e4e4e7 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 100%)'
          }}
        />

        {/* Glowing Nodes / Stars - Randomly placed */}
        {Array.from({ length: 8 }).map((_, i) => (
          <MotionDiv
            key={i}
            className="absolute w-[3px] h-[3px] bg-white rounded-full shadow-[0_0_8px_white]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}

        {/* Subtle Drifting Particles - Extra layer for depth */}
        {Array.from({ length: 15 }).map((_, i) => (
          <MotionDiv
            key={`particle-${i}`}
            className="absolute w-[1px] h-[1px] bg-indigo-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20 - Math.random() * 30],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
          />
        ))}

        {/* Dimensional Warp Layer (Cursor Distortion) */}
        {/* Scale reduced to 1.005 for a subtle 1-2px shift at edges of the lens */}
        <MotionDiv
          className="absolute inset-0 w-full h-full opacity-60 mix-blend-overlay"
          style={{
            backgroundImage: `
              linear-gradient(to right, #a1a1aa 1px, transparent 1px),
              linear-gradient(to bottom, #a1a1aa 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            scale: 1.005, // Very subtle scale for 1px warp
            maskImage: warpMask,
            WebkitMaskImage: warpMask,
          }}
        />

        {/* Neural Pulse Lines Layer */}
        <AnimatePresence>
          {pulses.map(pulse => (
            <MotionDiv
              key={pulse.id}
              initial={{
                opacity: 0,
                left: pulse.x,
                top: pulse.y,
                width: pulse.direction === 'horizontal' ? 0 : 1,
                height: pulse.direction === 'vertical' ? 0 : 1
              }}
              animate={{
                opacity: [0, 0.2, 0], // Reduced max opacity for faintness
                width: pulse.direction === 'horizontal' ? pulse.distance : 1,
                height: pulse.direction === 'vertical' ? pulse.distance : 1,
              }}
              transition={{
                duration: pulse.duration,
                ease: "linear"
              }}
              className="absolute bg-indigo-400/20 shadow-[0_0_8px_rgba(129,140,248,0.2)]"
              style={{
                // Gradient to look like a signal trail
                background: pulse.direction === 'horizontal'
                  ? 'linear-gradient(90deg, transparent, rgba(129,140,248,0.3), transparent)'
                  : 'linear-gradient(180deg, transparent, rgba(129,140,248,0.3), transparent)'
              }}
            />
          ))}
        </AnimatePresence>
      </MotionDiv>

      {/* Floating Ambient Orbs - Endel Style */}
      <MotionDiv
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen"
      />
      <MotionDiv
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -50, 0],
          scale: [1, 1.2, 0.95, 1]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-violet-500/10 rounded-full blur-[100px] mix-blend-screen"
      />
      <MotionDiv
        animate={{
          x: [0, 20, -30, 0],
          y: [0, -20, 40, 0],
          scale: [1, 0.9, 1.1, 1]
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] bg-blue-500/5 rounded-full blur-[140px] mix-blend-screen"
      />

      {/* Top Gradient Overlay for Depth */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#09090b] to-transparent opacity-80" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#09090b]/80" />
    </div>
  );
};