'use client';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useA11yAnnouncement } from '@/hooks/chart/useA11yAnnouncement';
import { useChartDimensions } from '@/hooks/chart/useChartDimensions';
import { useChartState } from '@/hooks/chart/useChartState';
import { getCountryFlag } from '@/lib/chart/colors';
import { fmt } from '@/lib/chart/format';
import type { ChartPageProps } from '@/types/chart';

import BarChart from './BarChart';
import Pagination from './Pagination';

export default function ChartPage({
  years,
  initialYear,
  initialRows,
  maxPop,
  slicesByYear,
}: ChartPageProps) {
  const { year, rows, currentLeader, handleYearChange } = useChartState({
    initialYear,
    initialRows,
    slicesByYear,
    tweenMs: 900,
  });

  useA11yAnnouncement(year, currentLeader);

  const { ref, width, height } = useChartDimensions(rows.length);

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

        <div className='flex justify-center pt-6'>
          <Pagination years={years} year={year} onChange={handleYearChange} />
        </div>
      </section>
    </div>
  );
}
