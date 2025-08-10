import rawJson from './populationByYear-2.json' assert { type: 'json' };
import { safeParseDataset } from './schema';

export function parseRaw() {
  return safeParseDataset(rawJson);
}
