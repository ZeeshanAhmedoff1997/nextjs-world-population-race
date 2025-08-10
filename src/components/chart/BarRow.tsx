'use client';

import { memo } from 'react';

import { CHART_STYLING } from '@/constants/chart';
import { colorFor, getCountryFlag } from '@/lib/chart/colors';
import { fmt } from '@/lib/chart/format';

type IBarRowProps = {
  name: string;
  pop: number;
  yPos: number;
  bandwidth: number;
  barWidth: number;
};

const BarRow = memo(function BarRow({
  name,
  pop,
  yPos,
  bandwidth,
  barWidth,
}: IBarRowProps) {
  const isZero = pop === 0;
  const colors = colorFor(name);
  const flag = getCountryFlag(name);

  return (
    <g
      data-bar='row'
      data-key={name}
      style={{
        transformBox: 'fill-box',
        transformOrigin: '0% 50%',
        willChange: 'transform',
        opacity: isZero ? 0.4 : 1,
        transform: `translate(0, ${yPos}px)`,
        transition: 'opacity 0.3s ease',
      }}
    >
      <text
        x={-8}
        y={bandwidth / 2}
        dominantBaseline='middle'
        textAnchor='end'
        className={isZero ? 'fill-gray-400' : 'fill-gray-100'}
        style={{
          fontSize: CHART_STYLING.COUNTRY_FONT_SIZE,
          fontWeight: CHART_STYLING.COUNTRY_FONT_WEIGHT,
          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.7))',
        }}
      >
        {flag} {name}
      </text>

      <rect
        x={0}
        y={2}
        width={Math.max(4, barWidth)}
        height={bandwidth - 4}
        rx={Math.min(8, bandwidth / 3)}
        fill={`url(#${colors.id})`}
        filter='url(#bar-shadow)'
        style={{
          opacity: isZero ? 0.2 : 0.95,
          transition: 'opacity 0.3s ease',
        }}
      >
        <title>{`${name}: ${fmt.format(pop)}`}</title>
      </rect>

      <rect
        x={0}
        y={2}
        width={Math.max(4, barWidth * 0.6)}
        height={(bandwidth - 4) / 3}
        rx={Math.min(8, bandwidth / 3)}
        fill='url(#bar-highlight)'
        style={{ opacity: isZero ? 0 : 0.3, transition: 'opacity 0.3s ease' }}
      />

      <text
        data-bar='value'
        x={Math.max(barWidth + 8, 16)}
        y={bandwidth / 2}
        dominantBaseline='middle'
        className={isZero ? 'fill-gray-400' : 'fill-white'}
        style={{
          fontSize: CHART_STYLING.VALUE_FONT_SIZE,
          fontWeight: CHART_STYLING.VALUE_FONT_WEIGHT,
          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))',
        }}
      >
        {isZero ? '—' : fmt.format(pop)}
      </text>
    </g>
  );
});

export default BarRow;
