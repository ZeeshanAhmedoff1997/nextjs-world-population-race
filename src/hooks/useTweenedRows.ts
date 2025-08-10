'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

export type Row = { name: string; pop: number };
type Slice = readonly Row[];

const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function useTweenedRows(prev: Slice, next: Slice, n = 10, dur = 900) {
  const [frameRows, setFrameRows] = useState<Slice>(next);

  const names = useMemo(() => {
    const s = new Set<string>();
    prev.forEach((r) => s.add(r.name));
    next.forEach((r) => s.add(r.name));
    return Array.from(s);
  }, [prev, next]);

  const prevMap = useMemo(
    () => new Map(prev.map((r) => [r.name, r.pop])),
    [prev],
  );
  const nextMap = useMemo(
    () => new Map(next.map((r) => [r.name, r.pop])),
    [next],
  );
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const k = ease(p);

      const blended = names.map((name) => {
        const a = prevMap.get(name) ?? 0;
        const b = nextMap.get(name) ?? 0;
        return { name, pop: Math.round(a + (b - a) * k) };
      });

      blended.sort((a, b) => b.pop - a.pop || a.name.localeCompare(b.name));
      setFrameRows(blended.slice(0, n));

      if (p < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [names, prevMap, nextMap, n, dur]);

  return frameRows;
}
