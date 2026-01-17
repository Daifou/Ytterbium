import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence, useMotionTemplate } from 'framer-motion';

const MotionDiv = motion.div as any;

interface NeuralPulse {
  id: number;
  x: number;
  y: number;
  direction: 'horizontal' | 'vertical';
  distance: number;
  duration: number;
}

export const Background: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXPixels = useMotionValue(0);
  const mouseYPixels = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 400 };
  const x = useSpring(useTransform(mouseX, [-1, 1], [-15, 15]), springConfig);
  const y = useSpring(useTransform(mouseY, [-1, 1], [-15, 15]), springConfig);

  const [pulses, setPulses] = useState<NeuralPulse[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) * 2 - 1);
      mouseY.set((e.clientY / innerHeight) * 2 - 1);
      mouseXPixels.set(e.clientX);
      mouseYPixels.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, mouseXPixels, mouseYPixels]);

  // WARP: Almost invisible, just a subtle lens effect
  const warpMask = useMotionTemplate`radial-gradient(circle 120px at ${mouseXPixels}px ${mouseYPixels}px, black, transparent)`;

  useEffect(() => {
    let timeoutId: number;
    let pulseCount = 0;

    const spawnPulse = () => {
      const gridSize = 60;
      const isVertical = Math.random() > 0.5;

      const pulse: NeuralPulse = {
        id: Date.now() + pulseCount++,
        x: Math.round((Math.random() * window.innerWidth) / gridSize) * gridSize,
        y: Math.round((Math.random() * window.innerHeight) / gridSize) * gridSize,
        direction: isVertical ? 'vertical' : 'horizontal',
        distance: 200 + Math.random() * 300,
        duration: 3 + Math.random() * 4,
      };

      setPulses(prev => [...prev, pulse]);
      setTimeout(() => {
        setPulses(prev => prev.filter(p => p.id !== pulse.id));
      }, (pulse.duration * 1000) + 100);

      const nextInterval = (15000 + Math.random() * 20000); // Rare pulses
      timeoutId = window.setTimeout(spawnPulse, nextInterval);
    };

    timeoutId = window.setTimeout(spawnPulse, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    // OBSIDIAN BASE
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#050505]">

      <MotionDiv
        style={{ x, y }}
        className="absolute inset-[-50px] opacity-[0.03] transition-opacity duration-1000"
      >
        {/* GRID: Pure White, Extremely Low Opacity */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 80%)'
          }}
        />

        {/* STARS: White only */}
        {Array.from({ length: 12 }).map((_, i) => (
          <MotionDiv
            key={i}
            className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_4px_white]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}

        {/* LENS DISTORTION */}
        <MotionDiv
          className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            scale: 1.002,
            maskImage: warpMask,
            WebkitMaskImage: warpMask,
          }}
        />

        {/* PULSES: White/Gray only */}
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
                opacity: [0, 0.1, 0],
                width: pulse.direction === 'horizontal' ? pulse.distance : 1,
                height: pulse.direction === 'vertical' ? pulse.distance : 1,
              }}
              transition={{
                duration: pulse.duration,
                ease: "linear"
              }}
              className="absolute bg-white/20 shadow-[0_0_4px_rgba(255,255,255,0.1)]"
            />
          ))}
        </AnimatePresence>
      </MotionDiv>

      {/* AMBIENT FOG: Dark Gray/Black only - No colors */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#050505] to-transparent opacity-90" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#050505]/90" />

      {/* VIGNETTE */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />

    </div>
  );
};