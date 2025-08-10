'use client';

import { useMemo } from 'react';

import { bandScale, linearScale } from '@/lib/chart/scales';
import type { CountryRow } from '@/lib/data/types';

export function useChartScales(
  rows: readonly CountryRow[],
  innerW: number,
  innerH: number,
) {
  const names = useMemo(() => rows.map((r) => r.name), [rows]);

  const x = useMemo(
    () => linearScale([0, Math.max(...rows.map((r) => r.pop), 0)], [0, innerW]),
    [rows, innerW],
  );

  const y = useMemo(() => bandScale(names, [0, innerH], 0.25), [names, innerH]);

  const bandwidth = y.bandwidth;

  return { x, y, bandwidth, names };
}
