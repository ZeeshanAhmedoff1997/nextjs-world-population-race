'use client';

import { memo, useEffect, useState } from 'react';

import type { PaginationProps } from '@/types/chart';

const Pagination = memo(function Pagination({
  years,
  year,
  onChange,
}: PaginationProps) {
  const idx = years.indexOf(year);
  const prev = years[Math.max(0, idx - 1)];
  const next = years[Math.min(years.length - 1, idx + 1)];

  const [isRunning, setIsRunning] = useState(false);
  const STEP_MS = 1000;

  useEffect(() => {
    if (!isRunning) return;
    if (idx >= years.length - 1) {
      setIsRunning(false);
      return;
    }
    const id = window.setTimeout(() => {
      const nextIdx = Math.min(years.length - 1, idx + 1);
      onChange(years[nextIdx]);
    }, STEP_MS);
    return () => window.clearTimeout(id);
  }, [isRunning, idx, years, onChange]);

  const onRunToggle = () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }
    if (idx !== 0) onChange(years[0]);
    setIsRunning(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      setIsRunning(false);
      if (e.key === 'ArrowLeft') onChange(prev);
      else if (e.key === 'ArrowRight') onChange(next);
      else if (e.key === 'PageUp') onChange(years[Math.max(0, idx - 5)]);
      else if (e.key === 'PageDown')
        onChange(years[Math.min(years.length - 1, idx + 5)]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, years, onChange, prev, next]);

  return (
    <div className='flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl'>
      <button
        type='button'
        onClick={onRunToggle}
        aria-label={isRunning ? 'Pause timeline' : 'Run timeline'}
        className='group relative px-4 py-2 bg-gradient-to-r from-emerald-500/80 to-teal-600/80 text-white font-medium rounded-lg 
                   shadow-lg hover:shadow-xl hover:scale-110 hover:from-emerald-400 hover:to-teal-500 
                   transition-all duration-200 ease-out cursor-pointer active:scale-95'
      >
        <span className='flex items-center gap-1.5'>
          {isRunning ? (
            <svg className='w-3 h-3' viewBox='0 0 20 20' fill='currentColor'>
              <path d='M6 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1zm7 0a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1z' />
            </svg>
          ) : (
            <svg className='w-3 h-3' viewBox='0 0 20 20' fill='currentColor'>
              <path d='M6.5 4.5a1 1 0 011.5-.866l8 4.5a1 1 0 010 1.732l-8 4.5A1 1 0 016 13.5v-9z' />
            </svg>
          )}
          <span className='text-sm'>{isRunning ? 'Pause' : 'Run'}</span>
        </span>
      </button>
      <button
        type='button'
        onClick={() => {
          setIsRunning(false);
          onChange(prev);
        }}
        disabled={idx <= 0}
        aria-label='Previous year'
        className='group relative px-4 py-2 bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white font-medium rounded-lg 
                   shadow-lg hover:shadow-xl hover:scale-110 hover:from-blue-400 hover:to-purple-500 
                   disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 
                   disabled:from-gray-500 disabled:to-gray-600 transition-all duration-200 ease-out cursor-pointer
                   active:scale-95'
      >
        <span className='flex items-center gap-1.5'>
          <svg
            className='w-3 h-3 transition-transform group-hover:-translate-x-0.5'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
              clipRule='evenodd'
            />
          </svg>
          <span className='text-sm'>Prev</span>
        </span>
      </button>

      <div className='relative'>
        <select
          value={year}
          onChange={(e) => {
            setIsRunning(false);
            onChange(Number(e.target.value));
          }}
          className='appearance-none bg-white/20 backdrop-blur-md border border-white/30 
                     rounded-lg px-4 py-2 pr-8 font-bold text-white text-base shadow-lg
                     hover:bg-white/25 hover:border-white/40 focus:bg-white/30 focus:border-white/50 
                     focus:ring-2 focus:ring-white/25 transition-all duration-200 cursor-pointer
                     active:scale-95'
          aria-label='Select year'
        >
          {years.map((y) => (
            <option
              key={y}
              value={y}
              className='font-semibold bg-gray-800 text-white'
            >
              {y}
            </option>
          ))}
        </select>
        <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
          <svg
            className='w-4 h-4 text-white/80'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      </div>

      <button
        type='button'
        onClick={() => {
          setIsRunning(false);
          onChange(next);
        }}
        disabled={idx >= years.length - 1}
        aria-label='Next year'
        className='group relative px-4 py-2 bg-gradient-to-r from-purple-500/80 to-pink-600/80 text-white font-medium rounded-lg 
                   shadow-lg hover:shadow-xl hover:scale-110 hover:from-purple-400 hover:to-pink-500 
                   disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 
                   disabled:from-gray-500 disabled:to-gray-600 transition-all duration-200 ease-out cursor-pointer
                   active:scale-95'
      >
        <span className='flex items-center gap-1.5'>
          <span className='text-sm'>Next</span>
          <svg
            className='w-3 h-3 transition-transform group-hover:translate-x-0.5'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
              clipRule='evenodd'
            />
          </svg>
        </span>
      </button>
    </div>
  );
});

export default Pagination;
