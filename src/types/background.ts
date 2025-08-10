/**
 * Background component type definitions
 */

// Particle configuration types
export interface ParticleConfig {
  left: number;
  top: number;
  size: string;
  opacity: string;
}

// Animation configuration types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}
