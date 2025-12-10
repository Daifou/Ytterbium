import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RIPPLE_EVENT_NAME, RippleEventDetail, RIPPLE_CONFIG } from '../hooks/useQuantumRipple';

const MotionDiv = motion.div as any;

interface QuantumRippleBackgroundProps {
  zIndex?: number;
}

export const QuantumRippleBackground: React.FC<QuantumRippleBackgroundProps> = ({ 
  zIndex = 0 
}) => {
  const [ripples, setRipples] = useState<RippleEventDetail[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check accessibility settings
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Listen for trigger events
  useEffect(() => {
    const handleRippleTrigger = (e: CustomEvent<RippleEventDetail>) => {
      const { detail } = e;
      
      // Calculate coordinates if not provided (default to center of screen)
      if (detail.x === undefined || detail.y === undefined) {
          detail.x = window.innerWidth / 2;
          detail.y = window.innerHeight / 2;
      }

      setRipples((prev) => [...prev, detail]);
      
      // Safety cleanup
      if (ripples.length > 20) {
        setRipples(prev => prev.slice(1));
      }
    };

    window.addEventListener(RIPPLE_EVENT_NAME as any, handleRippleTrigger);
    return () => {
      window.removeEventListener(RIPPLE_EVENT_NAME as any, handleRippleTrigger);
    };
  }, [ripples.length]);

  const handleAnimationComplete = (id: string) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  if (prefersReducedMotion) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex }}
    >
      <AnimatePresence>
        {ripples.map((ripple) => {
          const config = RIPPLE_CONFIG[ripple.intensity];
          
          return (
            <MotionDiv
              key={ripple.id}
              initial={{ 
                opacity: 0, 
                scale: 0.2,
                x: ripple.x, 
                y: ripple.y,
              }}
              animate={{ 
                opacity: [0, config.opacity, 0], 
                scale: 1,
              }}
              transition={{ 
                duration: config.duration, 
                ease: RIPPLE_CONFIG.easing 
              }}
              onAnimationComplete={() => handleAnimationComplete(ripple.id)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: config.endRadius * 2,
                height: config.endRadius * 2,
                marginLeft: -config.endRadius,
                marginTop: -config.endRadius,
                borderRadius: '50%',
                // Visual warping effect using borders and blending
                // Thin, subtle border
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 0 10px rgba(255,255,255,0.05), inset 0 0 5px rgba(255,255,255,0.02)',
                mixBlendMode: 'overlay', // Creates the "distortion" look against dark bg
                willChange: 'transform, opacity',
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};