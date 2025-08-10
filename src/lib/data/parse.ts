import rawJson from './populationByYear-1990-2025.json' assert { type: 'json' };
import { safeParseDataset } from './schema';

export function parseRaw() {
  return safeParseDataset(rawJson);
}
