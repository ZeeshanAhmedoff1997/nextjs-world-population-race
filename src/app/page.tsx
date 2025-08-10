import ChartPage from '@/components/chart/ChartPage';
import { getYears, getSlice, getMaxPop, getAllSlices } from '@/lib/data';

export default function Page() {
  const years = getYears();
  const initialYear = years[0] ?? 0;

  return (
    <ChartPage
      years={years}
      initialYear={initialYear}
      initialRows={getSlice(initialYear)}
      maxPop={getMaxPop()}
      slicesByYear={getAllSlices()}
    />
  );
}
