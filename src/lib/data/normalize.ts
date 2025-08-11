import { EPS } from '@/constants/chart';

import type { CountryRow, YearData } from './types';

export function sortRows(rows: CountryRow[]): CountryRow[] {
  return rows.slice().sort((a, b) => {
    const d = b.pop - a.pop;
    if (Math.abs(d) > EPS) return d;
    return a.name.localeCompare(b.name);
  });
}

export function dedupe(rows: CountryRow[]): CountryRow[] {
  const map = new Map<string, CountryRow>();
  for (const r of rows) {
    const prev = map.get(r.name);
    if (!prev || r.pop > prev.pop) map.set(r.name, r);
  }
  return Array.from(map.values());
}

export function toYearData(parsed: unknown): YearData[] {
  const arr = (Array.isArray(parsed) ? parsed : []) as unknown[];
  return arr.map((yb) => {
    const countries = (
      yb as {
        Countries: Array<{ Country: string; Population: number }>;
        Year: number;
      }
    ).Countries;
    const rows: CountryRow[] = countries.map((c) => ({
      name: c.Country.trim(),
      pop: c.Population,
    }));
    const uniq = dedupe(rows);
    return Object.freeze({
      year: (yb as { Year: number }).Year,
      rows: Object.freeze(sortRows(uniq)),
    });
  });
}

export function computeYears(normalized: YearData[]): readonly number[] {
  return Object.freeze(normalized.map((y) => y.year).sort((a, b) => a - b));
}

export function indexByYear(normalized: YearData[]) {
  const byYear = new Map<number, readonly CountryRow[]>();
  let maxPop = 0;
  for (const y of normalized) {
    byYear.set(y.year, y.rows);
    for (const r of y.rows) if (r.pop > maxPop) maxPop = r.pop;
  }
  return { byYear, maxPop };
}

export function freezeMap<K, V>(m: Map<K, V>): ReadonlyMap<K, V> {
  return m;
}
