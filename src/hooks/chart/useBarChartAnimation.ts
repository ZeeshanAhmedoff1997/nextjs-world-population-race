'use client';

import { useLayoutEffect, useRef } from 'react';

import { CHART_ANIMATION } from '@/constants/animation';
import type { AnimationState, UseBarAnimationArgs } from '@/types/chart';
import {
  cancelAnimations,
  createSafeWidth,
  shouldSkipAnimation,
} from '@/utils/animation';
import { cssEscape, ease } from '@/utils/chart';

export function useBarChartAnimation(
  rootRef: React.RefObject<SVGGElement | null>,
  { rows, year, x, y, reducedMotion }: UseBarAnimationArgs,
) {
  const prev = useRef(new Map<string, AnimationState>());

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const next = new Map<string, AnimationState>();
    for (const r of rows) {
      next.set(r.name, { y: y(r.name), w: x(r.pop), val: r.pop });
    }

    if (prev.current.size && !reducedMotion) {
      for (const r of rows) {
        const key = r.name;
        const last = next.get(key)!;
        const first = prev.current.get(key) ?? last;

        if (shouldSkipAnimation(first.y, last.y, first.w, last.w)) continue;

        const rowEl = root.querySelector<SVGGElement>(
          `[data-key="${cssEscape(key)}"]`,
        );
        if (!rowEl) continue;

        const dy = first.y - last.y;
        const firstW = createSafeWidth(first.w, 1);
        const lastW = createSafeWidth(last.w, 1);
        const sx = firstW / lastW;

        cancelAnimations(rowEl);

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
              duration: CHART_ANIMATION.DURATION,
              easing: CHART_ANIMATION.EASING,
              fill: 'forwards',
            },
          );
        }

        const rect = rowEl.querySelector('rect');
        if (rect && Math.abs(first.w - last.w) > 1) {
          cancelAnimations(rect);
          const fromW = createSafeWidth(first.w, 2);
          const toW = createSafeWidth(last.w, 2);
          rect.animate([{ width: fromW }, { width: toW }], {
            duration: CHART_ANIMATION.DURATION,
            easing: CHART_ANIMATION.EASING,
            fill: 'forwards',
          });
        }

        const label = rowEl.querySelector(
          '[data-bar="value"]',
        ) as SVGTextElement | null;
        if (label) {
          const from = first.val;
          const to = last.val;

          if (from !== to) {
            const t0 = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - t0) / CHART_ANIMATION.DURATION);
              const progress = ease(p);

              if (to === 0) {
                const v = Math.round(from * (1 - progress));
                label.textContent =
                  v === 0 ? '—' : Intl.NumberFormat().format(v);
              } else if (from === 0) {
                const v = Math.round(to * progress);
                label.textContent =
                  v === 0 ? '—' : Intl.NumberFormat().format(v);
              } else {
                const v = Math.round(from + (to - from) * progress);
                label.textContent = Intl.NumberFormat().format(v);
              }
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }
      }
    }

    prev.current = next;
  }, [rows, year, x, y, reducedMotion, rootRef]);
}
