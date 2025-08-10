import type { z } from 'zod';
import type { Dataset as DatasetSchema, Row as RowSchema } from './schema';

export type RawDataset = z.infer<typeof DatasetSchema>;
export type RawRow = z.infer<typeof RowSchema>;

export type CountryRow = Readonly<{
  name: string;
  pop: number;
}>;

export type YearData = Readonly<{
  year: number;
  rows: readonly CountryRow[];
}>;

export type DatasetNormalized = Readonly<{
  years: readonly number[];
  byYear: ReadonlyMap<number, readonly CountryRow[]>;
  maxPop: number;
  top10: ReadonlyMap<number, readonly CountryRow[]>;
  top15: ReadonlyMap<number, readonly CountryRow[]>;
}>;
