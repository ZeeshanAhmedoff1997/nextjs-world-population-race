export const linearScale = (
  [d0, d1]: [number, number],
  [r0, r1]: [number, number],
) => {
  const m = (r1 - r0) / Math.max(d1 - d0, 1);
  return (x: number) => r0 + (x - d0) * m;
};

export function bandScale(
  domain: readonly string[],
  [r0, r1]: [number, number],
  padding = 0.2,
) {
  const n = Math.max(domain.length, 1);
  const step = (r1 - r0) / n;
  const bw = step * (1 - padding);
  const offset = r0 + (step - bw) / 2;
  const index = new Map(domain.map((d, i) => [d, i]));
  const scale = (d: string) => (index.get(d) ?? 0) * step + offset;
  return Object.assign(scale, { bandwidth: bw, step });
}
