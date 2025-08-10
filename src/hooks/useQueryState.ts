'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export function useQueryState<T extends string>(
  key: string,
  initial: T,
): readonly [T, (next: T) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const value = (params.get(key) as T) ?? initial;

  const set = useCallback(
    (next: T) => {
      const p = new URLSearchParams(params);
      p.set(key, String(next));
      router.replace(`${pathname}?${p.toString()}`, { scroll: false });
    },
    [params, pathname, router, key],
  );

  return [value, set] as const;
}

export function useNumberQueryState(
  key: string,
  initial: number,
): readonly [number, (next: number) => void] {
  const [raw, setRaw] = useQueryState<string>(key, String(initial));

  const n = useMemo(() => {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : initial;
  }, [raw, initial]);

  const set = useCallback((next: number) => setRaw(String(next)), [setRaw]);
  return [n, set] as const;
}
