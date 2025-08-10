'use client';

import { useMemo } from 'react';

import { CHART_LAYOUT } from '@/constants/chart';
import { useMeasure } from '@/hooks/useMeasure';
import { calculateChartHeight } from '@/utils/chart';

export function useChartDimensions(rowCount: number) {
  const { ref, width } = useMeasure<HTMLDivElement>();

  const height = useMemo(
    () =>
      calculateChartHeight(
        rowCount,
        CHART_LAYOUT.ROW_HEIGHT,
        CHART_LAYOUT.MARGIN.TOP,
        CHART_LAYOUT.MARGIN.BOTTOM,
      ),
    [rowCount],
  );

  return { ref, width, height };
}
