'use client';

import { useEffect, useRef } from 'react';

export function useLiveRegion() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = document.createElement('div');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    el.className = 'sr-only';
    document.body.appendChild(el);
    ref.current = el;
    return () => {
      el.remove();
    };
  }, []);

  const announce = (msg: string) => {
    if (ref.current) ref.current.textContent = msg;
  };
  return announce;
}
