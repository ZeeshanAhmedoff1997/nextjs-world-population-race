/**
 * Chart utility functions
 */

/**
 * Simple easing function approximating the cubic-bezier we use for WAAPI
 * @param t - Progress value between 0 and 1
 * @returns Eased value
 */
export function ease(t: number): number {
  // cubic in/out-ish curve: smooth and close to EASE constant
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Escape attribute selector for country names with spaces/commas etc.
 * @param s - String to escape
 * @returns Escaped string safe for CSS selectors
 */
export function cssEscape(s: string): string {
  return s.replace(/["\\]/g, '\\$&');
}

/**
 * Calculate chart height based on number of rows and margins
 * @param rowCount - Number of data rows
 * @param rowHeight - Height per row
 * @param marginTop - Top margin
 * @param marginBottom - Bottom margin
 * @returns Total chart height
 */
export function calculateChartHeight(
  rowCount: number,
  rowHeight: number,
  marginTop: number,
  marginBottom: number,
): number {
  return marginTop + marginBottom + rowCount * rowHeight + marginBottom;
}
