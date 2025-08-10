import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChartState } from '@/hooks/chart/useChartState';

vi.mock('@/hooks/useQueryState', async () => {
  const React = await import('react');
  return {
    useNumberQueryState: (_key: string, initial: number) =>
      React.useState<number>(initial) as readonly [number, (n: number) => void],
  };
});

const initialRows = [
  { name: 'China', pop: 100 },
  { name: 'India', pop: 80 },
];

const slicesByYear: Record<number, readonly { name: string; pop: number }[]> = {
  2000: initialRows,
  2001: [
    { name: 'India', pop: 120 },
    { name: 'China', pop: 90 },
  ],
};

describe('useChartState', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with provided year and returns rows and leader', () => {
    const { result } = renderHook(() =>
      useChartState({
        initialYear: 2000,
        initialRows,
        slicesByYear,
        tweenMs: 0,
      }),
    );
    expect(result.current.year).toBe(2000);
    expect(result.current.rows.length).toBe(2);
    expect(result.current.currentLeader?.name).toBe('China');
  });

  it('updates year and rows via handleYearChange', () => {
    const { result } = renderHook(() =>
      useChartState({
        initialYear: 2000,
        initialRows,
        slicesByYear,
        tweenMs: 0,
      }),
    );
    act(() => {
      result.current.handleYearChange(2001);
    });
    expect(result.current.year).toBe(2001);
  });
});
