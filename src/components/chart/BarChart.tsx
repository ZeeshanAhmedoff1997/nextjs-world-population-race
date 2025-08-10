'use client';

import { memo, useMemo, useRef } from 'react';

import { CHART_STYLING } from '@/constants/chart';
import { useBarChartAnimation } from '@/hooks/chart/useBarChartAnimation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { bandScale, linearScale } from '@/lib/chart/scales';
import type { BarChartProps } from '@/types/chart';

import BarRow from './BarRow';
import ChartDefs from './ChartDefs';

const BarChart = memo(function BarChart({
  rows,
  width,
  height,
  maxDomain,
  title,
  year,
}: BarChartProps) {
  const margin = { top: 36, right: 96, bottom: 28, left: 160 };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);

  const names = useMemo(() => rows.map((r) => r.name), [rows]);
  const x = useMemo(
    () => linearScale([0, maxDomain], [0, innerW]),
    [maxDomain, innerW],
  );
  const y = useMemo(() => bandScale(names, [0, innerH], 0.25), [names, innerH]);
  const bandwidth = y.bandwidth;

  const reduced = useReducedMotion();
  const rootRef = useRef<SVGGElement | null>(null);

  useBarChartAnimation(rootRef, { rows, year, x, y, reducedMotion: reduced });

  return (
    <svg
      role='img'
      aria-labelledby='chart-title chart-desc'
      viewBox={`0 0 ${width} ${height}`}
      className='w-full h-auto drop-shadow-sm'
    >
      <ChartDefs rows={rows} />

      <title id='chart-title'>{title}</title>
      <desc id='chart-desc'>
        Animated bar chart race of country populations. Bars move to new ranks
        and widths as the year changes.
      </desc>

      <text
        x={width / 2}
        y={margin.top * 0.65}
        textAnchor='middle'
        fill='url(#year-gradient)'
        style={{
          fontSize: CHART_STYLING.YEAR_FONT_SIZE,
          fontWeight: 900,
          opacity: 0.95,
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
        }}
      >
        {year}
      </text>

      <g ref={rootRef} transform={`translate(${margin.left}, ${margin.top})`}>
        {rows.map((r) => (
          <BarRow
            key={r.name}
            name={r.name}
            pop={r.pop}
            yPos={y(r.name)}
            bandwidth={bandwidth}
            barWidth={Math.max(0, x(r.pop))}
          />
        ))}
      </g>
    </svg>
  );
});

export default BarChart;
