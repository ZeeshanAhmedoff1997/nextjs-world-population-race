// src/components/chart/BarChart.tsx
'use client';

import { useLayoutEffect, useMemo, useRef, memo } from 'react';
import { linearScale, bandScale } from '@/lib/chart/scales';
import { colorFor, getCountryFlag } from '@/lib/chart/colors';
import { fmt } from '@/lib/chart/format';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { CountryRow } from '@/lib/data/types';

type Props = {
  rows: readonly CountryRow[];
  width: number;
  height: number;
  maxDomain: number;
  title: string;
  year: number;
};

// Performance-optimized animation constants
const ANIMATION_DURATION = 400; // Faster for better performance
const ANIMATION_EASING = 'ease-out'; // Simpler easing for better performance
const MIN_ANIMATION_THRESHOLD_Y = 2; // Skip animations for small position changes
const MIN_ANIMATION_THRESHOLD_W = 4; // Skip animations for small width changes

const BarChart = memo(function BarChart({
  rows,
  width,
  height,
  maxDomain,
  title,
  year,
}: Props) {
  // Layout
  const margin = { top: 36, right: 96, bottom: 28, left: 160 };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);

  // Scales for this render
  const names = useMemo(() => rows.map((r) => r.name), [rows]);
  const x = useMemo(
    () => linearScale([0, maxDomain], [0, innerW]),
    [maxDomain, innerW],
  );
  const y = useMemo(() => bandScale(names, [0, innerH], 0.25), [names, innerH]);

  const reduced = useReducedMotion();

  // --- Data-driven FLIP cache: country -> { y: number; w: number; val: number } ---
  const prev = useRef(new Map<string, { y: number; w: number; val: number }>());

  // Animate using only data deltas (no DOM measuring)
  const rootRef = useRef<SVGGElement | null>(null);
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const next = new Map<string, { y: number; w: number; val: number }>();

    // Build current "Last" from scales
    for (const r of rows) {
      next.set(r.name, { y: y(r.name), w: x(r.pop), val: r.pop });
    }

    // Animate First -> Last per row
    if (prev.current.size && !reduced) {
      for (const r of rows) {
        const key = r.name;
        const last = next.get(key)!;
        const first = prev.current.get(key) ?? last;

        // Skip animation if positions are the same (performance optimization)
        if (
          Math.abs(first.y - last.y) < MIN_ANIMATION_THRESHOLD_Y &&
          Math.abs(first.w - last.w) < MIN_ANIMATION_THRESHOLD_W
        ) {
          continue;
        }

        const rowEl = root.querySelector<SVGGElement>(
          `[data-key="${cssEscape(key)}"]`,
        );
        if (!rowEl) continue;

        const dy = first.y - last.y;

        // Handle scale calculation more safely
        const firstW = Math.max(1, first.w);
        const lastW = Math.max(1, last.w);
        const sx = firstW / lastW;

        // Clear any existing animations
        rowEl.getAnimations().forEach((anim) => anim.cancel());

        // Animate group position and scale
        if (Math.abs(dy) > 1 || Math.abs(sx - 1) > 0.01) {
          rowEl.animate(
            [
              {
                transform: `translate(0, ${first.y}px) scaleX(${sx})`,
                opacity: first.val === 0 ? 0.3 : 1,
              },
              {
                transform: `translate(0, ${last.y}px) scaleX(1)`,
                opacity: last.val === 0 ? 0.3 : 1,
              },
            ],
            {
              duration: ANIMATION_DURATION,
              easing: ANIMATION_EASING,
              fill: 'forwards',
            },
          );
        }

        // Animate bar width separately for smoother effect
        const rect = rowEl.querySelector('rect');
        if (rect && Math.abs(first.w - last.w) > 1) {
          rect.getAnimations().forEach((anim) => anim.cancel());
          const fromW = Math.max(2, first.w);
          const toW = Math.max(2, last.w);
          rect.animate([{ width: fromW }, { width: toW }], {
            duration: ANIMATION_DURATION,
            easing: ANIMATION_EASING,
            fill: 'forwards',
          });
        }

        // Animate numbers (including zero transitions)
        const label = rowEl.querySelector(
          '[data-bar="value"]',
        ) as SVGTextElement | null;
        if (label) {
          const from = first.val;
          const to = last.val;

          if (from !== to) {
            const t0 = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - t0) / ANIMATION_DURATION);
              const progress = ease(p);

              if (to === 0) {
                // Animate to "—" for zero values
                const v = Math.round(from * (1 - progress));
                label.textContent = v === 0 ? '—' : fmt.format(v);
              } else if (from === 0) {
                // Animate from "—" to actual value
                const v = Math.round(to * progress);
                label.textContent = v === 0 ? '—' : fmt.format(v);
              } else {
                // Normal number animation
                const v = Math.round(from + (to - from) * progress);
                label.textContent = fmt.format(v);
              }

              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }
      }
    }

    // Store Last as next First
    prev.current = next;
  }, [rows, year, x, y, reduced]);

  return (
    <svg
      role='img'
      aria-labelledby='chart-title chart-desc'
      viewBox={`0 0 ${width} ${height}`}
      className='w-full h-auto drop-shadow-sm'
    >
      <defs>
        {/* Create gradients for each country */}
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

        {/* Shadow filter */}
        <filter id='bar-shadow' x='-20%' y='-20%' width='140%' height='140%'>
          <feDropShadow dx='2' dy='2' stdDeviation='3' floodOpacity='0.15' />
        </filter>

        {/* Highlight gradient for bar shine effect */}
        <linearGradient id='bar-highlight' x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stopColor='rgba(255,255,255,0.8)' />
          <stop offset='100%' stopColor='rgba(255,255,255,0.1)' />
        </linearGradient>
      </defs>

      <title id='chart-title'>{title}</title>
      <desc id='chart-desc'>
        Animated bar chart race of country populations. Bars move to new ranks
        and widths as the year changes.
      </desc>

      {/* Big year label with gradient background */}
      <defs>
        <linearGradient id='year-gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
          <stop offset='0%' stopColor='#6366f1' />
          <stop offset='100%' stopColor='#8b5cf6' />
        </linearGradient>
      </defs>

      <text
        x={width / 2}
        y={margin.top * 0.65}
        textAnchor='middle'
        fill='url(#year-gradient)'
        style={{
          fontSize: 32,
          fontWeight: 900,
          opacity: 0.95,
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
        }}
      >
        {year}
      </text>

      <g ref={rootRef} transform={`translate(${margin.left}, ${margin.top})`}>
        {rows.map((r) => {
          const yPos = y(r.name);
          const bw = y.bandwidth;
          const barW = Math.max(0, x(r.pop)); // Ensure non-negative width
          const key = r.name;
          const isZero = r.pop === 0;
          const colors = colorFor(r.name);
          const flag = getCountryFlag(r.name);

          return (
            <g
              key={key}
              data-bar='row'
              data-key={key}
              style={{
                transformBox: 'fill-box',
                transformOrigin: '0% 50%',
                willChange: 'transform',
                opacity: isZero ? 0.4 : 1, // Fade out countries with 0 population
                transform: `translate(0, ${yPos}px)`, // Initial position
                transition: 'opacity 0.3s ease',
              }}
            >
              {/* country label with flag - optimized for dark background */}
              <text
                x={-8}
                y={bw / 2}
                dominantBaseline='middle'
                textAnchor='end'
                className={isZero ? 'fill-gray-400' : 'fill-gray-100'}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.7))',
                }}
              >
                {flag} {r.name}
              </text>

              {/* bar with gradient and shadow */}
              <rect
                x={0}
                y={2}
                width={Math.max(4, barW)} // Minimum 4px width for visibility
                height={bw - 4}
                rx={Math.min(8, bw / 3)}
                fill={`url(#${colors.id})`}
                filter='url(#bar-shadow)'
                style={{
                  opacity: isZero ? 0.2 : 0.95,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <title>{`${r.name}: ${fmt.format(r.pop)}`}</title>
              </rect>

              {/* Bar highlight/shine effect */}
              <rect
                x={0}
                y={2}
                width={Math.max(4, barW * 0.6)}
                height={(bw - 4) / 3}
                rx={Math.min(8, bw / 3)}
                fill='url(#bar-highlight)'
                style={{
                  opacity: isZero ? 0 : 0.3,
                  transition: 'opacity 0.3s ease',
                }}
              />

              {/* value label with enhanced visibility */}
              <text
                data-bar='value'
                x={Math.max(barW + 8, 16)} // Ensure label doesn't go negative
                y={bw / 2}
                dominantBaseline='middle'
                className={isZero ? 'fill-gray-400' : 'fill-white'}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))',
                }}
              >
                {isZero ? '—' : fmt.format(r.pop)}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
});

export default BarChart;

/** simple easing approximating the cubic-bezier we use for WAAPI */
function ease(t: number) {
  // cubic in/out-ish curve: smooth and close to EASE constant
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Escape attribute selector for country names with spaces/commas etc. */
function cssEscape(s: string) {
  return s.replace(/["\\]/g, '\\$&');
}
