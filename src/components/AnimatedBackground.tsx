'use client';

import { useEffect, useState, memo } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { PARTICLES } from '@/constants/background';
import { generateParticles } from '@/utils/background';

const AnimatedBackground = memo(function AnimatedBackground() {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Simple static background for SSR, reduced motion, or performance
  if (!isMounted || prefersReducedMotion) {
    return (
      <div className='absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
        <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3e%3cdefs%3e%3cpattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"%3e%3cpath d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/%3e%3c/pattern%3e%3c/defs%3e%3crect width="100%25" height="100%25" fill="url(%23grid)" /%3e%3c/svg%3e")] opacity-20'></div>
      </div>
    );
  }

  return (
    <div className='absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'>
      {/* Optimized gradient orbs - only 2 for better performance */}
      <div className='absolute top-0 left-0 w-80 h-80 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob'></div>
      <div className='absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000'></div>

      {/* Static particles for optimal performance */}
      <div className='absolute inset-0 pointer-events-none'>
        {generateParticles(PARTICLES.COUNT).map((particle, i) => (
          <div
            key={i}
            className={`absolute ${particle.size} bg-white rounded-full ${particle.opacity}`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3e%3cdefs%3e%3cpattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"%3e%3cpath d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/%3e%3c/pattern%3e%3c/defs%3e%3crect width="100%25" height="100%25" fill="url(%23grid)" /%3e%3c/svg%3e")] opacity-20'></div>
    </div>
  );
});

export default AnimatedBackground;
