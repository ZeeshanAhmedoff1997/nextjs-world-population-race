'use client';

import { useEffect } from 'react';

import type { ChartLeader } from '@/types/chart';
import { useLiveRegion } from '@/utils/a11y';

export function useA11yAnnouncement(year: number, leader: ChartLeader) {
  const announce = useLiveRegion();

  useEffect(() => {
    announce(
      `Year changed to ${year}. Top: ${leader?.name ?? 'none'} ${leader?.pop ?? 0}.`,
    );
  }, [year, leader, announce]);
}
