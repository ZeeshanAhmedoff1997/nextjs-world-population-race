/**
 * Chart-specific type definitions
 */

import type { CountryRow } from '@/lib/data/types';

// Component prop types
export interface BarChartProps {
  rows: readonly CountryRow[];
  width: number;
  height: number;
  maxDomain: number;
  title: string;
  year: number;
}

export interface PaginationProps {
  years: readonly number[];
  year: number;
  onChange: (nextYear: number) => void;
}

export interface ChartPageProps {
  years: readonly number[];
  initialYear: number;
  initialRows: readonly CountryRow[];
  maxPop: number;
  slicesByYear: Record<number, readonly CountryRow[]>;
}

// Animation state types
export interface AnimationState {
  y: number;
  w: number;
  val: number;
}

// Color scheme types
export interface ColorScheme {
  color1: string;
  color2: string;
  id: string;
}
