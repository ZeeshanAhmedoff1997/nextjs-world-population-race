import 'server-only';
import { cache } from 'react';

import { CHART_TOP_COUNTRIES_BAR_LIMIT as LIMIT } from '@/constants/chart';

import { computeYears, freezeMap, indexByYear, toYearData } from './normalize';
import { parseRaw } from './parse';
import { createStableRankings } from './rankings';
import type { CountryRow, DatasetNormalized } from './types';

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
