'use client';

import { useEffect } from 'react';

import type { ChartLeader } from '@/types/chart';
import { useLiveRegion } from '@/utils/a11y';

export function useA11yAnnouncement(year: number, leader: ChartLeader) {
  const announce = useLiveRegion();

  useEffect(() => {
    const name = leader?.name ?? 'none';
    const pop = leader?.pop ?? 0;
    announce(`Year changed to ${year}. Top: ${name} ${pop}.`);
  }, [year, leader?.name, leader?.pop, announce]);
}
