import { PARTICLES } from '@/constants/background';
import type { ParticleConfig } from '@/types/background';

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
export function generateParticles(count: number): ParticleConfig[] {
  return Array.from({ length: count }, (_, index) =>
    generateParticleConfig(index),
  );
}
