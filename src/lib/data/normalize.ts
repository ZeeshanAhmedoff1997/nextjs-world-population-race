import type { CountryRow, YearData } from './types';

export function sortRows(rows: CountryRow[]): CountryRow[] {
  return rows
    .slice()
    .sort((a, b) => b.pop - a.pop || a.name.localeCompare(b.name));
}

export function dedupe(rows: CountryRow[]): CountryRow[] {
  const map = new Map<string, CountryRow>();
  for (const r of rows) {
    const prev = map.get(r.name);
    if (!prev || r.pop > prev.pop) map.set(r.name, r);
  }
  return Array.from(map.values());
}

export function toYearData(parsed: any): YearData[] {
  return parsed.map((yb: any) => {
    const rows: CountryRow[] = yb.Countries.map((c: any) => ({
      name: c.Country.trim(),
      pop: c.Population,
    }));
    const uniq = dedupe(rows);
    return Object.freeze({
      year: yb.Year,
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
