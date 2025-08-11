'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useNumberQueryState } from '@/hooks/useQueryState';
import { useTweenedRows } from '@/hooks/useTweenedRows';
import type { CountryRow } from '@/lib/data/types';
import type { UseChartStateArgs } from '@/types/chart';

export function useChartState({
  years,
  initialYear,
  initialRows,
  slicesByYear,
  tweenMs = 900,
}: UseChartStateArgs) {
  const [year, setYear] = useNumberQueryState('year', initialYear);

  useEffect(() => {
    if (!years?.length) return;
    const min = years[0];
    const max = years[years.length - 1];
    if (year < min || year > max) {
      setYear(initialYear);
    }
  }, [year, years, initialYear, setYear]);

  const rawRows = useMemo(
    () => slicesByYear[year] ?? initialRows,
    [slicesByYear, year, initialRows],
  );

  const prevRowsRef = useRef<readonly CountryRow[]>(initialRows);
  useEffect(() => {
    prevRowsRef.current = rawRows;
  }, [rawRows]);

  const rows = useTweenedRows(
    prevRowsRef.current,
    rawRows,
    rawRows.length,
    tweenMs,
  );

  const currentLeader = useMemo(() => rows[0], [rows]);

  const handleYearChange = useCallback(
    (newYear: number) => {
      setYear(newYear);
    },
    [setYear],
  );

  return {
    year,
    setYear,
    rows,
    currentLeader,
    handleYearChange,
  };
}
