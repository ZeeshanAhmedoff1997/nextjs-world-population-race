import type { CountryRow } from '@/lib/data/types';

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
export interface AnimationState {
  y: number;
  w: number;
  val: number;
}
export interface ColorScheme {
  color1: string;
  color2: string;
  id: string;
}

export type UseChartStateArgs = {
  years: readonly number[];
  initialYear: number;
  initialRows: readonly CountryRow[];
  slicesByYear: Record<number, readonly CountryRow[]>;
  tweenMs?: number;
};

export type ChartLeader =
  | {
      name: string;
      pop: number;
    }
  | undefined;

export type UseBarAnimationArgs = {
  rows: readonly CountryRow[];
  year: number;
  x: (n: number) => number;
  y: (name: string) => number;
  reducedMotion: boolean;
};
