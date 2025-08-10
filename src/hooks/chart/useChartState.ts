'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useNumberQueryState } from '@/hooks/useQueryState';
import { useTweenedRows } from '@/hooks/useTweenedRows';
import type { CountryRow } from '@/lib/data/types';
import type { UseChartStateArgs } from '@/types/chart';

export function useChartState({
  initialYear,
  initialRows,
  slicesByYear,
  tweenMs = 900,
}: UseChartStateArgs) {
  const [year, setYear] = useNumberQueryState('year', initialYear);

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
