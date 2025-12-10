import { useRef, useCallback } from 'react';

// Configuration types
export type RippleIntensity = 'small' | 'medium' | 'large';

export interface RippleEventDetail {
  id: string;
  x?: number;
  y?: number;
  intensity: RippleIntensity;
}

export const RIPPLE_EVENT_NAME = 'quantum-ripple-trigger';

// Configuration constants for physics/visuals
// Opacity drastically reduced for "almost invisible" feel
export const RIPPLE_CONFIG = {
  small: { endRadius: 60, opacity: 0.02, duration: 0.6 },
  medium: { endRadius: 120, opacity: 0.04, duration: 0.8 },
  large: { endRadius: 200, opacity: 0.06, duration: 1.0 },
  easing: [0.22, 1, 0.36, 1] as const, // cubic-bezier
};

export const useQuantumRipple = () => {
  // Throttling to prevent performance degradation on high-frequency triggers
  const lastTriggerTime = useRef<number>(0);

  const triggerRipple = useCallback((
    params: { 
      x?: number; 
      y?: number; 
      intensity: RippleIntensity;
      force?: boolean; // Bypass throttle
    }
  ) => {
    const now = performance.now();
    
    // Throttle small ripples (e.g., timer ticks) to max 10 per second
    if (params.intensity === 'small' && !params.force && now - lastTriggerTime.current < 100) {
      return;
    }
    lastTriggerTime.current = now;

    // Dispatch event to decoupling the render layer
    const event = new CustomEvent<RippleEventDetail>(RIPPLE_EVENT_NAME, {
      detail: {
        id: crypto.randomUUID(),
        x: params.x,
        y: params.y,
        intensity: params.intensity,
      },
    });
    window.dispatchEvent(event);
  }, []);

  return { triggerRipple };
};