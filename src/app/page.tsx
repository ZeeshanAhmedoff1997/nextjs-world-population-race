import ChartPage from '@/components/chart/ChartPage';
import { getYears, getSlice, getMaxPop, getAllSlices } from '@/lib/data/load';

export default function Page() {
  const years = getYears();
  const initialYear = years[0] ?? 0;

  return (
    <ChartPage
      years={years}
      initialYear={initialYear}
      initialRows={getSlice(initialYear, 15)} // Show 15 countries for bonus
      maxPop={getMaxPop()}
      slicesByYear={getAllSlices(15)} // Use top 15 for smooth animations
    />
  );
}
