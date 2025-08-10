/**
 * Animation-related constants for performance optimization
 */

// Chart animation constants
export const CHART_ANIMATION = {
  DURATION: 400, // Faster for better performance
  EASING: 'ease-out', // Simpler easing for better performance
  MIN_THRESHOLD_Y: 2, // Skip animations for small position changes
  MIN_THRESHOLD_W: 4, // Skip animations for small width changes
} as const;

// Background animation constants
export const BACKGROUND_ANIMATION = {
  BLOB_DURATION: 8, // seconds
  BLOB_EASING: 'ease-in-out',
  BLOB_DELAY: 4000, // milliseconds
} as const;
