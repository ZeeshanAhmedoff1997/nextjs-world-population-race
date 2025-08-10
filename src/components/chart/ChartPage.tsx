'use client';

import { useEffect, useMemo, useCallback, useRef } from 'react';
import { useNumberQueryState } from '@/hooks/useQueryState';
import { useLiveRegion } from '@/utils/a11y';
import Pagination from './Pagination';
import BarChart from './BarChart';
import { useMeasure } from '@/hooks/useMeasure';
import { getCountryFlag } from '@/lib/chart/colors';
import { fmt } from '@/lib/chart/format';
import AnimatedBackground from '@/components/AnimatedBackground';
import type { ChartPageProps } from '@/types/chart';
import { useTweenedRows } from '@/hooks/useTweenedRows';
import { CHART_LAYOUT } from '@/constants/chart';
import { calculateChartHeight } from '@/utils/chart';
import { CountryRow } from '@/lib/data/types';

export default function ChartPage({
  years,
  initialYear,
  initialRows,
  maxPop,
  slicesByYear,
}: ChartPageProps) {
  const [year, setYear] = useNumberQueryState('year', initialYear);
  const announce = useLiveRegion();

  const rawRows = useMemo(
    () => slicesByYear[year] ?? initialRows,
    [slicesByYear, year, initialRows],
  );

  const handleYearChange = useCallback(
    (newYear: number) => {
      setYear(newYear);
    },
    [setYear],
  );

  const prevRowsRef = useRef<readonly CountryRow[]>(initialRows);
  useEffect(() => {
    prevRowsRef.current = rawRows;
  }, [rawRows]);

  const rows = useTweenedRows(
    prevRowsRef.current,
    rawRows,
    rawRows.length,
    900,
  );

  const currentLeader = useMemo(() => rows[0], [rows]);

  useEffect(() => {
    announce(
      `Year changed to ${year}. Top: ${currentLeader?.name ?? 'none'} ${currentLeader?.pop ?? 0}.`,
    );
  }, [year, currentLeader, announce]);

  const { ref, width } = useMeasure<HTMLDivElement>();
  const height = calculateChartHeight(
    rows.length,
    CHART_LAYOUT.ROW_HEIGHT,
    CHART_LAYOUT.MARGIN.TOP,
    CHART_LAYOUT.MARGIN.BOTTOM,
  );

  return (
    <div className='min-h-screen relative overflow-hidden'>
      <AnimatedBackground />

      <section className='relative z-10 mx-auto max-w-7xl p-8 space-y-8'>
        <header className='text-center py-8'>
          <h1 className='text-5xl sm:text-7xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4 drop-shadow-2xl'>
            World Population Race
          </h1>
          <p className='text-xl text-blue-100 font-medium max-w-2xl mx-auto leading-relaxed'>
            Interactive visualization of population growth across countries
            through time
          </p>
        </header>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105'>
            <h3 className='text-lg font-bold text-white mb-2 flex items-center gap-2'>
              <span className='text-2xl'>🏆</span> Current Leader
            </h3>
            <p className='text-2xl font-bold text-yellow-300 mb-1'>
              {getCountryFlag(currentLeader?.name || '')} {currentLeader?.name}
            </p>
            <p className='text-blue-200'>
              {fmt.format(currentLeader?.pop || 0)} people
            </p>
          </div>

          <div className='bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105'>
            <h3 className='text-lg font-bold text-white mb-2 flex items-center gap-2'>
              <span className='text-2xl'>📈</span> Year Range
            </h3>
            <p className='text-2xl font-bold text-green-300 mb-1'>
              {years[0]} - {years[years.length - 1]}
            </p>
            <p className='text-blue-200'>{years.length} years of data</p>
          </div>

          <div className='bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105'>
            <h3 className='text-lg font-bold text-white mb-2 flex items-center gap-2'>
              <span className='text-2xl'>🌟</span> Countries
            </h3>
            <p className='text-2xl font-bold text-pink-300 mb-1'>
              {rows.length}
            </p>
            <p className='text-blue-200'>Top countries displayed</p>
          </div>
        </div>

        {/* Chart in the middle */}
        <div
          ref={ref}
          className='relative rounded-3xl border border-white/30 p-8 bg-white/10 backdrop-blur-xl shadow-2xl
                     hover:shadow-3xl hover:bg-white/15 transition-all duration-500 transform hover:scale-[1.02]'
        >
          <div className='absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10'></div>
          <div className='relative'>
            <BarChart
              rows={rows}
              width={width}
              height={height}
              maxDomain={maxPop}
              title='World Population'
              year={year}
            />
          </div>
        </div>

        {/* Pagination below the chart */}
        <div className='flex justify-center pt-6'>
          <Pagination years={years} year={year} onChange={handleYearChange} />
        </div>
      </section>
    </div>
  );
}
