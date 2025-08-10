import { list } from 'country-flag-emoji';

// Type definition for country flag emoji library items
type CountryFlagItem = {
  code: string;
  unicode: string;
  name: string;
  emoji: string;
};

/** Stable gradient colors per country (OKLCH for nicer ramps + accessibility). */
export function colorFor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const hue = Math.abs(h) % 360;

  // Create gradient colors with same hue but different lightness
  const color1 = `oklch(75% 0.16 ${hue})`;
  const color2 = `oklch(55% 0.12 ${hue})`;

  return {
    color1,
    color2,
    id: `gradient-${name.replace(/\s+/g, '-').toLowerCase()}`,
  };
}

/**
 * Get country flag emoji dynamically using the library
 * Falls back to 🌍 globe emoji if no flag is found
 */
export function getCountryFlag(countryName: string): string {
  // Cast the list to our type to avoid TypeScript errors
  const flagList = list as CountryFlagItem[];

  // Search for exact match first
  let found = flagList.find(
    (item: CountryFlagItem) => item.name === countryName,
  );

  // If not found, try case-insensitive search
  if (!found) {
    found = flagList.find(
      (item: CountryFlagItem) =>
        item.name.toLowerCase() === countryName.toLowerCase(),
    );
  }

  // If still not found, try partial matches
  if (!found) {
    found = flagList.find(
      (item: CountryFlagItem) =>
        item.name.toLowerCase().includes(countryName.toLowerCase()) ||
        countryName.toLowerCase().includes(item.name.toLowerCase()),
    );
  }

  // Try common country name variations
  if (!found) {
    const variations = [
      countryName.replace(/^The\s+/i, ''), // Remove "The" prefix
      countryName.replace('United States', 'United States of America'),
      countryName.replace('Russia', 'Russian Federation'),
      countryName.replace('Vietnam', 'Viet Nam'),
    ];

    for (const variation of variations) {
      found = flagList.find(
        (item: CountryFlagItem) =>
          item.name.toLowerCase() === variation.toLowerCase(),
      );
      if (found) break;
    }
  }

  // Return flag emoji or default globe
  return found ? found.emoji : '🌍';
}
