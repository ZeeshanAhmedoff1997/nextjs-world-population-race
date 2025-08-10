'use client';

import { memo } from 'react';

import { colorFor } from '@/lib/chart/colors';
import type { CountryRow } from '@/lib/data/types';

type IChartDefsProps = { rows: readonly CountryRow[] };

const ChartDefs = memo(function ChartDefs({ rows }: IChartDefsProps) {
  return (
    <defs>
      {rows.map((r) => {
        const colors = colorFor(r.name);
        return (
          <linearGradient
            key={colors.id}
            id={colors.id}
            x1='0%'
            y1='0%'
            x2='100%'
            y2='0%'
          >
            <stop offset='0%' stopColor={colors.color1} />
            <stop offset='100%' stopColor={colors.color2} />
          </linearGradient>
        );
      })}

      <filter id='bar-shadow' x='-20%' y='-20%' width='140%' height='140%'>
        <feDropShadow dx='2' dy='2' stdDeviation='3' floodOpacity='0.15' />
      </filter>

      <linearGradient id='bar-highlight' x1='0%' y1='0%' x2='0%' y2='100%'>
        <stop offset='0%' stopColor='rgba(255,255,255,0.8)' />
        <stop offset='100%' stopColor='rgba(255,255,255,0.1)' />
      </linearGradient>

      <linearGradient id='year-gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
        <stop offset='0%' stopColor='#6366f1' />
        <stop offset='100%' stopColor='#8b5cf6' />
      </linearGradient>
    </defs>
  );
});

export default ChartDefs;
