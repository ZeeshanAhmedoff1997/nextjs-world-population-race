/**
 * Animation utility functions
 */

import { CHART_ANIMATION } from '@/constants/animation';

/**
 * Check if animation should be skipped based on thresholds
 * @param firstY - Initial Y position
 * @param lastY - Final Y position
 * @param firstW - Initial width
 * @param lastW - Final width
 * @returns True if animation should be skipped
 */
export function shouldSkipAnimation(
  firstY: number,
  lastY: number,
  firstW: number,
  lastW: number,
): boolean {
  return (
    Math.abs(firstY - lastY) < CHART_ANIMATION.MIN_THRESHOLD_Y &&
    Math.abs(firstW - lastW) < CHART_ANIMATION.MIN_THRESHOLD_W
  );
}

/**
 * Safely cancel all animations on an element
 * @param element - DOM element to cancel animations on
 */
export function cancelAnimations(element: Element): void {
  const animations = element.getAnimations();
  if (animations.length > 0) {
    animations.forEach((anim) => anim.cancel());
  }
}

/**
 * Create safe width values for animations (prevents negative values)
 * @param width - Input width
 * @param minWidth - Minimum allowed width
 * @returns Safe width value
 */
export function createSafeWidth(width: number, minWidth = 1): number {
  return Math.max(minWidth, width);
}
