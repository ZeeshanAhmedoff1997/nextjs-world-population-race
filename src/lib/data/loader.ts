import 'server-only';
import { cache } from 'react';
import { CHART_TOP_COUNTRIES_BAR_LIMIT as LIMIT } from '@/constants/chart';
import type { DatasetNormalized, CountryRow } from './types';

import { parseRaw } from './parse';
import { toYearData, computeYears, indexByYear, freezeMap } from './normalize';
import { createStableRankings } from './rankings';

export const getDataset = cache<() => DatasetNormalized>(() => {
  const parsed = parseRaw();
  const normalized = toYearData(parsed);
  const years = computeYears(normalized);

  const { byYear, maxPop } = indexByYear(normalized);
  const topN = createStableRankings(normalized, LIMIT);

  return Object.freeze({
    years,
    byYear: freezeMap(byYear),
    maxPop,
    topN,
  });
});

export function getYears(): readonly number[] {
  return getDataset().years;
}

export function getSlice(year: number): readonly CountryRow[] {
  return getDataset().topN.get(year) ?? [];
}

export function getMaxPop(): number {
  return getDataset().maxPop;
}

export function getAllSlices(): Record<number, readonly CountryRow[]> {
  const src = getDataset().topN;
  const out: Record<number, readonly CountryRow[]> = {};
  for (const [year, rows] of src.entries()) out[year] = rows;
  return out;
}
