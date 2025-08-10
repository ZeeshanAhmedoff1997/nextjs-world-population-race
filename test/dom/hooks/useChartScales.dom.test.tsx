import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useChartScales } from '@/hooks/chart/useChartScales';

const rows = [
  { name: 'A', pop: 10 },
  { name: 'B', pop: 30 },
  { name: 'C', pop: 20 },
];

describe('useChartScales', () => {
  it('computes x and y scales and bandwidth', () => {
    const innerW = 400;
    const innerH = 300;
    const { result } = renderHook(() => useChartScales(rows, innerW, innerH));
    const { x, y, bandwidth, names } = result.current;
    expect(names).toEqual(['A', 'B', 'C']);
    expect(x(0)).toBe(0);
    expect(x(30)).toBe(innerW);
    expect(y('A')).toBeGreaterThanOrEqual(0);
    expect(typeof bandwidth).toBe('number');
    expect(bandwidth).toBeGreaterThan(0);
  });
});
