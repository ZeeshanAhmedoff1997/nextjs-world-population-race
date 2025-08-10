export function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
export function cssEscape(s: string): string {
  return s.replace(/["\\]/g, '\\$&');
}
export function calculateChartHeight(
  rowCount: number,
  rowHeight: number,
  marginTop: number,
  marginBottom: number,
): number {
  return marginTop + marginBottom + rowCount * rowHeight + marginBottom;
}
