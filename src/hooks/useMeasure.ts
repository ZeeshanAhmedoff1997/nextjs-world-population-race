'use client';
import { useEffect, useRef, useState } from 'react';

export function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [w, setW] = useState(800);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) =>
      setW(Math.round(entry.contentRect.width)),
    );
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return { ref, width: w };
}
