import { EPS } from '@/constants/chart';

import type { CountryRow, YearData } from './types';

export function createStableRankings(
  allYearData: YearData[],
  n: number,
): Map<number, readonly CountryRow[]> {
  const allTopCountries = new Set<string>();
  for (const yd of allYearData)
    for (const r of yd.rows.slice(0, n)) allTopCountries.add(r.name);

  const stableCountries = Array.from(allTopCountries).sort();
  const rankings = new Map<number, readonly CountryRow[]>();

  for (const yd of allYearData) {
    const yearRows = new Map(yd.rows.map((r) => [r.name, r]));
    const stableRows: CountryRow[] = stableCountries.map(
      (name) => yearRows.get(name) || { name, pop: 0 },
    );
    stableRows.sort((a, b) => {
      const d = b.pop - a.pop;
      if (Math.abs(d) > EPS) return d;
      return a.name.localeCompare(b.name);
    });
    rankings.set(yd.year, Object.freeze(stableRows.slice(0, n)));
  }
  return rankings;
}
