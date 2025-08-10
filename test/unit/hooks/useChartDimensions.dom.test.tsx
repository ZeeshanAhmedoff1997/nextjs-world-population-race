import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useChartDimensions } from '@/hooks/chart/useChartDimensions';
import { CHART_LAYOUT } from '@/constants/chart';

vi.mock('@/hooks/useMeasure', () => ({
  useMeasure: () => ({ ref: { current: null }, width: 800 }),
}));

describe('useChartDimensions (DOM)', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns ref, width and computed height for given row count', () => {
    const rows = 10;
    const { result } = renderHook(() => useChartDimensions(rows));

    expect(result.current.width).toBe(800);

    const expectedHeight =
      CHART_LAYOUT.MARGIN.TOP +
      CHART_LAYOUT.MARGIN.BOTTOM +
      rows * CHART_LAYOUT.ROW_HEIGHT +
      CHART_LAYOUT.MARGIN.BOTTOM;

    expect(result.current.height).toBe(expectedHeight);
    expect(result.current.ref).toBeDefined();
  });

  it('recomputes height when row count changes', () => {
    const { result, rerender } = renderHook(({ n }) => useChartDimensions(n), {
      initialProps: { n: 5 },
    });

    const firstHeight = result.current.height;
    rerender({ n: 8 });
    const secondHeight = result.current.height;

    expect(secondHeight).toBeGreaterThan(firstHeight);
  });
});
