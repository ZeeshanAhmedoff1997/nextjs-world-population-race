import React, { useMemo, useRef } from 'react';
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';

import { useBarChartAnimation } from '@/hooks/chart/useBarChartAnimation';
import type { CountryRow } from '@/lib/data/types';

beforeAll(() => {
  (Element.prototype as any).animate = vi.fn(() => ({}));
  (globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
    cb(Number.MAX_SAFE_INTEGER);
    return 1 as unknown as number;
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

vi.mock('@/constants/animation', () => ({
  CHART_ANIMATION: { DURATION: 1, EASING: 'linear' },
}));

const cancelAnimationsSpy = vi.fn();
vi.mock('@/utils/animation', async () => {
  const actual = await vi.importActual<object>('@/utils/animation');
  return {
    ...actual,
    cancelAnimations: (...args: unknown[]) => cancelAnimationsSpy(...args),
    createSafeWidth: (w: number, min = 1) => Math.max(min, w),
    shouldSkipAnimation: () => false,
  };
});

function makeX() {
  return (p: number) => p;
}
function makeY(rows: readonly CountryRow[]) {
  const index = new Map(rows.map((r, i) => [r.name, i]));
  return (name: string) => (index.get(name) ?? 0) * 20;
}

function Harness({
  rows,
  year,
}: {
  rows: readonly CountryRow[];
  year: number;
}) {
  const rootRef = useRef<SVGGElement | null>(null);
  const x = useMemo(() => makeX(), []);
  const y = useMemo(() => makeY(rows), [rows]);

  useBarChartAnimation(rootRef, {
    rows,
    year,
    x,
    y,
    reducedMotion: false,
  });

  return (
    <svg>
      <g ref={rootRef}>
        {rows.map((r) => (
          <g key={r.name} data-key={r.name}>
            <rect />
            <text data-bar='value'>{Intl.NumberFormat().format(r.pop)}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

describe('useBarChartAnimation', () => {
  it('does not animate on first mount (no prev state)', () => {
    const rows: CountryRow[] = [
      { name: 'China', pop: 100 },
      { name: 'India', pop: 80 },
    ];

    render(<Harness rows={rows} year={1990} />);
    expect(cancelAnimationsSpy).not.toHaveBeenCalled();
  });

  it('animates row transform & width on data change (re-render)', () => {
    const initial: CountryRow[] = [
      { name: 'China', pop: 100 },
      { name: 'India', pop: 80 },
    ];
    const next: CountryRow[] = [
      { name: 'India', pop: 200 },
      { name: 'China', pop: 50 },
    ];

    const { rerender, container } = render(
      <Harness rows={initial} year={1990} />,
    );

    rerender(<Harness rows={next} year={1991} />);
    expect(cancelAnimationsSpy).toHaveBeenCalled();

    const indiaRow = container.querySelector(
      'g[data-key="India"]',
    ) as SVGGElement;
    const chinaRow = container.querySelector(
      'g[data-key="China"]',
    ) as SVGGElement;

    const rowAnimate = (indiaRow as any).animate as jest.Mock | vi.Mock;
    const rectAnimate = (indiaRow.querySelector('rect') as any).animate as
      | jest.Mock
      | vi.Mock;

    expect(typeof rowAnimate).toBe('function');
    expect(typeof rectAnimate).toBe('function');
    expect(
      rowAnimate.mock.calls.length + (rectAnimate.mock?.calls?.length ?? 0),
    ).toBeGreaterThan(0);

    const indiaLabel = indiaRow.querySelector('[data-bar="value"]')!;
    const chinaLabel = chinaRow.querySelector('[data-bar="value"]')!;
    expect(indiaLabel.textContent).toBe(Intl.NumberFormat().format(200));
    expect(chinaLabel.textContent).toBe(Intl.NumberFormat().format(50));
  });

  it('respects reducedMotion (skips animations)', () => {
    function RMHarness({
      rows,
      year,
    }: {
      rows: readonly CountryRow[];
      year: number;
    }) {
      const rootRef = useRef<SVGGElement | null>(null);
      const x = useMemo(() => makeX(), []);
      const y = useMemo(() => makeY(rows), [rows]);

      useBarChartAnimation(rootRef, {
        rows,
        year,
        x,
        y,
        reducedMotion: true,
      });

      return (
        <svg>
          <g ref={rootRef}>
            {rows.map((r) => (
              <g key={r.name} data-key={r.name}>
                <rect />
                <text data-bar='value'>
                  {Intl.NumberFormat().format(r.pop)}
                </text>
              </g>
            ))}
          </g>
        </svg>
      );
    }

    const a: CountryRow[] = [
      { name: 'China', pop: 100 },
      { name: 'India', pop: 80 },
    ];
    const b: CountryRow[] = [
      { name: 'India', pop: 200 },
      { name: 'China', pop: 50 },
    ];

    const { rerender } = render(<RMHarness rows={a} year={1990} />);
    rerender(<RMHarness rows={b} year={1991} />);
    expect(cancelAnimationsSpy).not.toHaveBeenCalled();
  });
});
