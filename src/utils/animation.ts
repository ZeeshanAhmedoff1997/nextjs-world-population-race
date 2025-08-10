import { CHART_ANIMATION } from '@/constants/animation';

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
export function cancelAnimations(element: Element): void {
  const animations = element.getAnimations();
  if (animations.length > 0) {
    animations.forEach((anim) => anim.cancel());
  }
}
export function createSafeWidth(width: number, minWidth = 1): number {
  return Math.max(minWidth, width);
}
