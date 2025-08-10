import { Suspense } from 'react';

import ChartPage from '@/components/chart/ChartPage';
import { getYears, getSlice, getMaxPop, getAllSlices } from '@/lib/data';

export default function Page() {
  const years = getYears();
  const initialYear = years[0] ?? 0;

  return (
    <Suspense fallback={null}>
      <ChartPage
        years={years}
        initialYear={initialYear}
        initialRows={getSlice(initialYear)}
        maxPop={getMaxPop()}
        slicesByYear={getAllSlices()}
      />
    </Suspense>
  );
}
