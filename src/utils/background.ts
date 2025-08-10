/**
 * Background utility functions
 */

import type { ParticleConfig } from '@/types/background';
import { PARTICLES } from '@/constants/background';

/**
 * Generate particle configuration for static background particles
 * @param index - Particle index
 * @returns Particle configuration object
 */
export function generateParticleConfig(index: number): ParticleConfig {
  const left = (index * PARTICLES.DISTRIBUTION_X) % 100;
  const top = (index * PARTICLES.DISTRIBUTION_Y) % 100;
  const size = index % 3 === 0 ? 'w-1.5 h-1.5' : 'w-1 h-1';
  const opacity = index % 4 === 0 ? 'opacity-40' : 'opacity-25';

  return {
    left,
    top,
    size,
    opacity,
  };
}

/**
 * Generate array of particle configurations
 * @param count - Number of particles to generate
 * @returns Array of particle configurations
 */
export function generateParticles(count: number): ParticleConfig[] {
  return Array.from({ length: count }, (_, index) =>
    generateParticleConfig(index),
  );
}
