import { z } from 'zod';

export const Row = z.object({
  Country: z
    .string()
    .min(1)
    .transform((s) => s.trim()),
  Population: z.number().nonnegative(),
});

export const YearBlock = z.object({
  Year: z.number().int(),
  Countries: z.array(Row),
});

export const Dataset = z.array(YearBlock);

export function safeParseDataset(input: unknown) {
  const result = Dataset.safeParse(input);
  if (!result.success) {
    // no-op in production; suppress console in lint
  }
  return result.success ? result.data : [];
}
