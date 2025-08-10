import 'server-only';

import { cache } from 'react';
import rawJson from './populationByYear.json' assert { type: 'json' };
import { safeParseDataset } from './schema';
import type { CountryRow, DatasetNormalized, YearData } from './types';

function sortRows(rows: CountryRow[]): CountryRow[] {
  return rows
    .slice()
    .sort((a, b) => b.pop - a.pop || a.name.localeCompare(b.name));
}

function dedupe(rows: CountryRow[]): CountryRow[] {
  const map = new Map<string, CountryRow>();
  for (const r of rows) {
    const prev = map.get(r.name);
    if (!prev || r.pop > prev.pop) map.set(r.name, r);
  }
  return Array.from(map.values());
}

// Create stable top-N rankings for smooth animations
function createStableRankings(
  allYearData: YearData[],
  n: number,
): Map<number, readonly CountryRow[]> {
  // Find all countries that appear in any year's top N
  const allTopCountries = new Set<string>();
  for (const yearData of allYearData) {
    const topN = yearData.rows.slice(0, n);
    for (const row of topN) {
      allTopCountries.add(row.name);
    }
  }

  const stableCountries = Array.from(allTopCountries).sort();
  const rankings = new Map<number, readonly CountryRow[]>();

  for (const yearData of allYearData) {
    const yearRows = new Map(yearData.rows.map((r) => [r.name, r]));

    // Create entries for all stable countries, with 0 pop if not present this year
    const stableRows: CountryRow[] = stableCountries.map(
      (name) => yearRows.get(name) || { name, pop: 0 },
    );

    // Sort by population for this year
    stableRows.sort((a, b) => b.pop - a.pop || a.name.localeCompare(b.name));

    // Take top N, but ensure we always have exactly N entries
    const topNStable = stableRows.slice(0, n);

    rankings.set(yearData.year, Object.freeze(topNStable));
  }

  return rankings;
}

function freezeMap<K, V>(m: Map<K, V>): ReadonlyMap<K, V> {
  return m;
}

export const getDataset = cache<() => DatasetNormalized>(() => {
  const parsed = safeParseDataset(rawJson);

  const normalized: YearData[] = parsed.map((yb) => {
    const rows: CountryRow[] = yb.Countries.map((c) => ({
      name: c.Country.trim(),
      pop: c.Population,
    }));
    const uniq = dedupe(rows);
    return Object.freeze({
      year: yb.Year,
      rows: Object.freeze(sortRows(uniq)),
    });
  });

  const years = Object.freeze(
    normalized.map((y) => y.year).sort((a, b) => a - b),
  );

  const byYear = new Map<number, readonly CountryRow[]>();
  let maxPop = 0;

  for (const y of normalized) {
    byYear.set(y.year, y.rows);
    for (const r of y.rows) {
      if (r.pop > maxPop) maxPop = r.pop;
    }
  }

  // Use stable rankings for smooth animations
  const top10 = createStableRankings(normalized, 10);
  const top15 = createStableRankings(normalized, 15);

  return Object.freeze({
    years,
    byYear: freezeMap(byYear),
    maxPop,
    top10: freezeMap(top10),
    top15: freezeMap(top15),
  });
});

export function getYears(): readonly number[] {
  return getDataset().years;
}

export function getSlice(year: number, count: 10 | 15): readonly CountryRow[] {
  const { top10, top15 } = getDataset();
  const map = count === 10 ? top10 : top15;
  return map.get(year) ?? [];
}

export function getMaxPop(): number {
  return getDataset().maxPop;
}

export function getAllSlices(
  count: 10 | 15,
): Record<number, readonly CountryRow[]> {
  const ds = getDataset();
  const src = count === 10 ? ds.top10 : ds.top15;
  const out: Record<number, readonly CountryRow[]> = {};
  for (const [year, rows] of src.entries()) out[year] = rows;
  return out;
}
